import { Field, Input } from "../../../components/ui/Field";

// Name + email fields shared by the create and edit forms.
export default function StaffFields({
  form,
  onChange,
  error,
  withPlaceholders = false,
}) {
  const ph = (text) => (withPlaceholders ? text : undefined);

  return (
    <>
      <Field label="Primer nombre">
        <Input
          value={form.first_name}
          onChange={(e) => onChange("first_name", e.target.value)}
          placeholder={ph("Primer nombre")}
        />
      </Field>
      <Field label="Segundo nombre (opcional)">
        <Input
          value={form.second_name}
          onChange={(e) => onChange("second_name", e.target.value)}
          placeholder={ph("Segundo nombre")}
        />
      </Field>
      <Field label="Primer apellido">
        <Input
          value={form.last_name}
          onChange={(e) => onChange("last_name", e.target.value)}
          placeholder={ph("Primer apellido")}
        />
      </Field>
      <Field label="Segundo apellido (opcional)">
        <Input
          value={form.second_last_name}
          onChange={(e) => onChange("second_last_name", e.target.value)}
          placeholder={ph("Segundo apellido")}
        />
      </Field>
      <Field label="Correo">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder={ph("nombre@delycattessen.com")}
        />
        {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
      </Field>
    </>
  );
}
