package br.com.tinnova.desafio_tinnova_back.service;

import org.springframework.stereotype.Service;

import br.com.tinnova.desafio_tinnova_back.dto.BubbleSortResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.ElectionResultDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Election;

@Service
public class ExerciseService {
    public ElectionResultDTO calculateElectionPercentages(Election election) {
        double validVotePercentage = (double) election.getTotalValidVotes() / election.getTotalVoters() * 100;
        double blankVotePercentage = (double) election.getTotalBlankVotes() / election.getTotalVoters() * 100;
        double nullVotePercentage = (double) election.getTotalNullVotes() / election.getTotalVoters() * 100;

        return new ElectionResultDTO(validVotePercentage, blankVotePercentage, nullVotePercentage);
    }

    public BubbleSortResponseDTO bubbleSort(int[] array) {
        if (array == null || array.length == 0) {
            return new BubbleSortResponseDTO(new int[0], new int[0], 0, 0, 0);
        }

        // Salvar o array original
        int[] originalArray = array.clone();
        
        // Inicializar contadores
        int comparisons = 0;
        int swaps = 0;
        
        // Medir tempo de execução
        long startTime = System.nanoTime();

        int n = array.length;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i < n - 1; i++) {
                comparisons++; // Contar cada comparação
                if (array[i] > array[i + 1]) {
                    // Swap array[i] and array[i + 1]
                    int temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                    swaps++; // Contar cada troca
                    swapped = true;
                }
            }
            n--; // Reduce the range of the next pass
        } while (swapped);

        long endTime = System.nanoTime();
        double executionTime = (endTime - startTime) / 1_000_000.0; // com decimais

        System.out.println("Tempo em milissegundos: " + executionTime);

        return new BubbleSortResponseDTO(originalArray, array, comparisons, swaps, executionTime);
    }
}
    