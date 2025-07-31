package br.com.tinnova.desafio_tinnova_back.entity;

public class Election {
    private int totalVoters;
    private int totalValidVotes;
    private int totalBlankVotes;
    private int totalNullVotes;

    Election() {
    }

    public Election(int totalVoters, int totalValidVotes, int totalBlankVotes, int totalNullVotes) {
        this.totalVoters = totalVoters;
        this.totalValidVotes = totalValidVotes;
        this.totalBlankVotes = totalBlankVotes;
        this.totalNullVotes = totalNullVotes;
    }

    public int getTotalVoters() {
        return totalVoters;
    }

    public void setTotalVoters(int totalVoters) {
        this.totalVoters = totalVoters;
    }

    public int getTotalValidVotes() {
        return totalValidVotes;
    }

    public void setTotalValidVotes(int totalValidVotes) {
        this.totalValidVotes = totalValidVotes;
    }

    public int getTotalBlankVotes() {
        return totalBlankVotes;
    }

    public void setTotalBlankVotes(int totalBlankVotes) {
        this.totalBlankVotes = totalBlankVotes;
    }

    public int getTotalNullVotes() {
        return totalNullVotes;
    }

    public void setTotalNullVotes(int totalNullVotes) {
        this.totalNullVotes = totalNullVotes;
    }
}
