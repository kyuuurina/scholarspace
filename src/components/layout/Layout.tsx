// this component is used as a layout for all pages except for authentication pages
import type { ReactNode } from "react";
import { useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Router, { useRouter } from "next/router";
import { useRouterId } from "~/utils/routerId";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const router = useRouter();
  const { id } = router.query;
  const profileId = id ? id.toString() : undefined;

  console.log("Router Query Layout", router.query);
  console.log("profileId Layout", profileId);

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar open={open} toggleSidebar={handleToggle} profileId={profileId}/>
        <div className="w-full">
          <NavBar toggleSidebar={handleToggle} />
          {children}
        </div>
      </div>
    </>
  );
}
