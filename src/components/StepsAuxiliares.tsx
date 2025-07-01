import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const criarStepAuxiliar = (step: number, tipo_embalagem: string, titulo: string) => {
  return ({ produto, dados, setDados, nextStep }: any) => {
    const [form, setForm] = React.useState({
      produto_id: produto.id,
      step,
      tipo_embalagem,
      descricao: produto.descricao,
      ean: "",
      embalagem: "",
      unidade_compra: "",
      qtd_embalagem: ""
    });

    const [unidades, setUnidades] = React.useState<string[]>([]);
    const [cameraAtiva, setCameraAtiva] = React.useState(false);

    React.useEffect(() => {
      fetch("https://cadastro-logistico.onrender.com/unidades")
        .then(res => res.json())
        .then(data => setUnidades(data.map((u: any) => u.unidade)))
        .catch(err => console.error("Erro ao carregar unidades", err));
    }, []);

    React.useEffect(() => {
      if (cameraAtiva) {
        const scanner = new Html5QrcodeScanner(
          `reader-step${step}`,
          { fps: 10, qrbox: { width: 250, height: 100 } },
          false
        );

        scanner.render(
          (codigo) => {
            setForm((prev) => ({ ...prev, ean: codigo }));
            setCameraAtiva(false);
            scanner.clear();
          },
          (error) => {
            // erros ignorados
          }
        );

        return () => {
          scanner.clear().catch(() => {});
        };
      }
    }, [cameraAtiva]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleNext = () => {
      const preenchido = form.ean || form.embalagem || form.unidade_compra || form.qtd_embalagem;
      if (preenchido) {
        const formNormalizado = {
          ...form,
          qtd_embalagem: parseInt(form.qtd_embalagem) || 0
        };
        setDados((prev: any) => [...prev, formNormalizado]);
      }

      if (!form.produto_id) {
        alert("Produto ainda não foi carregado corretamente.");
        return;
      }

      nextStep();
    };

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{titulo}</h2>

        <div className="flex gap-2">
          <input
            className="w-full border p-2"
            name="ean"
            placeholder="EAN Auxiliar"
            value={form.ean}
            onChange={handleChange}
          />
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => setCameraAtiva(!cameraAtiva)}
          >
            {cameraAtiva ? "Fechar Câmera" : "Ler Código"}
          </button>
        </div>

        {cameraAtiva && <div id={`reader-step${step}`} className="my-4" />}

        <input
          className="w-full border p-2"
          name="embalagem"
          placeholder="Embalagem (Ex: DP 12UN)"
          onChange={handleChange}
        />

        <select
          className="w-full border p-2"
          name="unidade_compra"
          value={form.unidade_compra}
          onChange={handleChange}
        >
          <option value="">Selecione a unidade</option>
          {unidades.map((unidade) => (
            <option key={unidade} value={unidade}>{unidade}</option>
          ))}
        </select>

        <input
          type="number"
          className="w-full border p-2"
          name="qtd_embalagem"
          placeholder="Quantidade"
          value={form.qtd_embalagem}
          onChange={handleChange}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNext}
        >
          Avançar
        </button>
      </div>
    );
  };
};

export const Step4 = criarStepAuxiliar(4, "auxiliar_1", "Embalagem Auxiliar 1");
export const Step5 = criarStepAuxiliar(5, "auxiliar_2", "Embalagem Auxiliar 2");
export const Step6 = criarStepAuxiliar(6, "auxiliar_3", "Embalagem Auxiliar 3");
