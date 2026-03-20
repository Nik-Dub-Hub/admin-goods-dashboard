import React, { useCallback, useRef, useEffect } from "react";

interface ProductHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  return (
    <div className="w-full h-[105px] bg-white rounded-lg mb-6 flex items-center justify-between px-8">
      <div className="flex items-center">
        <h1
          className="text-3xl font-bold text-black leading-tight"
          style={{ fontSize: "24px" }}
        >
          Товары
        </h1>
      </div>

      <div className="flex-1 flex justify-center mx-8">
        <div className="relative w-[1023px] max-w-full h-[48px] bg-[#F3F3F3] rounded-lg flex items-center px-4">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Найти"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-full bg-transparent border-none outline-none pl-12 pr-4 text-base text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
};
