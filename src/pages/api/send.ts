import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "~/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // change after dah verify scholarspace domain
    to: "khairinahizar@gmail.com",
    subject: "Hello world",
    react: EmailTemplate({ firstName: "John" }),
    text: "Hello world", // Add the 'text' property with a valid value
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};
