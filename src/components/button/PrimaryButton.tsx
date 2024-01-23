import { MoonLoader } from "react-spinners";

type ButtonProps = {
  name: string;
  type?: "button" | "submit"; // Allow "button" and "submit" as valid values
  disabled?: boolean;
  onClick?: () => void;
  isSubmitting?: boolean;
};

const PrimaryButton: React.FC<ButtonProps> = ({
  name,
  type = "button",
  disabled = false,
  onClick = () => {
    return undefined;
  },
  isSubmitting = false,
}) => {
  return (
    <button
      type={type}
      className={`flex justify-evenly rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none
      ${disabled ? "opacity-50" : ""}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {name}
      {isSubmitting && (
        <MoonLoader
          color={"#ffffff"}
          loading={true}
          aria-label="FadeLoader"
          data-testid="loader"
          size={15}
        />
      )}
    </button>
  );
};

export default PrimaryButton;
