package br.com.tinnova.desafio_tinnova_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tinnova.desafio_tinnova_back.dto.ElectionResultDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Election;
import br.com.tinnova.desafio_tinnova_back.service.ExerciseService;


@RestController
@CrossOrigin
@RequestMapping("/api/exercicios")
public class ExerciseController {
    @Autowired
    private ExerciseService exerciseService;
    
    @PostMapping("/election-percentages")
    public ResponseEntity<ElectionResultDTO> calculateElectionPercentages(@RequestBody Election electionData) {
        ElectionResultDTO electionResult = exerciseService.calculateElectionPercentages(electionData);
        if (electionResult == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(electionResult);
    }
}
