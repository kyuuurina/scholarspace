// components/BackButton.tsx

import { useRouter } from 'next/router';
import { FiArrowLeft } from 'react-icons/fi';

interface BackButtonProps {
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ children }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} className="flex items-center cursor-pointer">
      <FiArrowLeft className="mr-2" style={{ color: '#6B46C1' }} /> {/* Dark purple color */}
      {children || 'Back'}
    </button>
  );
};

export default BackButton;
