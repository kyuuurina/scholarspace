// this component is used as a layout for all pages except for authentication pages
import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { SideBar } from "./SideBar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="light:black flex-grow dark:text-white">
          <NavBar />
          <div className="p-8">{children}</div>
        </div>
      </div>
    </>
  );
}
