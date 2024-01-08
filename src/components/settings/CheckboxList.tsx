import React, { useState } from "react";

type CheckboxListProps = {
  title: string;
  subtitle: string;
  onCheck: () => Promise<void>;
  onUncheck: () => Promise<void>;
  checked: boolean;
};

const CheckboxList: React.FC<CheckboxListProps> = ({
  title,
  subtitle,
  onCheck,
  onUncheck,
  checked,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);

    // Execute the appropriate callback based on the checkbox state
    if (!isChecked) {
      await onCheck();
    } else {
      await onUncheck();
    }
  };

  return (
    <li className="flex pt-6 sm:pt-4">
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          value=""
          className="h-4 w-4 rounded border-gray-300 bg-gray-100"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="ms-2 text-sm">
        <label className="font-medium text-gray-900 ">{title}</label>
        <p
          id="helper-checkbox-text"
          className="text-xs font-normal text-gray-500"
        >
          {subtitle}
        </p>
      </div>
    </li>
  );
};

export default CheckboxList;
