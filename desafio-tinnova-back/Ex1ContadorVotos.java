import java.util.Scanner;

public class Ex1ContadorVotos {
    static class Votacao {
        int totalEleitores;
        int votosValidos;
        int votosBrancos;
        int votosNulos;

        public Votacao(int totalEleitores, int votosValidos, int votosBrancos, int votosNulos) {
            this.totalEleitores = totalEleitores;
            this.votosValidos = votosValidos;
            this.votosBrancos = votosBrancos;
            this.votosNulos = votosNulos;
        }
    }

    public static float calcularPercentualVotosValidos(Votacao votacao) {
        if (votacao.totalEleitores == 0) {
            return 0;
        }
        return (float) votacao.votosValidos / votacao.totalEleitores * 100;
    }

    public static int calcularPercentualVotosBrancos(Votacao votacao) {
        if (votacao.totalEleitores == 0) {
            return 0;
        }
        return (int) ((float) votacao.votosBrancos / votacao.totalEleitores * 100);
    }

    public static int calcularPercentualVotosNulos(Votacao votacao) {
        if (votacao.totalEleitores == 0) {
            return 0;
        }
        return (int) ((float) votacao.votosNulos / votacao.totalEleitores * 100);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite o total de eleitores: ");
        int totalEleitores = scanner.nextInt();

        System.out.print("Digite o número de votos válidos: ");
        int votosValidos = scanner.nextInt();

        System.out.print("Digite o número de votos brancos: ");
        int votosBrancos = scanner.nextInt();

        System.out.print("Digite o número de votos nulos: ");
        int votosNulos = scanner.nextInt();

        scanner.close();

        Votacao votacao = new Votacao(totalEleitores, votosValidos, votosBrancos, votosNulos);

        System.out.println("Percentual de votos válidos: " + calcularPercentualVotosValidos(votacao) + "%");
        System.out.println("Percentual de votos brancos: " + calcularPercentualVotosBrancos(votacao) + "%");
        System.out.println("Percentual de votos nulos: " + calcularPercentualVotosNulos(votacao) + "%");
    }
}
