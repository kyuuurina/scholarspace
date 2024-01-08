import { Resend } from "resend";
import { EmailTemplate } from "~/components/email-template";
import { api } from "./api";

const resend = new Resend("re_CBk1vQoA_2z1Ccrv2pn1xKjVE9RYUb8YF");

export const sendEmail = async (message: string, type: string) => {
  const subject =
    type === "TASK_RMNDR" ? "Task Reminder" : "Welcome to Scholarspace!";
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "khairinahizar@gmail.com",
    subject: subject,
    react: EmailTemplate({ firstName: message }),
    text: message, // Use the 'message' parameter here
  });

  return { data, error };
};

export const useSendNotification = async () => {
  const settings = api.notifications.getSettings.useQuery();
  const notificationMutation =
    api.notifications.createNotification.useMutation();

  if (
    settings.data?.task_rmndr_enbld &&
    (settings.data?.web_enbld || settings.data?.email_enbld)
  ) {
    const notification = await notificationMutation.mutateAsync({
      message: "This is to remind you to do your task!",
      type: "TASK_RMNDR",
    });

    if (settings.data?.email_enbld && notification) {
      await sendEmail(notification.message, notification.type);
    }
  }
};
