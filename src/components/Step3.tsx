import React from "react";

const Step3 = ({ produto, dados, setDados, nextStep }: any) => {
  const [form, setForm] = React.useState({
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

  const [unidades, setUnidades] = React.useState<string[]>([]);

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

  const normalizarNumero = (valor: string) => parseFloat(valor.replace(",", "."));

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
      <input className="w-full border p-2" name="ean" placeholder="EAN" onChange={handleChange} />
      <input className="w-full border p-2" value={form.descricao} disabled />
      <input className="w-full border p-2" name="embalagem" placeholder="Embalagem" onChange={handleChange} />
      <select className="w-full border p-2" name="unidade_compra" value={form.unidade_compra} onChange={handleChange}>
        <option value="">Selecione a unidade</option>
        {unidades.map((unidade) => (
          <option key={unidade} value={unidade}>{unidade}</option>
        ))}
      </select>
      <input className="w-full border p-2" name="qtd_embalagem" placeholder="Quantidade Embalagem" onChange={handleChange} />
      <input className="w-full border p-2" name="altura_cm" placeholder="Altura (cm)" onChange={handleChange} />
      <input className="w-full border p-2" name="largura_cm" placeholder="Largura (cm)" onChange={handleChange} />
      <input className="w-full border p-2" name="comprimento_cm" placeholder="Comprimento (cm)" onChange={handleChange} />
      <input className="w-full border p-2" name="peso_liquido" placeholder="Peso Líquido (Kg)" onChange={handleChange} />
      <input className="w-full border p-2" name="peso_bruto" placeholder="Peso Bruto (Kg)" onChange={handleChange} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNext}>Avançar</button>
    </div>
  );
};

export default Step3;