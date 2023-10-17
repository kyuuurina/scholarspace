import React from "react";

type ButtonProps = {
  name: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: "primary" | "secondary";
  visible?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  type = "button",
  style = "primary",
  visible = true,
}) => {
  return (
    <button
      type={type}
      className={`${
        style === "primary"
          ? "mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
          : "mb-2 mr-2 rounded-lg border border-purple-700 px-5 py-2.5 text-center text-sm font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white"
      } ${visible ? "visible" : "invisible"}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};
