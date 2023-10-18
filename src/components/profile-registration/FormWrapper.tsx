// i want this file
import type { ReactNode } from "react";

type FormWrapperProps = {
  children: ReactNode;
};

export function FormWrapper({ children }: FormWrapperProps) {
  return <>{children}</>;
}
