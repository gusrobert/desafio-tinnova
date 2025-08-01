import SumMultipleOf3Or5Form from "@/components/exercises/SumMultiple3Or5Calculator";
import AppLayout from "@/components/layout/AppLayout";

export default function Exercicio4Page() {
  return (
    <AppLayout pageTitle="Exercício 4">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Soma dos multíplos de 3 ou 5</h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {/* Conteúdo do exercício 4 */}
          <h2 className="text-lg font-semibold mb-4">Descrição do Problema</h2>
          <p className="text-gray-700 mb-4">
            Fazer uma implementação que faça a soma de todos os números que sejam múltiplos de 3 ou 5.
          </p>

          <p className="text-gray-700 mb-4">
            Se listar todos os números naturais abaixo de 10 que são múltiplos de 3 ou 5, ficamos com
            <strong> 3, 5, 6 e 9</strong>. A soma desses múltiplos é <strong>23</strong>.
          </p>

          <p className="text-gray-700 mb-4">
            A implementação deve ser capaz de receber por parâmetro um número <i>X</i> se já retornado
            a soma de todos os números múltiplos de 3 ou 5.
          </p>
        </div>

        {/* Solução */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Solução</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code className="language-java">
                {`public int sumMultiplesOf3And5(int x) {
    if (x < 0) {
        throw new IllegalArgumentException("Número não pode ser negativo");
    }

    int sum = 0;
    for (int i = 0; i < x; i++) {
        if (i % 3 == 0 || i % 5 == 0) {
            sum += i;
        }
    }
    return sum;
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Componente interativo */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Teste Interativo</h2>
          <SumMultipleOf3Or5Form />
        </div>
      </div>
    </AppLayout>
  );
}
