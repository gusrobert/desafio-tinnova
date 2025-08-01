package br.com.tinnova.desafio_tinnova_back.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.tinnova.desafio_tinnova_back.dto.VehicleBrandDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleCreateDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleModelDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleResponseDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Brand;
import br.com.tinnova.desafio_tinnova_back.entity.Model;
import br.com.tinnova.desafio_tinnova_back.entity.Vehicle;
import br.com.tinnova.desafio_tinnova_back.repository.BrandRepository;
import br.com.tinnova.desafio_tinnova_back.repository.ModelRepository;
import br.com.tinnova.desafio_tinnova_back.repository.VehicleRepository;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    private final BrandRepository brandRepository;
    private final ModelRepository modelRepository;

    public VehicleService(VehicleRepository vehicleRepository, BrandRepository brandRepository, ModelRepository modelRepository) {
        this.vehicleRepository = vehicleRepository;
        this.brandRepository = brandRepository;
        this.modelRepository = modelRepository;
    }

    public List<Vehicle> listAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> listAllVehiclesWithDetails() {
        return vehicleRepository.findAllWithBrandAndModel().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    private VehicleResponseDTO convertToResponseDTO(Vehicle vehicle) {
        return new VehicleResponseDTO(
            vehicle.getId(),
            vehicle.getBrand().getName(),
            vehicle.getModel().getName(),
            vehicle.getYear(),
            vehicle.getDescription(),
            vehicle.getIsSold(),
            vehicle.getCreatedAt(),
            vehicle.getUpdatedAt()
        );
    }

    public Vehicle createVehicle(VehicleCreateDTO vehicleDTO) {
        // Buscar a marca
        Brand brand = brandRepository.findById(vehicleDTO.getBrandId())
            .orElseThrow(() -> new RuntimeException("Marca não encontrada com ID: " + vehicleDTO.getBrandId()));
        
        // Buscar o modelo
        Model model = modelRepository.findById(vehicleDTO.getModelId())
            .orElseThrow(() -> new RuntimeException("Modelo não encontrado com ID: " + vehicleDTO.getModelId()));
        
        // Criar o veículo
        Vehicle vehicle = new Vehicle();
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setYear(vehicleDTO.getYear());
        vehicle.setDescription(vehicleDTO.getDescription());
        
        Boolean isSold = vehicleDTO.getIsSold();
        vehicle.setIsSold(Boolean.TRUE.equals(isSold));
        
        try {
            return vehicleRepository.save(vehicle);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Falha ao criar veículo: " + e.getMessage(), e);
        }
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setId(null);

        if (vehicle.getIsSold() == null) {
            vehicle.setIsSold(false);
        }
        
        try {
            return vehicleRepository.save(vehicle);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Falha ao criar veículo: " + e.getMessage(), e);
        }
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Optional<Vehicle> existingVehicleOpt = vehicleRepository.findById(id);
        if (!existingVehicleOpt.isPresent()) {
            throw new RuntimeException("Veículo não encontrado com id: " + id);
        }

        Vehicle existingVehicle = existingVehicleOpt.get();
        
        // Validar e definir o modelo
        if (vehicle.getModel() != null && vehicle.getModel().getId() != null) {
            Model model = modelRepository.findById(vehicle.getModel().getId())
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado com o id: " + vehicle.getModel().getId()));
            existingVehicle.setModel(model);
        }
        
        // Validar e definir a marca
        if (vehicle.getBrand() != null && vehicle.getBrand().getId() != null) {
            Brand brand = brandRepository.findById(vehicle.getBrand().getId())
                .orElseThrow(() -> new RuntimeException("Marca não encontrada com id: " + vehicle.getBrand().getId()));
            existingVehicle.setBrand(brand);
        }
        
        existingVehicle.setYear(vehicle.getYear());
        existingVehicle.setDescription(vehicle.getDescription());
        existingVehicle.setIsSold(vehicle.getIsSold());

        try {
            return vehicleRepository.save(existingVehicle);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Falha ao atualizar veículo: " + e.getMessage(), e);
        }
    }

    public Vehicle partialUpdateVehicle(Long id, Vehicle vehicle) {
        Optional<Vehicle> existingVehicleOpt = vehicleRepository.findById(id);
        if (!existingVehicleOpt.isPresent()) {
            throw new RuntimeException("Veículo não encontrado com id: " + id);
        }

        Vehicle existingVehicle = existingVehicleOpt.get();
        
        // Atualizar apenas os campos que não são null no objeto recebido
        if (vehicle.getModel() != null && vehicle.getModel().getId() != null) {
            Model model = modelRepository.findById(vehicle.getModel().getId())
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado com id: " + vehicle.getModel().getId()));
            existingVehicle.setModel(model);
        }
        
        if (vehicle.getBrand() != null && vehicle.getBrand().getId() != null) {
            Brand brand = brandRepository.findById(vehicle.getBrand().getId())
                .orElseThrow(() -> new RuntimeException("Marca não encontrada com id: " + vehicle.getBrand().getId()));
            existingVehicle.setBrand(brand);
        }
        
        if (vehicle.getYear() != 0) { // Para int, verificamos se não é zero
            existingVehicle.setYear(vehicle.getYear());
        }
        
        if (vehicle.getDescription() != null) {
            existingVehicle.setDescription(vehicle.getDescription());
        }

        if (vehicle.getIsSold() != null) {
            existingVehicle.setIsSold(vehicle.getIsSold());
        }

        try {
            return vehicleRepository.save(existingVehicle);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Falha ao atualizar parcialmente veículo: " + e.getMessage(), e);
        }
    }

    public void deleteVehicle(Long id) {
        try {
            if (!vehicleRepository.existsById(id)) {
                throw new RuntimeException("Veículo não encontrado com id: " + id);
            }
            vehicleRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Falha ao deletar veículo: " + e.getMessage(), e);
        }
    }

    public List<VehicleBrandDTO> getAllBrands() {
        return brandRepository.findAllByOrderByNameAsc().stream()
            .map(brand -> new VehicleBrandDTO(brand.getId().toString(), brand.getName()))
            .collect(Collectors.toList());
    }

    public List<VehicleModelDTO> getModelsByBrand(String brandId) {
        try {
            Long id = Long.valueOf(brandId);
            return modelRepository.findByBrandId(id).stream()
                .map(model -> new VehicleModelDTO(
                    model.getId().toString(), 
                    model.getName(), 
                    model.getBrand().getId().toString()
                ))
                .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Formato de ID de marca inválido: " + brandId);
        }
    }

    public VehicleBrandDTO getBrandById(String brandId) {
        try {
            Long id = Long.valueOf(brandId);
            Optional<Brand> brand = brandRepository.findById(id);
            if (brand.isPresent()) {
                Brand b = brand.get();
                return new VehicleBrandDTO(b.getId().toString(), b.getName());
            } else {
                throw new RuntimeException("Marca não encontrada com id: " + brandId);
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("Formato de ID de marca inválido: " + brandId);
        }
    }

    public VehicleModelDTO getModelById(String modelId) {
        try {
            Long id = Long.valueOf(modelId);
            Optional<Model> model = modelRepository.findById(id);
            if (model.isPresent()) {
                Model m = model.get();
                return new VehicleModelDTO(
                    m.getId().toString(), 
                    m.getName(), 
                    m.getBrand().getId().toString()
                );
            } else {
                throw new RuntimeException("Modelo não encontrado com id: " + modelId);
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("Formato de ID de modelo inválido: " + modelId);
        }
    }
}
