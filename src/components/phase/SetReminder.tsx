import React, { useState } from "react";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import ErrorToast from "../toast/ErrorToast";
import { Knock } from "@knocklabs/node";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import type { taskList } from "~/types/task";
import NullableDatePicker from "./NullableDatePicker";

type SetReminderProps = {
  refetch: () => void;
  task: taskList;
};

const SetReminder: React.FC<SetReminderProps> = ({ task, refetch }) => {
  const [showInputFields, setShowInputFields] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);

  const user = useUser();

  const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY || "");
  const { data } = api.notifications.getSettings.useQuery({
    user_id: user?.id || "",
  });

  const handleNotifClick = async () => {
    await knockClient.workflows.createSchedules("new-workout", {
      recipients: [user?.id || ""],
      scheduled_at: date.toISOString(),
      data: {
        message: `Reminder for task ${
          task?.name ?? ""
        } - ${date.toISOString()}`,
        isWebEnabled: data?.web_enbld,
        isEmailEnabled: data?.email_enbld,
      },
    });
  };

  if (!task) return null;

  // update task with remider
  const updateTask = api.task.updateTaskReminder.useMutation();

  const handleSaveReminder = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      updateTask.mutate({
        id: task.id,
        reminderData: date,
      });
      await handleNotifClick();
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
      setIsAdding(false);
    }
  };

  return (
    <div className="w-40">
      <div>
        <div className="flex items-center justify-between">
          {/* save date  input*/}
          <NullableDatePicker
            selectedDate={date}
            onChange={(date) => {
              setDate(date || new Date());
              setShowInputFields(true);
            }}
            label="Reminder"
          />
        </div>
        {showInputFields && (
          <button
            onClick={handleSaveReminder}
            className="mt-3 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default SetReminder;
