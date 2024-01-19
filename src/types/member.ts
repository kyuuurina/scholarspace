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
