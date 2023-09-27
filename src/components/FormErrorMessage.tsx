type FormErrorMessageProps = {
  text: string | undefined;
};

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ text }) => {
  return <p className="mt-1 text-xs text-red-500">{text}</p>;
};

export default FormErrorMessage;
