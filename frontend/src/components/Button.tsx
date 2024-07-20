import React from "react";

const Button = ({
  onClick,
  uploading,
  type,
  children,
}: {
  onClick: () => void;
  uploading?: boolean;
  type: "submit" | "button";
  children: React.ReactNode;
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        type={type}
        disabled={uploading}
        aria-disabled
        typeof={type}
        className={`w-full ${uploading? 'cursor-not-allowed bg-blue-500' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br'} text-white  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 my-4`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
