interface ButtonProps {
  type?: "button" | "submit";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  type = "button",
  disabled = false,
  children,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full py-[14px] px-6 rounded-[12px] font-medium text-lg transition-all duration-300 shadow-lg mb-[16px] ${
        disabled
          ? "bg-[#D1D5DB] cursor-not-allowed shadow-md"
          : "bg-gradient-to-r from-[#242EDB] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
