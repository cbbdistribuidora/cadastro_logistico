import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Step3 = ({ produto, dados, setDados, nextStep, produtoReferenciaId }: any) => {
  const [form, setForm] = useState({
    produto_id: produto.id,
    step: 3,
    ean: "",
    descricao: produto.descricao,
    embalagem: "",
    unidade_compra: "",
    qtd_embalagem: "",
    altura_cm: "",
    largura_cm: "",
    comprimento_cm: "",
    peso_liquido: "",
    peso_bruto: "",
    tipo_embalagem: "vendavel"
  });

  const [unidades, setUnidades] = useState<string[]>([]);
  const [cameraAtiva, setCameraAtiva] = React.useState(false);

  useEffect(() => {
    fetch("https://cadastro-logistico.onrender.com/unidades")
      .then(res => res.json())
      .then(data => setUnidades(data.map((u: any) => u.unidade)))
      .catch(err => console.error("Erro ao carregar unidades", err));
  }, []);

  useEffect(() => {
    if (!produtoReferenciaId) return;

    fetch(`https://cadastro-logistico.onrender.com/${produtoReferenciaId}`)
      .then(res => res.json())
      .then(data => {
        const ref = data.find((item: any) => item.tipo_embalagem === "vendavel");
        if (ref) {
          setForm(prev => ({
            ...prev,
            embalagem: ref.embalagem || "",
            unidade_compra: ref.unidade_compra || "",
            qtd_embalagem: ref.qtd_embalagem?.toString() || "",
            altura_cm: ref.altura_cm?.toString() || "",
            largura_cm: ref.largura_cm?.toString() || "",
            comprimento_cm: ref.comprimento_cm?.toString() || "",
            peso_liquido: ref.peso_liquido?.toString() || "",
            peso_bruto: ref.peso_bruto?.toString() || ""
          }));
        }
      })
      .catch(err => console.error("Erro ao buscar dados da referência vendável", err));
  }, [produtoReferenciaId]);

  useEffect(() => {
      if (cameraAtiva) {
        const scanner = new Html5QrcodeScanner(
          "reader-step3",
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

  const normalizarNumero = (valor: string) => parseFloat(valor.replace(",", ".")) || 0;

  const handleNext = () => {
    const camposDecimais = ["altura_cm", "largura_cm", "comprimento_cm", "peso_liquido", "peso_bruto"];
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Menor Embalagem</h2>

      <div className="flex gap-2">
        <input
          className="w-full border p-2"
          name="ean"
          placeholder="EAN"
          value={form.ean}
          onChange={handleChange}
        />
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setCameraAtiva(!cameraAtiva)}
        >
          {cameraAtiva ? "Fechar Câmera" : "Ler Código"}
        </button>
      </div>

      {cameraAtiva && <div id="reader-step3" className="my-4" />}

      <input className="w-full border p-2" value={form.descricao} disabled />
      <input className="w-full border p-2" name="embalagem" placeholder="Embalagem" value={form.embalagem} onChange={handleChange} />
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

export default Step3;
