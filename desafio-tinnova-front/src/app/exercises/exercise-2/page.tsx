import BubbleSortForm from "@/components/exercises/BubbleSort";
import AppLayout from "@/components/layout/AppLayout";

export default function Exercise2Page() {
  return (
    <AppLayout pageTitle="Exercício 2">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Algoritmo de ordenação Bubble Sort</h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Descrição do Problema</h2>
          <p className="text-gray-700 mb-4">Imagine o seguinte vetor:</p>
          <pre className="bg-gray-100 p-2 rounded-md">
            <code className="language-js">{`v = {5, 3, 2, 4, 7, 1, 0, 6}`}</code>
          </pre>

          <p className="text-gray-700 mb-4">
            Faça um algoritmo que ordene o vetor acima utilizando o <strong>Bubble Sort</strong>.
          </p>

          <p className="text-gray-700 mb-4">
            O Bubble Sort ordena de par em par. Ele pega os dois primeiros elementos e pergunta
            se o primeiro é maior que o segundo. Se sim, os elementos são trocados (swap), se não,
            são mantidos. Vai repetindo o processo até o final do vetor.
          </p>

          <p className="text-gray-700 mb-4">
            Obviamente que ele não consegue ordenar todo o vetor em uma única rodada, ele terá que
            passar pelo vetor um certo número de vezes.
          </p>

          <p className="text-gray-700 mb-4">
            De maneira mais formal podemos destacar:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
            <li>
              Percorra o vetor inteiro comparando elementos adjacentes (dois a dois);
            </li>
            <li>
              Troque as posições dos elementos se eles estiverem fora de ordem;
            </li>
            <li>
              Repita os dois passos acima (n - 1) vezes, onde n é igual ao tamanho do vetor.
            </li>
          </ol>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Solução</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code className="language-java">
                {`public int[] bubbleSort(int[] array) {
        if (array == null || array.length == 0) {
            return new int[0];
        }

        int n = array.length;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i < n - 1; i++) {
                if (array[i] > array[i + 1]) {
                    // Swap array[i] and array[i + 1]
                    int temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                    swapped = true;
                }
            }
            n--; // Reduce the range of the next pass
        } while (swapped);

        return array;
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Componente interativo */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Teste Interativo</h2>
          <BubbleSortForm />
        </div>
      </div>
    </AppLayout>
  );
}
