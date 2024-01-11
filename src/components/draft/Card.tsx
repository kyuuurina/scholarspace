import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function Card({ children, noPadding }: CardProps) {
  let classes = 'bg-white shadow-md shadow-gray-300 rounded-md mb-5';
  if (!noPadding) {
    classes += ' p-4';
  }
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
