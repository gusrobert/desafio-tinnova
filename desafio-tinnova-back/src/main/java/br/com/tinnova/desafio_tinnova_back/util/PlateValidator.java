package br.com.tinnova.desafio_tinnova_back.util;

import java.util.regex.Pattern;

public class PlateValidator {
    
    // Padrão brasileiro tradicional: AAA-9999
    private static final Pattern BRAZILIAN_PATTERN = Pattern.compile("^[A-Z]{3}-[0-9]{4}$");
    
    // Padrão Mercosul: AAA-9A99
    private static final Pattern MERCOSUL_PATTERN = Pattern.compile("^[A-Z]{3}-[0-9][A-Z][0-9]{2}$");
    
    /**
     * Valida se a placa está em um formato válido (brasileiro ou Mercosul)
     * @param plate A placa a ser validada
     * @return true se a placa for válida, false caso contrário
     */
    public static boolean isValidPlate(String plate) {
        if (plate == null || plate.trim().isEmpty()) {
            return false;
        }
        
        String normalizedPlate = plate.trim().toUpperCase();
        return BRAZILIAN_PATTERN.matcher(normalizedPlate).matches() || 
               MERCOSUL_PATTERN.matcher(normalizedPlate).matches();
    }
    
    /**
     * Normaliza a placa removendo espaços e convertendo para maiúsculo
     * @param plate A placa a ser normalizada
     * @return A placa normalizada
     */
    public static String normalizePlate(String plate) {
        if (plate == null) {
            return null;
        }
        return plate.trim().toUpperCase();
    }
    
    /**
     * Identifica o tipo da placa
     * @param plate A placa a ser identificada
     * @return O tipo da placa (BRAZILIAN, MERCOSUL ou INVALID)
     */
    public static PlateType getPlateType(String plate) {
        if (plate == null || plate.trim().isEmpty()) {
            return PlateType.INVALID;
        }
        
        String normalizedPlate = plate.trim().toUpperCase();
        
        if (BRAZILIAN_PATTERN.matcher(normalizedPlate).matches()) {
            return PlateType.BRAZILIAN;
        } else if (MERCOSUL_PATTERN.matcher(normalizedPlate).matches()) {
            return PlateType.MERCOSUL;
        } else {
            return PlateType.INVALID;
        }
    }
    
    public enum PlateType {
        BRAZILIAN,
        MERCOSUL,
        INVALID
    }
}
