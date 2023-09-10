type ButtonProps = {
  name: string;
  type?: "button" | "submit"; // Allow "button" and "submit" as valid values
};

export const PrimaryButton: React.FC<ButtonProps> = ({
  name,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className="rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none"
    >
      {name}
    </button>
  );
};