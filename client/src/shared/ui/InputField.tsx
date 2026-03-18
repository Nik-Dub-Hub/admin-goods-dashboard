interface InputFieldProps {
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  iconSrc: string;
  showClear?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  hasPassword?: boolean;
}

export default function InputField({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  iconSrc,
  showClear = false,
  onClear,
  showPasswordToggle = false,
  onPasswordToggle,
}: InputFieldProps) {
  return (
    <div className="relative">
      <img
        src={iconSrc}
        alt="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none opacity-50"
      />

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full pl-12 pr-12 py-[14px] bg-white border border-[#E5E7EB] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] disabled:bg-[#F9FAFB] disabled:cursor-not-allowed transition-all duration-200 text-base placeholder-gray-400"
        placeholder={placeholder}
      />

      {showClear && onClear && (
        <img
          src="/icons/Group 1.svg"
          alt="clear"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity z-10"
          onClick={onClear}
        />
      )}

      {showPasswordToggle && onPasswordToggle && (
        <img
          src="/icons/eye-off.svg"
          alt="toggle-password"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity z-10"
          onClick={onPasswordToggle}
        />
      )}
    </div>
  );
}
