package br.com.tinnova.desafio_tinnova_back.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import br.com.tinnova.desafio_tinnova_back.dto.VehicleCreateDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleUpdateDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Brand;
import br.com.tinnova.desafio_tinnova_back.entity.Model;
import br.com.tinnova.desafio_tinnova_back.entity.Vehicle;
import br.com.tinnova.desafio_tinnova_back.repository.BrandRepository;
import br.com.tinnova.desafio_tinnova_back.repository.ModelRepository;
import br.com.tinnova.desafio_tinnova_back.repository.VehicleRepository;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ModelRepository modelRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void testListAllVehicles() {
        // Arrange
        List<Vehicle> vehicles = Arrays.asList(
            createTestVehicle(1L, "ABC-1234"),
            createTestVehicle(2L, "XYZ-5678")
        );
        when(vehicleRepository.findAll()).thenReturn(vehicles);

        // Act
        List<Vehicle> result = vehicleService.listAllVehicles();

        // Assert
        assertEquals(2, result.size());
        verify(vehicleRepository).findAll();
    }

    @Test
    void testListAllVehiclesWithDetails() {
        // Arrange
        List<Vehicle> vehicles = Arrays.asList(createTestVehicle(1L, "ABC-1234"));
        when(vehicleRepository.findAllWithBrandAndModel()).thenReturn(vehicles);

        // Act
        List<VehicleResponseDTO> result = vehicleService.listAllVehiclesWithDetails();

        // Assert
        assertEquals(1, result.size());
        VehicleResponseDTO dto = result.get(0);
        assertEquals(1L, dto.getId());
        assertEquals("ABC-1234", dto.getPlate());
        verify(vehicleRepository).findAllWithBrandAndModel();
    }

    @Test
    void testCreateVehicle_ValidData() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1234");
        dto.setBrandId(1L);
        dto.setModelId(1L);
        dto.setYear(2020);
        dto.setDescription("Test vehicle");
        dto.setIsSold(false);

        Brand brand = createTestBrand(1L, "Toyota");
        Model model = createTestModel(1L, "Corolla", brand);
        Vehicle savedVehicle = createTestVehicle(1L, "ABC-1234");

        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(modelRepository.findById(1L)).thenReturn(Optional.of(model));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedVehicle);

        // Act
        Vehicle result = vehicleService.createVehicle(dto);

        // Assert
        assertNotNull(result);
        assertEquals("ABC-1234", result.getPlate());
        verify(brandRepository).findById(1L);
        verify(modelRepository).findById(1L);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void testCreateVehicle_InvalidPlate() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("INVALID");
        dto.setBrandId(1L);
        dto.setModelId(1L);
        dto.setYear(2020);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto)
        );
        assertTrue(exception.getMessage().contains("Placa inválida"));
    }

    @Test
    void testCreateVehicle_BrandNotFound() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1234");
        dto.setBrandId(999L);
        dto.setModelId(1L);
        dto.setYear(2020);

        when(brandRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto)
        );
        assertTrue(exception.getMessage().contains("Marca não encontrada"));
    }

    @Test
    void testCreateVehicle_ModelNotFound() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1234");
        dto.setBrandId(1L);
        dto.setModelId(999L);
        dto.setYear(2020);

        Brand brand = createTestBrand(1L, "Toyota");
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(modelRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto)
        );
        assertTrue(exception.getMessage().contains("Modelo não encontrado"));
    }

    @Test
    void testCreateVehicle_DataIntegrityViolation() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1234");
        dto.setBrandId(1L);
        dto.setModelId(1L);
        dto.setYear(2020);

        Brand brand = createTestBrand(1L, "Toyota");
        Model model = createTestModel(1L, "Corolla", brand);

        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(modelRepository.findById(1L)).thenReturn(Optional.of(model));
        when(vehicleRepository.save(any(Vehicle.class))).thenThrow(new DataIntegrityViolationException("Duplicate plate"));

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto)
        );
        assertTrue(exception.getMessage().contains("Falha ao criar veículo"));
    }

    @Test
    void testUpdateVehicle_ValidData() {
        // Arrange
        Long vehicleId = 1L;
        VehicleUpdateDTO dto = new VehicleUpdateDTO();
        dto.setPlate("XYZ-5678");
        dto.setYear(2021);

        Vehicle existingVehicle = createTestVehicle(vehicleId, "ABC-1234");
        Vehicle updatedVehicle = createTestVehicle(vehicleId, "XYZ-5678");

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(existingVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(updatedVehicle);

        // Act
        Vehicle result = vehicleService.updateVehicle(vehicleId, dto);

        // Assert
        assertNotNull(result);
        verify(vehicleRepository).findById(vehicleId);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void testUpdateVehicle_VehicleNotFound() {
        // Arrange
        Long vehicleId = 999L;
        VehicleUpdateDTO dto = new VehicleUpdateDTO();
        dto.setPlate("XYZ-5678");

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.updateVehicle(vehicleId, dto)
        );
        assertTrue(exception.getMessage().contains("Veículo não encontrado"));
    }

    @Test
    void testDeleteVehicle_Success() {
        // Arrange
        Long vehicleId = 1L;
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);

        // Act
        assertDoesNotThrow(() -> vehicleService.deleteVehicle(vehicleId));

        // Assert
        verify(vehicleRepository).existsById(vehicleId);
        verify(vehicleRepository).deleteById(vehicleId);
    }

    @Test
    void testDeleteVehicle_VehicleNotFound() {
        // Arrange
        Long vehicleId = 999L;
        when(vehicleRepository.existsById(vehicleId)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.deleteVehicle(vehicleId)
        );
        assertTrue(exception.getMessage().contains("Veículo não encontrado"));
    }

    @Test
    void testDeleteVehicle_DataIntegrityViolation() {
        // Arrange
        Long vehicleId = 1L;
        when(vehicleRepository.existsById(vehicleId)).thenReturn(true);
        doThrow(new DataIntegrityViolationException("FK constraint")).when(vehicleRepository).deleteById(vehicleId);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.deleteVehicle(vehicleId)
        );
        assertTrue(exception.getMessage().contains("Falha ao deletar veículo"));
    }

    @Test
    void testGetAllBrands() {
        // Arrange
        List<Brand> brands = Arrays.asList(
            createTestBrand(1L, "Toyota"),
            createTestBrand(2L, "Honda")
        );
        when(brandRepository.findAllByOrderByNameAsc()).thenReturn(brands);

        // Act
        var result = vehicleService.getAllBrands();

        // Assert
        assertEquals(2, result.size());
        assertEquals("Toyota", result.get(0).getName());
        assertEquals("Honda", result.get(1).getName());
        verify(brandRepository).findAllByOrderByNameAsc();
    }

    @Test
    void testGetModelsByBrand() {
        // Arrange
        String brandId = "1";
        Brand brand = createTestBrand(1L, "Toyota");
        List<Model> models = Arrays.asList(
            createTestModel(1L, "Corolla", brand),
            createTestModel(2L, "Camry", brand)
        );
        when(modelRepository.findByBrandId(1L)).thenReturn(models);

        // Act
        var result = vehicleService.getModelsByBrand(brandId);

        // Assert
        assertEquals(2, result.size());
        assertEquals("Corolla", result.get(0).getName());
        assertEquals("Camry", result.get(1).getName());
        verify(modelRepository).findByBrandId(1L);
    }

    @Test
    void testGetModelsByBrand_InvalidBrandId() {
        // Arrange
        String invalidBrandId = "invalid";

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.getModelsByBrand(invalidBrandId)
        );
        assertTrue(exception.getMessage().contains("Formato de ID de marca inválido"));
    }

    @Test
    void testGetBrandById_Success() {
        // Arrange
        String brandId = "1";
        Brand brand = createTestBrand(1L, "Toyota");
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));

        // Act
        var result = vehicleService.getBrandById(brandId);

        // Assert
        assertEquals("1", result.getId());
        assertEquals("Toyota", result.getName());
        verify(brandRepository).findById(1L);
    }

    @Test
    void testGetBrandById_NotFound() {
        // Arrange
        String brandId = "999";
        when(brandRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.getBrandById(brandId)
        );
        assertTrue(exception.getMessage().contains("Marca não encontrada"));
    }

    @Test
    void testGetModelById_Success() {
        // Arrange
        String modelId = "1";
        Brand brand = createTestBrand(1L, "Toyota");
        Model model = createTestModel(1L, "Corolla", brand);
        when(modelRepository.findById(1L)).thenReturn(Optional.of(model));

        // Act
        var result = vehicleService.getModelById(modelId);

        // Assert
        assertEquals("1", result.getId());
        assertEquals("Corolla", result.getName());
        assertEquals("1", result.getBrandId());
        verify(modelRepository).findById(1L);
    }

    @Test
    void testGetModelById_NotFound() {
        // Arrange
        String modelId = "999";
        when(modelRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.getModelById(modelId)
        );
        assertTrue(exception.getMessage().contains("Modelo não encontrado"));
    }

    // Helper methods
    private Vehicle createTestVehicle(Long id, String plate) {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(id);
        vehicle.setPlate(plate);
        vehicle.setYear(2020);
        vehicle.setDescription("Test vehicle");
        vehicle.setIsSold(false);
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setUpdatedAt(LocalDateTime.now());
        
        Brand brand = createTestBrand(1L, "Toyota");
        Model model = createTestModel(1L, "Corolla", brand);
        
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        
        return vehicle;
    }

    private Brand createTestBrand(Long id, String name) {
        Brand brand = new Brand();
        brand.setId(id);
        brand.setName(name);
        brand.setCreatedAt(LocalDateTime.now());
        return brand;
    }

    private Model createTestModel(Long id, String name, Brand brand) {
        Model model = new Model();
        model.setId(id);
        model.setName(name);
        model.setBrand(brand);
        model.setCreatedAt(LocalDateTime.now());
        return model;
    }
}
