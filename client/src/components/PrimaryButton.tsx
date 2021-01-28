import React from 'react';
import { Button } from 'antd';

interface PrimaryButtonProps {
  onClick: () => void;
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean;
}

// This is the tweethresh GREEN primary button
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  size = 'middle',
  disabled = false,
}) => {
  return (
    <Button
      type="primary"
      size={size}
      disabled={disabled}
      onClick={onClick}
      className="bg-emerald-600 border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 focus:bg-emerald-600 focus:border-emerald-600"
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
