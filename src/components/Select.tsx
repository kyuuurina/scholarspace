import React, { useState } from "react";

type SelectProps = {
  initialValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  options: string[];
};

const Select: React.FC<SelectProps> = ({
  initialValue,
  onValueChange,
  disabled = false,
  options,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <select
      value={selectedValue}
      onChange={(e) => handleValueChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
