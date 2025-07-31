package br.com.tinnova.desafio_tinnova_back.service;

import org.springframework.stereotype.Service;

import br.com.tinnova.desafio_tinnova_back.dto.ElectionResultDTO;
import br.com.tinnova.desafio_tinnova_back.entity.Election;

@Service
public class ExerciseService {
    public ElectionResultDTO calculateElectionPercentages(Election election) {
        if (election == null || election.getTotalVoters() <= 0) {
            throw new IllegalArgumentException("Dados da eleição inválidos");
        }

        double validVotePercentage = (double) election.getTotalValidVotes() / election.getTotalVoters() * 100;
        double blankVotePercentage = (double) election.getTotalBlankVotes() / election.getTotalVoters() * 100;
        double nullVotePercentage = (double) election.getTotalNullVotes() / election.getTotalVoters() * 100;

        return new ElectionResultDTO(validVotePercentage, blankVotePercentage, nullVotePercentage);
    }
}
    