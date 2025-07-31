import java.util.Arrays;
import java.util.Scanner;

public class Ex2BubbleSort {
    public static int[] bubbleSort(int[] array) {
        int n = array.length;
        boolean trocou;

        do {
            trocou = false;
            for (int i = 0; i < n - 1; i++) {
                if (array[i] > array[i + 1]) {
                    // Troca os elementos
                    int temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                    trocou = true;
                }
            }
            n--;
        } while (trocou);

        return array;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Digite o tamanho do array: ");
        int tamanho = scanner.nextInt();
        int[] numeros = new int[tamanho];

        System.out.println("Digite os elementos do array separados por espaço:");
        for (int i = 0; i < tamanho; i++) {
            numeros[i] = scanner.nextInt();
        }

        scanner.close();

        System.out.println("Array original: "+ Arrays.toString(numeros));

        bubbleSort(numeros);

        System.out.println("Array ordenado: " + Arrays.toString(numeros));
    }
}
