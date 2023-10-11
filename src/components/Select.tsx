import React, { useState } from "react";

type SelectProps = {
  initialValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  initialValue,
  onValueChange,
  disabled = false,
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
      <option value="Researcher">Researcher</option>
      <option value="Researcher Admin">Researcher Admin</option>
    </select>
  );
};

export default Select;
