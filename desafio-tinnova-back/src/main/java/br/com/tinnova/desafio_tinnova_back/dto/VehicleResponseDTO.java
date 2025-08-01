package br.com.tinnova.desafio_tinnova_back.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponseDTO {
    private Long id;
    private String plate;
    private Long brandId;
    private String brandName;
    private Long modelId;
    private String modelName;
    private Integer year;
    private String description;
    private Boolean isSold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
