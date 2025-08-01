package br.com.tinnova.desafio_tinnova_back.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.tinnova.desafio_tinnova_back.dto.BubbleSortResponseDTO;
import br.com.tinnova.desafio_tinnova_back.dto.ElectionResultDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Election;

@ExtendWith(MockitoExtension.class)
class ExerciseServiceTest {

    @InjectMocks
    private ExerciseService exerciseService;

    @Test
    void testCalculateElectionPercentages_ValidData() {
        // Arrange
        Election election = new Election(1000, 800, 150, 50);

        // Act
        ElectionResultDTO result = exerciseService.calculateElectionPercentages(election);

        // Assert
        assertEquals(80.0, result.getValidVotePercentage(), 0.001);
        assertEquals(15.0, result.getBlankVotePercentage(), 0.001);
        assertEquals(5.0, result.getNullVotePercentage(), 0.001);
    }

    @Test
    void testCalculateElectionPercentages_NullElection() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.calculateElectionPercentages(null)
        );
        assertEquals("Dados da eleição inválidos", exception.getMessage());
    }

    @Test
    void testCalculateElectionPercentages_InvalidTotalVoters() {
        // Arrange
        Election election = new Election(0, 0, 0, 0);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.calculateElectionPercentages(election)
        );
        assertEquals("Dados da eleição inválidos", exception.getMessage());
    }

    @Test
    void testCalculateElectionPercentages_NegativeBlankVotes() {
        // Arrange
        Election election = new Election(100, 80, -10, 5);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.calculateElectionPercentages(election)
        );
        assertEquals("Dados da eleição inválidos", exception.getMessage());
    }

    @Test
    void testBubbleSort_ValidArray() {
        // Arrange
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        int[] expectedSorted = {11, 12, 22, 25, 34, 64, 90};

        // Act
        BubbleSortResponseDTO result = exerciseService.bubbleSort(array);

        // Assert
        assertArrayEquals(new int[]{64, 34, 25, 12, 22, 11, 90}, result.getOriginalArray());
        assertArrayEquals(expectedSorted, result.getSortedArray());
        assertTrue(result.getComparisons() > 0);
        assertTrue(result.getSwaps() >= 0);
        assertTrue(result.getExecutionTimeMs() >= 0);
    }

    @Test
    void testBubbleSort_AlreadySortedArray() {
        // Arrange
        int[] array = {1, 2, 3, 4, 5};

        // Act
        BubbleSortResponseDTO result = exerciseService.bubbleSort(array);

        // Assert
        assertArrayEquals(new int[]{1, 2, 3, 4, 5}, result.getOriginalArray());
        assertArrayEquals(new int[]{1, 2, 3, 4, 5}, result.getSortedArray());
        assertTrue(result.getComparisons() > 0);
        assertEquals(0, result.getSwaps());
    }

    @Test
    void testBubbleSort_SingleElement() {
        // Arrange
        int[] array = {42};

        // Act
        BubbleSortResponseDTO result = exerciseService.bubbleSort(array);

        // Assert
        assertArrayEquals(new int[]{42}, result.getOriginalArray());
        assertArrayEquals(new int[]{42}, result.getSortedArray());
        assertEquals(0, result.getComparisons());
        assertEquals(0, result.getSwaps());
    }

    @Test
    void testBubbleSort_NullArray() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.bubbleSort(null)
        );
        assertEquals("Array não pode ser nulo ou vazio", exception.getMessage());
    }

    @Test
    void testBubbleSort_EmptyArray() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.bubbleSort(new int[]{})
        );
        assertEquals("Array não pode ser nulo ou vazio", exception.getMessage());
    }

    @Test
    void testCalculateFactorial_Zero() {
        // Act
        long result = exerciseService.calculateFactorial(0);

        // Assert
        assertEquals(1L, result);
    }

    @Test
    void testCalculateFactorial_One() {
        // Act
        long result = exerciseService.calculateFactorial(1);

        // Assert
        assertEquals(1L, result);
    }

    @Test
    void testCalculateFactorial_PositiveNumber() {
        // Act
        long result = exerciseService.calculateFactorial(5);

        // Assert
        assertEquals(120L, result);
    }

    @Test
    void testCalculateFactorial_LargerNumber() {
        // Act
        long result = exerciseService.calculateFactorial(10);

        // Assert
        assertEquals(3628800L, result);
    }

    @Test
    void testCalculateFactorial_NegativeNumber() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.calculateFactorial(-1)
        );
        assertEquals("Número não pode ser negativo", exception.getMessage());
    }

    @Test
    void testSumMultiplesOf3Or5_Zero() {
        // Act
        long result = exerciseService.sumMultiplesOf3Or5(0);

        // Assert
        assertEquals(0L, result);
    }

    @Test
    void testSumMultiplesOf3Or5_Ten() {
        // Act (multiplos de 3 ou 5 menores que 10: 0, 3, 5, 6, 9)
        long result = exerciseService.sumMultiplesOf3Or5(10);

        // Assert
        assertEquals(23L, result); // 0 + 3 + 5 + 6 + 9 = 23
    }

    @Test
    void testSumMultiplesOf3Or5_Fifteen() {
        // Act (multiplos de 3 ou 5 menores que 15: 0, 3, 5, 6, 9, 10, 12)
        long result = exerciseService.sumMultiplesOf3Or5(15);

        // Assert
        assertEquals(45L, result); // 0 + 3 + 5 + 6 + 9 + 10 + 12 = 45
    }

    @Test
    void testSumMultiplesOf3Or5_One() {
        // Act
        long result = exerciseService.sumMultiplesOf3Or5(1);

        // Assert
        assertEquals(0L, result); // Apenas o 0
    }

    @Test
    void testSumMultiplesOf3Or5_NegativeNumber() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> exerciseService.sumMultiplesOf3Or5(-5)
        );
        assertEquals("Número não pode ser negativo", exception.getMessage());
    }
}
