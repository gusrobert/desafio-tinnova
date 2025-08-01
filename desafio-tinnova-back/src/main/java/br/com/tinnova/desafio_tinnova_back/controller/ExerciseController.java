package br.com.tinnova.desafio_tinnova_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.tinnova.desafio_tinnova_back.dto.BubbleSortResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.ElectionResultDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Election;
import br.com.tinnova.desafio_tinnova_back.service.ExerciseService;


@RestController
@CrossOrigin
@RequestMapping("/api/exercises")
public class ExerciseController {
    @Autowired
    private ExerciseService exerciseService;
    
    @PostMapping("/election-percentages")
    public ResponseEntity<ElectionResultDTO> calculateElectionPercentages(@RequestBody Election electionData) {
        ElectionResultDTO electionResult = exerciseService.calculateElectionPercentages(electionData);

        return ResponseEntity.ok(electionResult);
    }

    @PostMapping("/bubble-sort")
    public ResponseEntity<BubbleSortResponseDTO> bubbleSort(@RequestBody int[] integerArray) {
        BubbleSortResponseDTO result = exerciseService.bubbleSort(integerArray);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/factorial")
    public ResponseEntity<Long> calculateFactorial(@RequestParam int number) {
        long result = exerciseService.calculateFactorial(number);
        return ResponseEntity.ok(result);
    }
    
}
