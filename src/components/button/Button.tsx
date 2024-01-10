import React from "react";

type ButtonProps = {
  name: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: "primary" | "secondary";
  visible?: boolean;
};

const Button: React.FC<ButtonProps> = ({
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
          ? "mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800"
          : "mb-2 rounded-lg border border-purple-700 px-5 py-2.5 text-center text-sm font-medium text-purple-700 hover:bg-purple-100 "
      } ${visible ? "visible" : "invisible"}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
