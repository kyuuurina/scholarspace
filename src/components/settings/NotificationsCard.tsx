// local components
import CheckboxList from "./CheckboxList";
import Card from "../Card";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";

type data =
  | {
      email_enbld: boolean;
      web_enbld: boolean;
      types: string[];
      user_id: string;
      task_rmndr_enbld: boolean;
    }
  | null
  | undefined;

type notificationOptions = {
  title: string;
  subtitle: string;
  onCheck: () => Promise<void>;
  onUncheck: () => Promise<void>;
  checked: boolean;
};

type notifCardProps = {
  notifWeb: data;
  refetch: () => Promise<void>;
};

const NotificationsCard: React.FC<notifCardProps> = ({ notifWeb, refetch }) => {
  const [notificationChannels, setNotificationChannels] = useState<
    notificationOptions[]
  >([]);

  const [notificationTypes, setNotificationTypes] = useState<
    notificationOptions[]
  >([]);

  useEffect(() => {
    if (notifWeb) {
      // Update the notificationChannels array based on the new data
      setNotificationChannels([
        {
          title: "Enable Web Notifications",
          subtitle: "Get notified on your browser.",
          onCheck: async () => {
            await handleUpdateWeb(true);
            await refetch();
          },
          onUncheck: async () => {
            await handleUpdateWeb(false);
            await refetch();
          },
          checked: notifWeb.web_enbld,
        },
        {
          title: "Enable Email Notifications",
          subtitle: "Get notified on your email.",
          onCheck: async () => {
            await handleUpdateEmail(true);
            await refetch();
          },
          onUncheck: async () => {
            await handleUpdateEmail(false);
            await refetch();
          },
          checked: notifWeb.email_enbld,
        },
      ]);
    }
  }, [notifWeb]);

  useEffect(() => {
    if (notifWeb) {
      // Update the notificationChannels array based on the new data
      setNotificationTypes([
        {
          title: "Enable Task Reminders",
          subtitle: "Get notified on tasks before they are due.",
          onCheck: async () => {
            await handleUpdateTaskReminder(true);
            await refetch();
          },
          onUncheck: async () => {
            await handleUpdateTaskReminder(false);
            await refetch();
          },
          checked: notifWeb.task_rmndr_enbld,
        },
      ]);
    }
  }, [notifWeb]);

  console.log(notifWeb);

  const updateWebEnabled = api.notifications.updateWebEnbld.useMutation();
  const handleUpdateWeb = async (enabled: boolean) => {
    try {
      await updateWebEnabled.mutateAsync({ web_enbld: enabled });
    } catch (err) {
      console.error(err);
    }
  };

  const updateEmailEnabled = api.notifications.updateEmailEnbld.useMutation();
  const handleUpdateEmail = async (enabled: boolean) => {
    try {
      await updateEmailEnabled.mutateAsync({ email_enbld: enabled });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskReminder = api.notifications.updateTaskReminder.useMutation();
  const handleUpdateTaskReminder = async (enabled: boolean) => {
    try {
      await updateTaskReminder.mutateAsync({ task_rmndr_enbld: enabled });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card title="Alerts & Notifications">
      <p className="text-gray-600">
        Configure how you want to be notified about your research.
      </p>
      <ul>
        {notificationChannels.map(
          ({ title, subtitle, onCheck, onUncheck, checked }) => (
            <CheckboxList
              key={title}
              title={title}
              subtitle={subtitle}
              onCheck={onCheck}
              onUncheck={onUncheck}
              checked={checked}
            />
          )
        )}
      </ul>
      <p className="pt-4 text-gray-600">Notification types</p>
      {notificationTypes.map(
        ({ title, subtitle, onCheck, onUncheck, checked }) => (
          <CheckboxList
            key={title}
            title={title}
            subtitle={subtitle}
            onCheck={onCheck}
            onUncheck={onUncheck}
            checked={checked}
          />
        )
      )}
    </Card>
  );
};

export default NotificationsCard;
