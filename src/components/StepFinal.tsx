import React, { useState } from "react";

const StepFinal = ({ produto, dados, embalagensAuxiliares, reset }: any) => {
  const [lastro, setLastro] = useState("");
  const [camada, setCamada] = useState("");

  const handleSubmit = async () => {
    try {
      const produtoId = produto.id;

      // 1. Cadastrar dados logísticos
      await fetch("https://cadastro-logistico.onrender.com/dados-logisticos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      // 2. Cadastrar lastro e camada
      await fetch("https://cadastro-logistico.onrender.com/lastro-camada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: produtoId,
          lastro: Number(lastro),
          camada: Number(camada),
        }),
      });

      // 3. Cadastrar embalagens auxiliares (se houver)
      const auxiliares = Array.isArray(embalagensAuxiliares) ? embalagensAuxiliares : [];
      const auxiliaresPreenchidas = auxiliares.filter(
        (aux: any) => aux.embalagem && aux.qtd_embalagem
      );

      if (auxiliaresPreenchidas.length > 0) {
        await fetch("https://cadastro-logistico.onrender.com/embalagens-auxiliares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            auxiliaresPreenchidas.map((aux: any) => ({
              ...aux,
              produto_id: produtoId,
            }))
          ),
        });
      }

      alert("Cadastro concluído com sucesso!");
      reset();
    } catch (error) {
      alert("Erro ao salvar os dados.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lastro e Camada Embalagem Master</h2>
      <p><strong>EAN Master:</strong> {produto.ean_master}</p>
      <p><strong>Descrição:</strong> {produto.descricao}</p>
      <input
        className="w-full border p-2"
        placeholder="Lastro (caixas por camada)"
        value={lastro}
        onChange={(e) => setLastro(e.target.value)}
      />
      <input
        className="w-full border p-2"
        placeholder="Camada (quantidade de camadas)"
        value={camada}
        onChange={(e) => setCamada(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Salvar Tudo
      </button>
    </div>
  );
};

export default StepFinal;
