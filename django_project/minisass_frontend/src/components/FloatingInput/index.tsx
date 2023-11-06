import React from "react";
import { ErrorMessage } from "../../components/ErrorMessage";

export type FloatingInputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "size" | "prefix" | "type"
> &
  Partial<{
    wrapClassName: string;
    className: string;
    name: string;
    labelClasses: string;
    wrapperClasses: string;
    labelText: string;
    defaultText: string;
    focusedClasses: string;
    errors: string[];
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    type: string;
  }>;

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      wrapClassName = "",
      className = "",
      name = "",
      labelClasses = "",
      wrapperClasses = "",
      labelText = "",
      defaultText = "",
      focusedClasses = "",
      errors = [],
      onChange,
      prefix,
      suffix,

      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = React.useState(defaultText || "");

    function handleChange(e) {
      setValue(e.target.value);
      onChange?.(e.target.value);
    }

    return (
      <div className={`${className}`}>
        {!!prefix && prefix}
        <div className={`input-container group ${wrapperClasses}`}>
          <input
            ref={ref}
            name={name}
            onChange={handleChange}
            className={`${className}`}
            placeholder=" "
            value={value}
            {...rest}
          />
          <label
            className={`transform group-focus-within:translate-y-[4px] group-focus-within:scale-[0.8] ${labelClasses} ${
              value ? "translate-y-[4px] scale-[0.8]" : focusedClasses
            } `}
          >
            {labelText}
          </label>
        </div>
        {!!suffix && suffix}
        {!!errors && <ErrorMessage errors={errors} />}
      </div>
    );
  },
);

export { FloatingInput };
