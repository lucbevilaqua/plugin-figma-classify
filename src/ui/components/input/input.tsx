import React from "react";
import './styles.css'
import { InputComponentProps } from "./types";

const InputComponent: React.FunctionComponent<InputComponentProps> = ({
  className = "",
  type,
  value,
  placeholder,
  disabled,
  input,
}) => (
  <input
    type={type}
    className={className}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    onChange={(event) => input && input(event.target.value)}
  />
);

const Input: React.FunctionComponent<InputComponentProps> = ({
  className,
  type,
  value,
  placeholder,
  disabled,
  input,
}) => {
  className = className || "";
  type = type || "text";
  const inputClass = "input__field input-container";

  return (
    <div className="input">
      <InputComponent
        className={`${inputClass} ${className}`}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        input={input}
      />
    </div>
  );
};

export default Input;
