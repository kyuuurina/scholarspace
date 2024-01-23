import React, { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import ErrorToast from "../toast/ErrorToast";

type SetReminderProps = {
  refetch: () => void;
  task_id: string | undefined;
};

const SetReminder: React.FC<SetReminderProps> = ({ task_id, refetch }) => {
  const [showInputFields, setShowInputFields] = useState(false);
  const [daysBefore, setDaysBefore] = useState(0);
  const [hoursBefore, setHoursBefore] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  if (!task_id) return null;
  // get tasks reminders
  const reminders = api.task.listTaskReminders.useQuery({ task_id: task_id });

  const createReminder = api.task.createTaskReminder.useMutation();
  const handleSaveReminder = () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      createReminder.mutate({
        days: daysBefore,
        hours: hoursBefore,
        task_id,
      });
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
    } finally {
      refetch();
      setShowInputFields(false);
      setDaysBefore(0);
      setHoursBefore(0);
      setIsAdding(false);
    }
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

      {/*  render the reminders in a list */}
      <div className="mt-3">
        {reminders.data?.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2"
          >
            <div>
              <span className="text-xs text-gray-400">Days</span>
              <span className="text-sm font-medium">
                {reminder.days.toString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400">Hours</span>
              <span className="text-sm font-medium">
                {reminder.hours.toString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showInputFields && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="daysBefore"
                className="mt-3 block text-xs font-medium text-gray-900"
              >
                Days
              </label>
              <input
                type="number"
                id="daysBefore"
                value={daysBefore}
                onChange={(e) => setDaysBefore(Number(e.target.value))}
                className="mt-1 w-20 rounded-lg border border-gray-200 px-3 py-2"
                min={0}
              />
            </div>

            <div>
              <label
                htmlFor="hoursBefore"
                className="mt-3 block text-xs font-medium text-gray-900"
              >
                Hours
              </label>
              <input
                type="number"
                id="hoursBefore"
                value={hoursBefore}
                onChange={(e) => setHoursBefore(Number(e.target.value))}
                className="mt-1 w-20 rounded-lg border border-gray-200 px-3 py-2"
                min={0}
                max={23}
              />
            </div>
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
