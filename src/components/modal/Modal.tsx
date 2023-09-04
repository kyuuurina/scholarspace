type ModalProps = {
  show: boolean;
  onClose: (show: boolean) => void;
  children: React.ReactNode;
  title: string;
};

import { GrClose } from "react-icons/gr";

export function Modal({ show, onClose, children, title }: ModalProps) {
  if (!show) return null;

  return (
    <div
      id="defaultModal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-50 flex h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
    >
      <div className="relative max-h-full w-full max-w-2xl">
        <div className="relative rounded-lg bg-white p-6 shadow">
          <div className="flex items-start justify-between border-b pb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={() => {
                onClose(false);
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full"
            >
              <GrClose className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
