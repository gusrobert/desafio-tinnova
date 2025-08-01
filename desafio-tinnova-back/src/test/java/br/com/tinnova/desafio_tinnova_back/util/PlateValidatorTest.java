package br.com.tinnova.desafio_tinnova_back.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import br.com.tinnova.desafio_tinnova_back.util.PlateValidator.PlateType;

class PlateValidatorTest {

    @Test
    void testIsValidPlate_BrazilianFormat_Valid() {
        // Arrange & Act & Assert
        assertTrue(PlateValidator.isValidPlate("ABC-1234"));
        assertTrue(PlateValidator.isValidPlate("XYZ-9876"));
        assertTrue(PlateValidator.isValidPlate("DEF-0000"));
    }

    @Test
    void testIsValidPlate_MercosulFormat_Valid() {
        // Arrange & Act & Assert
        assertTrue(PlateValidator.isValidPlate("ABC-1A23"));
        assertTrue(PlateValidator.isValidPlate("XYZ-9B87"));
        assertTrue(PlateValidator.isValidPlate("DEF-0C00"));
    }

    @Test
    void testIsValidPlate_InvalidFormats() {
        // Arrange & Act & Assert
        assertFalse(PlateValidator.isValidPlate("ABC1234")); // sem hífen
        assertFalse(PlateValidator.isValidPlate("AB-1234")); // apenas 2 letras
        assertFalse(PlateValidator.isValidPlate("ABCD-1234")); // 4 letras
        assertFalse(PlateValidator.isValidPlate("ABC-123")); // apenas 3 números
        assertFalse(PlateValidator.isValidPlate("ABC-12345")); // 5 números
        assertFalse(PlateValidator.isValidPlate("123-ABCD")); // formato invertido
        assertFalse(PlateValidator.isValidPlate("ABC-AB12")); // formato inválido
        assertFalse(PlateValidator.isValidPlate("ABC-1AB2")); // formato inválido
    }

    @Test
    void testIsValidPlate_NullAndEmpty() {
        // Arrange & Act & Assert
        assertFalse(PlateValidator.isValidPlate(null));
        assertFalse(PlateValidator.isValidPlate(""));
        assertFalse(PlateValidator.isValidPlate("   "));
    }

    @Test
    void testIsValidPlate_CaseInsensitive() {
        // Arrange & Act & Assert
        assertTrue(PlateValidator.isValidPlate("abc-1234"));
        assertTrue(PlateValidator.isValidPlate("Abc-1234"));
        assertTrue(PlateValidator.isValidPlate("ABC-1234"));
        assertTrue(PlateValidator.isValidPlate("abc-1a23"));
        assertTrue(PlateValidator.isValidPlate("ABC-1A23"));
    }

    @Test
    void testIsValidPlate_WithSpaces() {
        // Arrange & Act & Assert
        assertTrue(PlateValidator.isValidPlate(" ABC-1234 "));
        assertTrue(PlateValidator.isValidPlate("  ABC-1A23  "));
    }

    @Test
    void testNormalizePlate_Valid() {
        // Arrange & Act & Assert
        assertEquals("ABC-1234", PlateValidator.normalizePlate("abc-1234"));
        assertEquals("ABC-1234", PlateValidator.normalizePlate(" abc-1234 "));
        assertEquals("XYZ-1A23", PlateValidator.normalizePlate("xyz-1a23"));
        assertEquals("ABC-1234", PlateValidator.normalizePlate("ABC-1234"));
    }

    @Test
    void testNormalizePlate_Null() {
        // Arrange & Act & Assert
        assertNull(PlateValidator.normalizePlate(null));
    }

    @Test
    void testNormalizePlate_Empty() {
        // Arrange & Act & Assert
        assertEquals("", PlateValidator.normalizePlate(""));
        assertEquals("", PlateValidator.normalizePlate("   "));
    }

    @Test
    void testGetPlateType_Brazilian() {
        // Arrange & Act & Assert
        assertEquals(PlateType.BRAZILIAN, PlateValidator.getPlateType("ABC-1234"));
        assertEquals(PlateType.BRAZILIAN, PlateValidator.getPlateType("xyz-9876"));
        assertEquals(PlateType.BRAZILIAN, PlateValidator.getPlateType(" DEF-0000 "));
    }

    @Test
    void testGetPlateType_Mercosul() {
        // Arrange & Act & Assert
        assertEquals(PlateType.MERCOSUL, PlateValidator.getPlateType("ABC-1A23"));
        assertEquals(PlateType.MERCOSUL, PlateValidator.getPlateType("xyz-9b87"));
        assertEquals(PlateType.MERCOSUL, PlateValidator.getPlateType(" DEF-0C00 "));
    }

    @Test
    void testGetPlateType_Invalid() {
        // Arrange & Act & Assert
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABC1234"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("AB-1234"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABC-AB12"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("123-ABCD"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType(null));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType(""));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("   "));
    }

    @Test
    void testGetPlateType_EdgeCases() {
        // Arrange & Act & Assert
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABC-"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("-1234"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABC-1A2"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABC-1A234"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("A-1234"));
        assertEquals(PlateType.INVALID, PlateValidator.getPlateType("ABCD-1234"));
    }

    @Test
    void testPlateValidation_RealWorldExamples() {
        // Exemplos reais de placas brasileiras
        assertTrue(PlateValidator.isValidPlate("ABC-1234")); // Formato antigo
        assertTrue(PlateValidator.isValidPlate("BRA-2E19")); // Formato Mercosul
        assertTrue(PlateValidator.isValidPlate("SAO-1A23")); // Formato Mercosul
        
        // Placas antigas reais
        assertTrue(PlateValidator.isValidPlate("AAA-0001"));
        assertTrue(PlateValidator.isValidPlate("ZZZ-9999"));
        
        // Placas Mercosul reais
        assertTrue(PlateValidator.isValidPlate("BRA-1E23"));
        assertTrue(PlateValidator.isValidPlate("BRZ-2022"));
    }

    @Test
    void testPlateValidation_InvalidRealWorldExamples() {
        // Formatos que podem confundir mas são inválidos
        assertFalse(PlateValidator.isValidPlate("ABC-12A3")); // Letra no meio dos números
        assertFalse(PlateValidator.isValidPlate("AB1-1234")); // Número no meio das letras
        assertFalse(PlateValidator.isValidPlate("A1C-1234")); // Número no meio das letras
        assertFalse(PlateValidator.isValidPlate("ABC-1AA2")); // Duas letras consecutivas no Mercosul
        assertFalse(PlateValidator.isValidPlate("ABC-A123")); // Letra na primeira posição dos números
    }
}
