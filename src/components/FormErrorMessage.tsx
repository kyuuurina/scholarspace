type FormErrorMessageProps = {
  text: string | undefined;
};

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ text }) => {
  return <p className="mt-1 text-xs text-red-500">{text}</p>;
};
