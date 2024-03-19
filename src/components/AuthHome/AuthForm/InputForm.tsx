import clsx from "clsx";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "../../../@/components/ui/input";

interface InputPorps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const InputForm: React.FC<InputPorps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        className="flex felx-start text-sm font-medium leading-6 text-gray-900"
        htmlFor={id}
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        {...register(id, { required })}
        className={clsx(
          `
                form-input
                text-gray-900
            `,
          errors[id] && "focus:ring-rose500",
          disabled && "opacity-50 cursor-default"
        )}
      />
    </div>
  );
};

export default InputForm;
