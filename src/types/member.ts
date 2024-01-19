export type WorkspaceMember =
  | ({
      user: {
        profile: {
          name: string;
          avatar_url: string | null;
        } | null;
      } & {
        id: string;
        email: string;
      };
    } & {
      workspaceid: string;
      userid: string;
      workspace_role: string;
      is_collaborator: boolean | null;
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
