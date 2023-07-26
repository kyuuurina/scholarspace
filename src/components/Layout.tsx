// this component is used as a layout for all pages except for authentication pages
import type { ReactNode } from "react";
import { NavBar } from "~/components/NavBar";
import { SideBar } from "~/components/SideBar";

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
          {children}
        </div>
      </div>
    </>
  );
}
