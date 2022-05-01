import { useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
}

export function FormField({
  htmlFor,
  label,
  value,
  onChange = () => {},
  type = "text",
  error = "",
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
        id={htmlFor}
        name={htmlFor}
        value={value}
        className="w-full p-2 rounded-xl my-2"
      />
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errorText || ""}
      </div>
    </>
  );
}
