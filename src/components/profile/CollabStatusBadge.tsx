// CollabStatusBadge.tsx
import React from 'react';

const getCollabStatusStyle = (collabStatus: string | null | undefined) => {
  if (collabStatus === 'Open For Collaboration') {
    return 'px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm';
  } else if (collabStatus === 'Not Open For Collaboration') {
    return 'px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm';
  } else {
    return 'px-2 py-1 bg-white text-gray-800 rounded-full text-sm';
  }
};

interface CollabStatusBadgeProps {
  collabStatus: string | null | undefined;
}

const CollabStatusBadge: React.FC<CollabStatusBadgeProps> = ({ collabStatus }) => {
  const style = getCollabStatusStyle(collabStatus);

  return <span className={`text-sm text-gray-600 ${style}`}>{collabStatus}</span>;
};

export default CollabStatusBadge;
