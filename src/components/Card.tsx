import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  center?: boolean;
};

const Card: React.FC<CardProps> = ({ title, children, center = false }) => {
  return (
    <div className="block w-full rounded-sm border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100">
      <div className="mb-3 border-b border-gray-200 pb-2">
        <h6 className="text-lg font-bold">{title}</h6>
      </div>
      <div
        className={center ? "flex flex-col items-center justify-center" : ""}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
