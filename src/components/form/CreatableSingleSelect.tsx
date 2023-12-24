import { useState } from "react";
import CreatableSelect from "react-select/creatable";

type Option = {
  readonly label: string;
  readonly value: string;
};

type CreatableSingleSelectProps = {
  optionsArr: Option[];
  createValue: (inputValue: string) => Promise<void>;
  setValue: (newValue: string) => void;
};

const CreatableSingleSelect: React.FC<CreatableSingleSelectProps> = ({
  optionsArr,
  createValue,
  setValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(optionsArr);
  const [selected, setSelected] = useState<Option | null>();

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setSelected(newOption);
    }, 1000);
    await createValue(inputValue);
  };

  const handleChange = (newValue: Option | null) => {
    setSelected(newValue);
    if (newValue) {
      setValue(newValue.value);
    }
    console.log(newValue?.value);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(newValue) => handleChange(newValue)}
      onCreateOption={handleCreate}
      options={optionsArr}
      value={selected}
    />
  );
};

export default CreatableSingleSelect;
