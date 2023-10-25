import { api } from "./api";
import { useRouterId } from "./routerId";

type Member = {
  userid: string;
  user: {
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  workspace_role: string | null;
};

export const useFetchWorkspace = () => {
  const id: string = useRouterId();

  const workspace = api.workspace.get.useQuery(
    {
      id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { name, description, cover_img, is_personal, ownerid } =
    workspace.data || {};

  const { isLoading, error } = workspace;

  let imgUrl = "";
  if (cover_img) {
    imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/workspace-covers/${cover_img}`;
  }

  return {
    name,
    description,
    cover_img,
    isLoading,
    error,
    is_personal,
    imgUrl,
    ownerid,
  };
};

export const useFetchWorkspaceMembers = () => {
  const id: string = useRouterId();

  const members = api.workspace.listWorkspaceMembers.useQuery(
    {
      id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { isLoading, error } = members;

  // store members in an array
  const workspaceMembers: {
    memberId: string;
    memberName: string | null;
    memberEmail: string | null;
    memberRole: string | null;
    memberAvatarUrl: string | null; // Make it nullable to handle potential null values
  }[] = [];

  if (members.data) {
    members.data.forEach((member: Member) => {
      workspaceMembers.push({
        memberId: member.userid,
        memberName: member.user?.name,
        memberEmail: member.user.email,
        memberRole: member.workspace_role,
        memberAvatarUrl: member.user.avatar_url,
      });
    });
  }

  return {
    workspaceMembers,
    error,
    isLoading,
  };
};
