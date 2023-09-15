// this component is used as a layout for all pages except for authentication pages
import type { ReactNode } from "react";
import { useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar open={open} toggleSidebar={handleToggle} />
        <div className="w-full">
          <NavBar toggleSidebar={handleToggle} />
          <div className="relative top-16">{children}</div>
        </div>
      </div>
    </>
  );
}
