import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";

type StartDatePickerProps = {
  selectedDate: Date | undefined;
};

const StartDatePicker: React.FC<StartDatePickerProps> = ({ selectedDate }) => {
  const [startDate, setStartDate] = useState(selectedDate);
  const onChange = (date: Date) => {
    setStartDate(date);
  };
  // You can customize the date picker appearance by passing styles to the className prop
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        Start Date
      </label>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        className="focus:ring-primary-600 focus:border-primary-600 dark:dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
      />
    </div>
  );
};

export default StartDatePicker;
