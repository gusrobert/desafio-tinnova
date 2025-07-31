export default function Exercicio2Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exercício 2</h1>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Descrição do Problema</h2>
        <p className="text-gray-700">
          Aqui você pode descrever o enunciado do segundo exercício do desafio Tinnova.
        </p>
      </div>
      
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Solução</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          <pre>{`// Exemplo de código para o Exercício 2
function exemploSolucao() {
  console.log("Implementação do Exercício 2");
  return "Resultado";
}`}</pre>
        </div>
      </div>
    </div>
  );
}
