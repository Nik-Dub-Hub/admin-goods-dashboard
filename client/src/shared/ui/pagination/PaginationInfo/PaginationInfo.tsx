interface PaginationInfoProps {
  total: number;
  page: number;
  perPage: number;
}

export function PaginationInfo({ total, page, perPage }: PaginationInfoProps) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="text-sm text-gray-600 flex items-center space-x-1">
      <span>Показано</span>
      <span className="text-black font-medium">{start}</span>
      <span>–</span>
      <span className="text-black font-medium">{end}</span>
      <span className="text-gray-600">из</span>
      <span className="text-black font-medium">{total}</span>
    </div>
  );
}
