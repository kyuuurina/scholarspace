import React, { useState } from "react";

interface EditableDropDownProps {
  initialValue: string;
  onValueChange: (value: string) => void;
}

const EditableDropDown: React.FC<EditableDropDownProps> = ({
  initialValue,
  onValueChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return isEditing ? (
    <select
      value={selectedValue}
      onChange={(e) => handleValueChange(e.target.value)}
    >
      <option value="Researcher">Researcher</option>
      <option value="Researcher Admin">Researcher Admin</option>
    </select>
  ) : (
    <div onClick={handleEditClick}>{selectedValue}</div>
  );
};

export default EditableDropDown;
