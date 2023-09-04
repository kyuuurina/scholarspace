type SuccessToastProps = {
  message: string;
};

export const ErrorToast: React.FC<SuccessToastProps> = ({
  message = "Success!",
}) => {
  return (
    <div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-red-500 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">Error</p>
            <p className="mt-1 text-sm text-white">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
