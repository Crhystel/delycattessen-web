import { useRef } from "react";

export default function CodeInput({ value, onChange, length = 6 }) {
  const inputsRef = useRef([]);

  function actualizarDigito(index, digito) {
    const chars = value.split("");
    chars[index] = digito;
    const nuevo = chars.join("").slice(0, length);
    onChange(nuevo);
  }

  function handleChange(e, index) {
    const raw = e.target.value.replace(/\D/g, ""); // solo dígitos

    if (raw.length > 1) {
      handlePaste(raw, index);
      return;
    }

    actualizarDigito(index, raw);

    if (raw && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(texto, indexInicial = 0) {
    const digitos = texto.replace(/\D/g, "").slice(0, length - indexInicial);
    if (!digitos) return;

    const chars = value.split("");
    for (let i = 0; i < digitos.length; i++) {
      chars[indexInicial + i] = digitos[i];
    }
    const nuevo = chars.join("").slice(0, length);
    onChange(nuevo);

    const siguienteIndex = Math.min(indexInicial + digitos.length, length - 1);
    inputsRef.current[siguienteIndex]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (value[index]) {
        actualizarDigito(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        actualizarDigito(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePasteEvent(e, index) {
    e.preventDefault();
    const texto = e.clipboardData.getData("text");
    handlePaste(texto, index);
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePasteEvent(e, i)}
          className="w-11 h-12 text-center text-lg font-semibold rounded-xl border border-ink-100 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        />
      ))}
    </div>
  );
}
