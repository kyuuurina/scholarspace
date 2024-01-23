import { type ReactNode, useEffect } from "react";
import { useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Knock } from "@knocklabs/node";
import { useUser } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import { MoonLoader } from "react-spinners";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const user = useUser();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const { data: profileData, isLoading } =
    api.profile.getProfileByUserId.useQuery({
      user_id: user?.id ?? "",
    });
  const { data: userData } = api.user.get.useQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);

        await knockClient.users.identify(user.id, {
          name: profileData?.name,
          email: userData?.email,
        });
      }
    };

    void fetchData();
  }, [user]);

  if (!user || !profileData || !userData) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <MoonLoader color="#7C3AED" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar
          open={open}
          toggleSidebar={handleToggle}
          profileId={profileData?.profile_id}
        />
        <div className="w-full">
          <NavBar toggleSidebar={handleToggle} profile={profileData} />
          {children}
        </div>
      </div>
    </>
  );
}
