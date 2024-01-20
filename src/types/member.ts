import type { user } from "@prisma/client";

export type WorkspaceMember =
  | ({
      user: user;
    } & {
      workspaceid: string;
      userid: string;
      workspace_role: string;
    })
  | undefined;

export type Member = {
  memberId: string;
  memberName: string | null;
  memberEmail: string | null;
  memberAvatarUrl: string | null;
  memberRole: string | null;
  memberIsExternalCollaborator?: boolean;
};
