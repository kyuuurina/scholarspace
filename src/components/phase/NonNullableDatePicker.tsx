import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type NonNullableDatePickerProps = {
  label?: string;
  selectedDate: Date | undefined;
  onChange: (
    date: Date | undefined,
    event: React.SyntheticEvent<any> | undefined
  ) => void;
};

const NonNullableDatePicker: React.FC<NonNullableDatePickerProps> = ({
  selectedDate,
  label = "Date",
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <DatePicker
        selected={selectedDate}
        showTimeInput
        onChange={(date: Date, event: React.SyntheticEvent<any> | undefined) =>
          onChange(date || undefined, event)
        }
        className="focus:ring-primary-600 focus:border-primary-600 dark:dark:focus:border-primary-500 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
      />
    </div>
  );
};

export default NonNullableDatePicker;
