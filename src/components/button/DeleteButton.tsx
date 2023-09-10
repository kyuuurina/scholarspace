type ButtonProps = {
  name: string;
  onClick: () => void;
  disabled?: boolean;
};

export const DeleteButton: React.FC<ButtonProps> = ({
  name,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`${
        disabled ? "bg-gray-300" : "bg-red-600 hover:bg-red-700"
      } w-auto rounded-lg p-2 text-center text-sm font-medium text-white focus:outline-none`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};
