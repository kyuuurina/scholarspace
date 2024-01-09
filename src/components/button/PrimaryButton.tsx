import { on } from "events";

type ButtonProps = {
  name: string;
  type?: "button" | "submit"; // Allow "button" and "submit" as valid values
  disabled?: boolean;
  onClick?: () => void;
};
const PrimaryButton: React.FC<ButtonProps> = ({
  name,
  type = "button",
  disabled = false,
  onClick = () => {
    return undefined;
  },
}) => {
  return (
    <button
      type={type}
      className={`rounded-lg border border-purple-accent-1 bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none
      ${disabled ? "opacity-50" : ""}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default PrimaryButton;
