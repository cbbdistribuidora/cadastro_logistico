import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Step1 = ({ produto, setProduto, nextStep }: any) => {
  const [mensagem, setMensagem] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false);

  useEffect(() => {
    if (cameraAtiva) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 100 } },
        false
      );

      scanner.render(
        (codigo) => {
          setProduto({ ...produto, ean_master: codigo });
          setCameraAtiva(false);
          scanner.clear();
        },
        (error) => {
        }
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [cameraAtiva]);

  const handleBuscar = async () => {
    const res = await fetch(`https://cadastro-logistico.onrender.com/verifica-produto-completo/${produto.ean_master}`);
    const data = await res.json();

    if (!data.existe) {
      setModoCadastro(true);
      setMensagem("Produto não encontrado. Informe os dados para cadastrar.");
    } else if (data.cadastrado) {
      setMensagem("Produto já possui dados logísticos.");
    } else {
      setProduto({ ...produto, id: data.id, descricao: data.descricao });
      nextStep();
    }
  };

  const handleCadastrarProduto = async () => {
    const res = await fetch("https://cadastro-logistico.onrender.com/produto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    if (res.ok) {
      const data = await res.json();
      setProduto({ ...produto, id: data.id });
      nextStep();
    } else {
      setMensagem("Erro ao cadastrar produto. Verifique os dados.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Escaneie o Cod. Barra ou Digite o EAN</h2>

      <input
        className="w-full border rounded p-2"
        placeholder="EAN Master"
        value={produto.ean_master}
        onChange={(e) => setProduto({ ...produto, ean_master: e.target.value })}
      />

      <button
        className="bg-gray-600 text-white px-4 py-2 rounded"
        onClick={() => setCameraAtiva(!cameraAtiva)}
      >
        {cameraAtiva ? "Fechar Câmera" : "Abrir Câmera"}
      </button>

      {cameraAtiva && <div id="reader" className="border p-2 rounded" />}

      {!modoCadastro && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleBuscar}
        >
          Avançar
        </button>
      )}

      {modoCadastro && (
        <>
          <input
            className="w-full border rounded p-2"
            placeholder="Descrição do Produto"
            value={produto.descricao}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleCadastrarProduto}
          >
            Cadastrar Produto
          </button>
        </>
      )}

      {mensagem && <p className="text-red-500">{mensagem}</p>}
    </div>
  );
};

export default Step1;
