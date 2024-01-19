import type { user } from "@prisma/client";

type taskRow =
  | {
      id: string;
      name: string;
      description: string | null;
      created_at: Date;
      status: string;
      // assignees:
      //   | {
      //       id: string;
      //       name: string | null;
      //       avatar_url: string | null;
      //       email: string | null;
      //     }[]
      //   | undefined;
      phase_id: string;
      end_at: Date | null;
      deadline: Date | null;
      properties: {
        id: bigint;
        property_id: string;
        name: string;
        value: string | null;
      }[];
      attachments: string[] | null;
    }
  | undefined;

type userDropdown = {
  value: user;
  label: string | null;
};

type TaskFormData = {
  name: string | undefined;
  description: string | null | undefined;
  created_at: Date | undefined;
  end_at: Date | null | undefined;
  deadline: Date | null | undefined;
  status: string | undefined;
  assignees:
    | {
        id: string;
        name: string | null;
        avatar_url: string | null;
        email: string | null;
      }[]
    | undefined;
  properties:
    | {
        property_id: string | undefined;
        value: string | null | undefined;
      }[]
    | undefined;
};

export type { taskRow, userDropdown, TaskFormData };
