package br.com.tinnova.desafio_tinnova_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResultDTO {
    private double validVotePercentage;
    private double blankVotePercentage;
    private double nullVotePercentage;
}
