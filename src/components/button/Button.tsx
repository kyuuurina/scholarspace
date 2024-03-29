import React from "react";
import { MoonLoader } from "react-spinners";

type ButtonProps = {
  name: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: "primary" | "secondary";
  visible?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  name,
  onClick,
  type = "button",
  style = "primary",
  visible = true,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`${
        style === "primary"
          ? "rounded-lg bg-purple-700 px-5 py-2 text-sm font-medium text-white hover:bg-purple-800"
          : "rounded-lg border border-purple-700 px-5 py-2 text-center text-sm font-medium text-purple-700 hover:bg-purple-100 "
      } ${visible ? "visible" : "invisible"}`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <div className="flex">
        {name}
        {isLoading && <MoonLoader size={20} color="#ffffff" />}
      </div>
    </button>
  );
};

export default Button;
