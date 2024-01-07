// local components
import CheckboxList from "./CheckboxList";
import Card from "../Card";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";

type notificationOptions = {
  title: string;
  subtitle: string;
  onCheck: () => Promise<void>;
  onUncheck: () => Promise<void>;
  checked: boolean;
};

const NotificationsCard: React.FC = () => {
  const [notificationChannels, setNotificationChannels] = useState<
    notificationOptions[]
  >([]);

  const [notificationTypes, setNotificationTypes] = useState<
    notificationOptions[]
  >([]);

  const notifWeb = api.notifications.getSettings.useQuery();

  useEffect(() => {
    if (notifWeb.data) {
      // Update the notificationChannels array based on the new data
      setNotificationChannels([
        {
          title: "Enable Web Notifications",
          subtitle: "Get notified on your browser.",
          onCheck: async () => {
            await handleUpdateWeb(true);
            await notifWeb.refetch();
          },
          onUncheck: async () => {
            await handleUpdateWeb(false);
            await notifWeb.refetch();
          },
          checked: notifWeb.data.web_enbld,
        },
        {
          title: "Enable Email Notifications",
          subtitle: "Get notified on your email.",
          onCheck: async () => {
            await handleUpdateEmail(true);
            await notifWeb.refetch();
          },
          onUncheck: async () => {
            await handleUpdateEmail(false);
            await notifWeb.refetch();
          },
          checked: notifWeb.data.email_enbld,
        },
      ]);
    }
  }, [notifWeb.data]);

  useEffect(() => {
    if (notifWeb.data) {
      // Update the notificationChannels array based on the new data
      setNotificationTypes([
        {
          title: "Enable Task Reminders",
          subtitle: "Get notified on tasks before they are due.",
          onCheck: async () => {
            await handleUpdateTaskReminder(true);
            await notifWeb.refetch();
          },
          onUncheck: async () => {
            await handleUpdateTaskReminder(false);
            await notifWeb.refetch();
          },
          checked: notifWeb.data.task_rmndr_enbld,
        },
      ]);
    }
  }, [notifWeb.data]);

  console.log(notifWeb.data);

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
