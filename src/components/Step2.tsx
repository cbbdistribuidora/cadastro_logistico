import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Step2 = ({ produto, dados, setDados, nextStep, setProdutoReferenciaId }: any) => {
  const [form, setForm] = React.useState({
    produto_id: produto.id,
    step: 2,
    ean: produto.ean_master,
    descricao: produto.descricao,
    embalagem: "",
    unidade_compra: "",
    qtd_embalagem: "",
    altura_cm: "",
    largura_cm: "",
    comprimento_cm: "",
    peso_liquido: "",
    peso_bruto: "",
    tipo_embalagem: "master"
  });

  const [eanReferencia, setEanReferencia] = React.useState("");
  const [unidades, setUnidades] = React.useState<string[]>([]);
  const [cameraAtiva, setCameraAtiva] = React.useState(false);

  React.useEffect(() => {
    fetch("https://cadastro-logistico.onrender.com/unidades")
      .then(res => res.json())
      .then(data => setUnidades(data.map((u: any) => u.unidade)))
      .catch(err => console.error("Erro ao carregar unidades", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const normalizarNumero = (valor: string) => parseFloat(valor.replace(",", ".")) || 0;

  const handleNext = () => {
    const camposDecimais = [
      "altura_cm", "largura_cm", "comprimento_cm", "peso_liquido", "peso_bruto"
    ];

    const formNormalizado = {
      ...form,
      ...Object.fromEntries(
        camposDecimais.map((campo) => [campo, normalizarNumero(form[campo])])
      ),
      qtd_embalagem: parseInt(form.qtd_embalagem) || 0
    };

    setDados([...dados, formNormalizado]);
    nextStep();
  };

  const buscarReferencia = async () => {
    if (!eanReferencia) {
      alert("Informe o EAN do produto de referência.");
      return;
    }

    try {
      const res = await fetch(`https://cadastro-logistico.onrender.com/dados-logisticos-por-ean/${eanReferencia}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        alert("Resposta inválida da API.");
        return;
      }

      const master = data.find((item: any) => item.tipo_embalagem === "master");
      if (master) {
        setProdutoReferenciaId(master.produto_id);
        setForm(prev => ({
          ...prev,
          embalagem: master.embalagem || "",
          unidade_compra: master.unidade_compra || "",
          qtd_embalagem: master.qtd_embalagem?.toString() || "",
          altura_cm: master.altura_cm?.toString() || "",
          largura_cm: master.largura_cm?.toString() || "",
          comprimento_cm: master.comprimento_cm?.toString() || "",
          peso_liquido: master.peso_liquido?.toString() || "",
          peso_bruto: master.peso_bruto?.toString() || ""
        }));
      } else {
        alert("Produto de referência não possui dados logísticos do tipo master.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados de referência:", error);
      alert("Erro ao buscar dados do produto de referência.");
    }
  };

  React.useEffect(() => {
    if (cameraAtiva) {
      const scanner = new Html5QrcodeScanner(
        "reader-step2",
        { fps: 10, qrbox: { width: 250, height: 100 } },
        false
      );

      scanner.render(
        (codigo) => {
          console.log("Código lido:", codigo);
          setEanReferencia(codigo);
          setCameraAtiva(false);
          scanner.clear();
          buscarReferencia();
        },
        (error) => {
        }
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [cameraAtiva]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Embalagem Master</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2"
          placeholder="EAN produto referência"
          value={eanReferencia}
          onChange={(e) => setEanReferencia(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={buscarReferencia}
        >
          Buscar Referência
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setCameraAtiva(!cameraAtiva)}
        >
          {cameraAtiva ? "Fechar Câmera" : "Ler Código"}
        </button>
      </div>

      {cameraAtiva && <div id="reader-step2" className="mt-4" />}


      <input className="w-full border p-2" value={form.ean} disabled />
      <input className="w-full border p-2" value={form.descricao} disabled />
      <input className="w-full border p-2" name="embalagem" placeholder="Embalagem (Ex: CX 4X10)" value={form.embalagem} onChange={handleChange} />
      <select className="w-full border p-2" name="unidade_compra" value={form.unidade_compra} onChange={handleChange}>
        <option value="">Selecione a unidade</option>
        {unidades.map((unidade) => (
          <option key={unidade} value={unidade}>{unidade}</option>
        ))}
      </select>
      <input className="w-full border p-2" name="qtd_embalagem" placeholder="Quantidade Embalagem" value={form.qtd_embalagem} onChange={handleChange} />
      <input className="w-full border p-2" name="altura_cm" placeholder="Altura (cm)" value={form.altura_cm} onChange={handleChange} />
      <input className="w-full border p-2" name="largura_cm" placeholder="Largura (cm)" value={form.largura_cm} onChange={handleChange} />
      <input className="w-full border p-2" name="comprimento_cm" placeholder="Comprimento (cm)" value={form.comprimento_cm} onChange={handleChange} />
      <input className="w-full border p-2" name="peso_liquido" placeholder="Peso Líquido (Kg)" value={form.peso_liquido} onChange={handleChange} />
      <input className="w-full border p-2" name="peso_bruto" placeholder="Peso Bruto (Kg)" value={form.peso_bruto} onChange={handleChange} />

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNext}>Avançar</button>
    </div>
  );
};

export default Step2;
