import React, { useState } from "react";
import Select, { type MultiValue } from "react-select";
import { api } from "~/utils/api";
import Avatar from "../avatar/avatar";
import type { user } from "@prisma/client";
import { useFetchProjectMembers } from "~/utils/project";
import { MoonLoader } from "react-spinners";
import toast from "react-hot-toast";
import ErrorToast from "../toast/ErrorToast";
import { TRPCClientError } from "@trpc/client";
import { FiPlusCircle } from "react-icons/fi";

type SetReminderProps = {
  refetch: () => void;
};

const SetReminder: React.FC<SetReminderProps> = ({ refetch }) => {
  const [showInputFields, setShowInputFields] = useState(false);
  const [daysBefore, setDaysBefore] = useState(0);
  const [hoursBefore, setHoursBefore] = useState(0);

  const handleSaveReminder = () => {
    console.log(daysBefore, hoursBefore);
    setShowInputFields(false);
  };

  return (
    <div className="w-40">
      <label className="mb-2 block text-sm font-medium text-gray-900">
        Set Reminders
      </label>
      <div
        className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-200"
        onClick={() => setShowInputFields(!showInputFields)}
      >
        <FiPlusCircle />
        <span>Add a reminder</span>
      </div>

      {showInputFields && (
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="daysBefore"
              className="mt-3 block text-sm font-medium text-gray-900"
            >
              Days
            </label>
            <input
              type="number"
              id="daysBefore"
              value={daysBefore}
              onChange={(e) => setDaysBefore(Number(e.target.value))}
              className="mt-1 rounded-lg border border-gray-200 px-3 py-2"
              min={0}
            />

            <label
              htmlFor="hoursBefore"
              className="mt-3 block text-sm font-medium text-gray-900"
            >
              Hours
            </label>
            <input
              type="number"
              id="hoursBefore"
              value={hoursBefore}
              onChange={(e) => setHoursBefore(Number(e.target.value))}
              className="mt-1 rounded-lg border border-gray-200 px-3 py-2"
              min={0}
              max={23}
            />
          </div>
          <button
            onClick={handleSaveReminder}
            className="mt-3 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default SetReminder;
