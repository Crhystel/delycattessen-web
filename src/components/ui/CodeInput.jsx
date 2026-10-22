import { useRef } from "react";

export default function CodeInput({ value, onChange, length = 6 }) {
  const inputsRef = useRef([]);

  function updateDigit(index, digit) {
    const chars = value.split("");
    chars[index] = digit;
    const updated = chars.join("").slice(0, length);
    onChange(updated);
  }

  function handleChange(e, index) {
    const raw = e.target.value.replace(/\D/g, ""); // digits only

    if (raw.length > 1) {
      handlePaste(raw, index);
      return;
    }

    updateDigit(index, raw);

    if (raw && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(text, startIndex = 0) {
    const digits = text.replace(/\D/g, "").slice(0, length - startIndex);
    if (!digits) return;

    const chars = value.split("");
    for (let i = 0; i < digits.length; i++) {
      chars[startIndex + i] = digits[i];
    }
    const updated = chars.join("").slice(0, length);
    onChange(updated);

    const nextIndex = Math.min(startIndex + digits.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (value[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePasteEvent(e, index) {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    handlePaste(text, index);
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
