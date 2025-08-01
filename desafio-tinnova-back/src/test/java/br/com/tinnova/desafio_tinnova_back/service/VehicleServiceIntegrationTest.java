package br.com.tinnova.desafio_tinnova_back.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import br.com.tinnova.desafio_tinnova_back.dto.VehicleCreateDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.VehicleUpdateDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Brand;
import br.com.tinnova.desafio_tinnova_back.entity.Model;
import br.com.tinnova.desafio_tinnova_back.entity.Vehicle;
import br.com.tinnova.desafio_tinnova_back.repository.BrandRepository;
import br.com.tinnova.desafio_tinnova_back.repository.ModelRepository;
import br.com.tinnova.desafio_tinnova_back.repository.VehicleRepository;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class VehicleServiceIntegrationTest {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ModelRepository modelRepository;

    private Brand testBrand;
    private Model testModel;

    @BeforeEach
    void setUp() {
        // Limpar dados
        vehicleRepository.deleteAll();
        modelRepository.deleteAll();
        brandRepository.deleteAll();

        // Criar dados de teste únicos para cada execução
        testBrand = new Brand("TestBrand_" + System.currentTimeMillis());
        testBrand = brandRepository.save(testBrand);

        testModel = new Model();
        testModel.setName("TestModel_" + System.currentTimeMillis());
        testModel.setBrand(testBrand);
        testModel = modelRepository.save(testModel);
    }

    @Test
    void testCreateVehicle_Integration() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1234");
        dto.setBrandId(testBrand.getId());
        dto.setModelId(testModel.getId());
        dto.setYear(2020);
        dto.setDescription("Test vehicle");
        dto.setIsSold(false);

        // Act
        Vehicle result = vehicleService.createVehicle(dto);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("ABC-1234", result.getPlate());
        assertEquals(testBrand.getId(), result.getBrand().getId());
        assertEquals(testModel.getId(), result.getModel().getId());
        assertEquals(2020, result.getYear());
        assertEquals("Test vehicle", result.getDescription());
        assertFalse(result.getIsSold());
    }

    @Test
    void testCreateVehicle_MercosulPlate() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("ABC-1A23");
        dto.setBrandId(testBrand.getId());
        dto.setModelId(testModel.getId());
        dto.setYear(2022);
        dto.setDescription("Mercosul plate vehicle");

        // Act
        Vehicle result = vehicleService.createVehicle(dto);

        // Assert
        assertNotNull(result);
        assertEquals("ABC-1A23", result.getPlate());
    }

    @Test
    void testCreateVehicle_InvalidPlate_ShouldThrowException() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("INVALID-PLATE");
        dto.setBrandId(testBrand.getId());
        dto.setModelId(testModel.getId());
        dto.setYear(2020);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto)
        );
        assertTrue(exception.getMessage().contains("Placa inválida"));
    }

    @Test
    void testListAllVehiclesWithDetails_Integration() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("XYZ-5678");
        dto.setBrandId(testBrand.getId());
        dto.setModelId(testModel.getId());
        dto.setYear(2021);
        dto.setDescription("Another test vehicle");
        dto.setIsSold(true);

        vehicleService.createVehicle(dto);

        // Act
        List<VehicleResponseDTO> result = vehicleService.listAllVehiclesWithDetails();

        // Assert
        assertFalse(result.isEmpty());
        VehicleResponseDTO vehicleDto = result.get(0);
        assertEquals("XYZ-5678", vehicleDto.getPlate());
        assertEquals(testBrand.getName(), vehicleDto.getBrandName());
        assertEquals(testModel.getName(), vehicleDto.getModelName());
        assertEquals(2021, vehicleDto.getYear());
        assertTrue(vehicleDto.getIsSold());
    }

    @Test
    void testUpdateVehicle_Integration() {
        // Arrange - Criar veículo primeiro
        VehicleCreateDTO createDto = new VehicleCreateDTO();
        createDto.setPlate("OLD-1234");
        createDto.setBrandId(testBrand.getId());
        createDto.setModelId(testModel.getId());
        createDto.setYear(2019);
        createDto.setDescription("Old description");
        createDto.setIsSold(false);

        Vehicle createdVehicle = vehicleService.createVehicle(createDto);

        // Arrange - Dados para atualização
        VehicleUpdateDTO updateDto = new VehicleUpdateDTO();
        updateDto.setPlate("NEW-5678");
        updateDto.setYear(2023);
        updateDto.setDescription("Updated description");
        updateDto.setIsSold(true);

        // Act
        Vehicle result = vehicleService.updateVehicle(createdVehicle.getId(), updateDto);

        // Assert
        assertEquals("NEW-5678", result.getPlate());
        assertEquals(2023, result.getYear());
        assertEquals("Updated description", result.getDescription());
        assertTrue(result.getIsSold());
    }

    @Test
    void testPartialUpdateVehicle_Integration() {
        // Arrange - Criar veículo primeiro
        VehicleCreateDTO createDto = new VehicleCreateDTO();
        createDto.setPlate("PART-1234");
        createDto.setBrandId(testBrand.getId());
        createDto.setModelId(testModel.getId());
        createDto.setYear(2020);
        createDto.setDescription("Original description");
        createDto.setIsSold(false);

        Vehicle createdVehicle = vehicleService.createVehicle(createDto);

        // Arrange - Atualização parcial (apenas ano)
        VehicleUpdateDTO updateDto = new VehicleUpdateDTO();
        updateDto.setYear(2024);

        // Act
        Vehicle result = vehicleService.partialUpdateVehicle(createdVehicle.getId(), updateDto);

        // Assert
        assertEquals("PART-1234", result.getPlate()); // Não mudou
        assertEquals(2024, result.getYear()); // Mudou
        assertEquals("Original description", result.getDescription()); // Não mudou
        assertFalse(result.getIsSold()); // Não mudou
    }

    @Test
    void testDeleteVehicle_Integration() {
        // Arrange
        VehicleCreateDTO dto = new VehicleCreateDTO();
        dto.setPlate("DEL-1234");
        dto.setBrandId(testBrand.getId());
        dto.setModelId(testModel.getId());
        dto.setYear(2020);

        Vehicle createdVehicle = vehicleService.createVehicle(dto);
        Long vehicleId = createdVehicle.getId();

        // Verificar que o veículo existe
        assertTrue(vehicleRepository.existsById(vehicleId));

        // Act
        vehicleService.deleteVehicle(vehicleId);

        // Assert
        assertFalse(vehicleRepository.existsById(vehicleId));
    }

    @Test
    void testGetAllBrands_Integration() {
        // Arrange - Criar mais uma marca
        Brand anotherBrand = new Brand("Honda");
        brandRepository.save(anotherBrand);

        // Act
        var result = vehicleService.getAllBrands();

        // Assert
        assertEquals(2, result.size());
        // Verificar ordenação por nome
        assertTrue(result.stream().anyMatch(b -> b.getName().equals("Honda")));
        assertTrue(result.stream().anyMatch(b -> b.getName().equals("Toyota")));
    }

    @Test
    void testGetModelsByBrand_Integration() {
        // Arrange - Criar mais um modelo para a mesma marca
        Model anotherModel = new Model();
        anotherModel.setName("Camry");
        anotherModel.setBrand(testBrand);
        modelRepository.save(anotherModel);

        // Act
        var result = vehicleService.getModelsByBrand(testBrand.getId().toString());

        // Assert
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(m -> m.getName().equals("Corolla")));
        assertTrue(result.stream().anyMatch(m -> m.getName().equals("Camry")));
    }

    @Test
    void testGetBrandById_Integration() {
        // Act
        var result = vehicleService.getBrandById(testBrand.getId().toString());

        // Assert
        assertEquals(testBrand.getId().toString(), result.getId());
        assertEquals("Toyota", result.getName());
    }

    @Test
    void testGetModelById_Integration() {
        // Act
        var result = vehicleService.getModelById(testModel.getId().toString());

        // Assert
        assertEquals(testModel.getId().toString(), result.getId());
        assertEquals("Corolla", result.getName());
        assertEquals(testBrand.getId().toString(), result.getBrandId());
    }

    @Test
    void testCreateVehicle_DuplicatePlate_ShouldThrowException() {
        // Arrange - Criar primeiro veículo
        VehicleCreateDTO dto1 = new VehicleCreateDTO();
        dto1.setPlate("DUP-1234");
        dto1.setBrandId(testBrand.getId());
        dto1.setModelId(testModel.getId());
        dto1.setYear(2020);

        vehicleService.createVehicle(dto1);

        // Arrange - Tentar criar segundo veículo com mesma placa
        VehicleCreateDTO dto2 = new VehicleCreateDTO();
        dto2.setPlate("DUP-1234");
        dto2.setBrandId(testBrand.getId());
        dto2.setModelId(testModel.getId());
        dto2.setYear(2021);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> vehicleService.createVehicle(dto2)
        );
        assertTrue(exception.getMessage().contains("Falha ao criar veículo"));
    }
}
