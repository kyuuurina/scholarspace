// local components
import CheckboxList from "./CheckboxList";
import Card from "../Card";

const notificationOptions = [
  {
    title: "Enable Web Notifications",
    subtitle: "Get notified when you have a new task.",
  },
  {
    title: "Enable Reminders for Tasks",
    subtitle: "Get reminded when you have a task due.",
    disabled: true,
  },
];

const NotificationsCard: React.FC = () => {
  return (
    <Card title="Alerts & Notifications">
      <p className="text-gray-600">
        You can change your notification settings here.
      </p>
      {/* insert checkboxes for enable web notifications, then enable reminders for tasks */}
      <ul>
        {notificationOptions.map(({ title, subtitle, disabled }) => (
          <CheckboxList
            key={title}
            title={title}
            subtitle={subtitle}
            disabled={disabled}
          />
        ))}
      </ul>
    </Card>
  );
};

export default NotificationsCard;
