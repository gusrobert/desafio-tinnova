import FactorialCalculatorForm from "@/components/exercises/FactorialCalculator";
import AppLayout from "@/components/layout/AppLayout";

export default function Exercicio3Page() {
  return (
    <AppLayout pageTitle="Exercício 3">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fatorial</h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {/* Conteúdo do exercício 3 */}
          <h2 className="text-lg font-semibold mb-4">Descrição do Problema</h2>
          <p className="text-gray-700 mb-4">
            Faça um programa que calcule o fatorial de um número qualquer.
          </p>

          <p className="text-gray-700 mb-4">
            Vamos lembrar o que é o fatorial?
          </p>

          <p className="text-gray-700 mb-4">
            Seja <i>n</i> um número natural, tal que <i>n &gt;=2</i>, chama-se o
            fatorial de <i>n</i> o produto de todos os números naturais
            consectivos de <i>n</i> até 1.
          </p>

          <p className="text-gray-700 mb-4">Por exemplo,</p>
          <pre className="bg-gray-100 p-2 rounded-md">
            <code className="language-js">{`5! = 5 * 4 * 3 * 2 * 1 = 120`}</code>
          </pre>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Solução</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code className="language-java">
                {`public long calculateFactorial(int number) {
        if (number < 0) {
            throw new IllegalArgumentException("Número não pode ser negativo");
        }

        if (number == 0 || number == 1) {
            return 1L;
        }

        long result = 1L;
        for (int i = 2; i <= number; i++) {
            result *= i;
        }

        return result;
}
        `}
              </code>
            </pre>
          </div>
          <div className="text-gray-700 mt-2">
            <p>
              No código acima a abordagem é iterativa foi escolhida para evitar
              problemas de estouro de pilha que podem ocorrer com a abordagem
              recursiva para números grandes.
            </p>
          </div>
        </div>

        {/* Componente interativo */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Teste Interativo</h2>
          <FactorialCalculatorForm />
        </div>
      </div>
    </AppLayout>
  );
}
