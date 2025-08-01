import ElectionCalculatorForm from "@/components/exercises/ElectionCalculator";
import AppLayout from "@/components/layout/AppLayout";

export default function Exercise1Page() {
  return (
    <AppLayout pageTitle="Exercício 1">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Exercício 1</h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Descrição do Problema</h2>

          <p className="text-gray-700 mb-4">Considerando a tabela abaixo...</p>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <div className="space-y-2 font-mono text-sm">
              <div>total de eleitores = 1000</div>
              <div>válidos = 800</div>
              <div>votos brancos = 150</div>
              <div>nulos = 50</div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Faça uma classe com 3 métodos que calculam...
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>
              o percentual de votos válidos em relação ao total de eleitores,
            </li>
            <li>o percentual de brancos em relação ao total de eleitores,</li>
            <li>o percentual de nulos em relação ao total de eleitores.</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Dica:</strong> "em relação ao total" significa que você
              deve dividir, por exemplo, "nulos" pelo total de eleitores,
              válidos pelo total de eleitores, etc...
            </p>
          </div>

          <p className="text-gray-700 font-medium">
            Utilize programação orientada a objetos.
          </p>
        </div>
                <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Solução</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code className="language-java">
                {`public ElectionResultDTO calculateElectionPercentages(Election election) {
        double validVotePercentage = (double) election.getTotalValidVotes() / election.getTotalVoters() * 100;
        double blankVotePercentage = (double) election.getTotalBlankVotes() / election.getTotalVoters() * 100;
        double nullVotePercentage = (double) election.getTotalNullVotes() / election.getTotalVoters() * 100;

        return new ElectionResultDTO(validVotePercentage, blankVotePercentage, nullVotePercentage);
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Componente interativo */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Teste Interativo</h2>
          <ElectionCalculatorForm />
        </div>
      </div>
    </AppLayout>
  );
}
