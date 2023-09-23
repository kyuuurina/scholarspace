type ButtonProps = {
  name: string;
  type?: "button" | "submit"; // Allow "button" and "submit" as valid values
  disabled?: boolean;
};
const PrimaryButton: React.FC<ButtonProps> = ({
  name,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none
      ${disabled ? "opacity-50" : ""}
      `}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default PrimaryButton;
