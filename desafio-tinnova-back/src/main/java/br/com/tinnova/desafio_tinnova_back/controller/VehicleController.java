package br.com.tinnova.desafio_tinnova_back.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tinnova.desafio_tinnova_back.dto.VehicleBrandDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleCreateDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleModelDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleUpdateDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Vehicle;
import br.com.tinnova.desafio_tinnova_back.service.VehicleService;



@RestController
@CrossOrigin
@RequestMapping("/api/veiculos")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<VehicleResponseDTO> listAll() {
        return vehicleService.listAllVehiclesWithDetails();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Vehicle> createVehicle(@RequestBody VehicleCreateDTO vehicleDTO) {
        Vehicle createdVehicle = vehicleService.createVehicle(vehicleDTO);
        return ResponseEntity.ok(createdVehicle);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody VehicleUpdateDTO vehicleDTO) {
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDTO);
        return ResponseEntity.ok(updatedVehicle);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Vehicle> partialUpdateVehicle(@PathVariable Long id, @RequestBody VehicleUpdateDTO vehicleDTO) {
        Vehicle updatedVehicle = vehicleService.partialUpdateVehicle(id, vehicleDTO);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVehicleWithMessage(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(Map.of("message", "Veículo deletado com sucesso"));
    }

    // Endpoints para marcas e modelos
    @GetMapping("/marcas")
    public ResponseEntity<List<VehicleBrandDTO>> getAllBrands() {
        List<VehicleBrandDTO> brands = vehicleService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/marcas/{brandId}/modelos")
    public ResponseEntity<List<VehicleModelDTO>> getModelsByBrand(@PathVariable String brandId) {
        List<VehicleModelDTO> models = vehicleService.getModelsByBrand(brandId);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/marcas/{brandId}")
    public ResponseEntity<VehicleBrandDTO> getBrandById(@PathVariable String brandId) {
        VehicleBrandDTO brand = vehicleService.getBrandById(brandId);
        if (brand != null) {
            return ResponseEntity.ok(brand);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/modelos/{modelId}")
    public ResponseEntity<VehicleModelDTO> getModelById(@PathVariable String modelId) {
        VehicleModelDTO model = vehicleService.getModelById(modelId);
        if (model != null) {
            return ResponseEntity.ok(model);
        }
        return ResponseEntity.notFound().build();
    }
}
