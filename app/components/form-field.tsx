interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
}

export function FormField({
  htmlFor,
  label,
  value,
  onChange = () => {},
  type = "text",
}: FormFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        type={type}
        onChange={onChange}
        id={htmlFor}
        name={htmlFor}
        value={value}
        className="w-full p-2 rounded-xl my-2"
      />
    </>
  );
}
