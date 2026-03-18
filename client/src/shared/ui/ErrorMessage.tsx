interface ErrorMessageProps {
  children: string;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <div className="mb-5 p-4 ">
      <p className="text-sm text-red-700 font-medium">{children}</p>
    </div>
  );
}
