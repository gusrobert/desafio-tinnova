package br.com.tinnova.desafio_tinnova_back.dto;

public class BubbleSortResponseDTO {
    private int[] originalArray;
    private int[] sortedArray;
    private int comparisons;
    private int swaps;
    private double executionTimeMs;

    public BubbleSortResponseDTO() {}

    public BubbleSortResponseDTO(int[] originalArray, int[] sortedArray, int comparisons, int swaps, double executionTimeMs) {
        this.originalArray = originalArray;
        this.sortedArray = sortedArray;
        this.comparisons = comparisons;
        this.swaps = swaps;
        this.executionTimeMs = executionTimeMs;
    }

    public int[] getOriginalArray() {
        return originalArray;
    }

    public void setOriginalArray(int[] originalArray) {
        this.originalArray = originalArray;
    }

    public int[] getSortedArray() {
        return sortedArray;
    }

    public void setSortedArray(int[] sortedArray) {
        this.sortedArray = sortedArray;
    }

    public int getComparisons() {
        return comparisons;
    }

    public void setComparisons(int comparisons) {
        this.comparisons = comparisons;
    }

    public int getSwaps() {
        return swaps;
    }

    public void setSwaps(int swaps) {
        this.swaps = swaps;
    }

    public double getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(double executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }
}
