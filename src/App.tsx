import React, { useState } from "react";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { Step4, Step5, Step6 } from "./components/StepsAuxiliares";
import StepFinal from "./components/StepFinal";

interface Produto {
  ean_master: string;
  descricao: string;
  id?: number;
}

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [produto, setProduto] = useState<Produto>({ ean_master: "", descricao: "" });
  const [dadosLogisticos, setDadosLogisticos] = useState<any[]>([]);
  const [embalagensAuxiliares, setEmbalagensAuxiliares] = useState<any[]>([]);
  const [produtoReferenciaId, setProdutoReferenciaId] = useState<number | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);

  const reset = () => {
    setStep(1);
    setProduto({ ean_master: "", descricao: "" });
    setDadosLogisticos([]);
    setEmbalagensAuxiliares([]);
    produtoReferenciaId([]);
    setProdutoReferenciaId([]);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {step === 1 && (
        <Step1
          produto={produto}
          setProduto={setProduto}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <Step2
          produto={produto}
          dados={dadosLogisticos}
          setDados={setDadosLogisticos}
          nextStep={nextStep}
          setProdutoReferenciaId={setProdutoReferenciaId}
        />
      )}

      {step === 3 && (
        <Step3
          produto={produto}
          dados={dadosLogisticos}
          setDados={setDadosLogisticos}
          nextStep={nextStep}
          produtoReferenciaId={produtoReferenciaId}
        />
      )}

      {step === 4 && (
        <Step4
          produto={produto}
          dados={embalagensAuxiliares}
          setDados={setEmbalagensAuxiliares}
          nextStep={nextStep}
          produtoReferenciaId={produtoReferenciaId}
        />
      )}

      {step === 5 && (
        <Step5
          produto={produto}
          dados={embalagensAuxiliares}
          setDados={setEmbalagensAuxiliares}
          nextStep={nextStep}
          produtoReferenciaId={produtoReferenciaId}
        />
      )}

      {step === 6 && (
        <Step6
          produto={produto}
          dados={embalagensAuxiliares}
          setDados={setEmbalagensAuxiliares}
          nextStep={nextStep}
          produtoReferenciaId={produtoReferenciaId}
        />
      )}

      {step === 7 && (
        <StepFinal
          produto={produto}
          dados={dadosLogisticos}
          embalagensAuxiliares={embalagensAuxiliares}
          reset={reset}
          produtoReferenciaId={produtoReferenciaId} // <-- Adicionado
        />
      )}
    </div>
  );
};

export default App;
