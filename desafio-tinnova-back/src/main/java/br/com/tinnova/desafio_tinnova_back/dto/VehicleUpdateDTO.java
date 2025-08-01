package br.com.tinnova.desafio_tinnova_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpdateDTO {
    private String plate;
    private Long modelId;
    private Long brandId;
    private Integer year;
    private String description;
    private Boolean isSold;
}
