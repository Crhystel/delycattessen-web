import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const baseInput =
  "w-full rounded-xl border border-ink-100 px-3.5 py-2.5 pr-10 text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 transition";

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={baseInput}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
