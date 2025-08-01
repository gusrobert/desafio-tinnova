import { ApiClient } from './api-client';
import { endpoints } from './api-config';

export interface ElectionData {
  totalVoters: number;
  validVotes: number;
  blankVotes: number;
  nullVotes: number;
}

export interface ElectionPercentages {
  validVotePercentage: number;
  blankVotePercentage: number;
  nullVotePercentage: number;
}

export interface BubbleSortResponse {
  originalArray: number[];
  sortedArray: number[];
  comparisons: number;
  swaps: number;
  executionTimeMs: number;
}

export class ExerciseService {
  /**
   * Calculates the percentages of an election
   * @param data Election data
   * @returns Calculated percentages
   */
  static async calculateElectionPercentages(data: ElectionData): Promise<ElectionPercentages> {
    const queryParams = new URLSearchParams({
      totalVoters: data.totalVoters.toString(),
      validVotes: data.validVotes.toString(),
      blankVotes: data.blankVotes.toString(),
      nullVotes: data.nullVotes.toString(),
    });
    
    return ApiClient.post<ElectionPercentages>(`${endpoints.exercises.electionPercentages}?${queryParams.toString()}`, {
        totalVoters: data.totalVoters.toString(),
        totalValidVotes: data.validVotes.toString(),
        totalBlankVotes: data.blankVotes.toString(),
        totalNullVotes: data.nullVotes.toString(),
    });
  }


  /**
   * Organizes an array using Bubble Sort algorithm
   * @param array Array to be sorted
   * @returns Sorted array
   */
  static async bubbleSort(array: number[]): Promise<BubbleSortResponse> {
    if (!array || array.length === 0) {
      throw new Error('Array cannot be empty');
    }

    if (array.length > 1000) {
      throw new Error('Array too large (maximum 1000 elements)');
    }

    const response = await ApiClient.post<BubbleSortResponse>(
      endpoints.exercises.bubbleSort, 
      array
    );
    return response;
  }

  /**
   * Calculates the factorial of a number
   * @param number Number to calculate the factorial
   * @returns Factorial result
   */
  static async calculateFactorial(number: number): Promise<number> {
    if (number < 0) {
      throw new Error('Number cannot be negative');
    }

    return ApiClient.get<number>(`${endpoints.exercises.factorial}?number=${number}`);
  }
}
