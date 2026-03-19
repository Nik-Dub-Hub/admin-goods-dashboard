import { getVisiblePages } from "../../../lib/getVisiblePages";

interface PaginationControlsProps {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  total,
  page,
  perPage,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / perPage);
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className={`px-3 py-1 w-9 h-9 rounded-md text-sm font-medium flex items-center justify-center ${
          page === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 bg-white hover:bg-gray-100"
        }`}
      >
        <img
          src="/icons/CaretLeft.svg"
          alt="Предыдущая"
          className="w-5 h-5 hover:opacity-70 transition-opacity"
        />
      </button>

      {visiblePages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(Number(p))}
            className={`px-3 py-1 w-9 h-9 border  border-gray-200 rounded-md text-sm font-medium ${
              p === page
                ? "bg-[#797FEA] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className={`px-3 py-1 w-9 h-9 rounded-md text-sm font-medium ${
          page === totalPages
            ? "text-gray-400  cursor-not-allowed"
            : "text-gray-700 bg-white hover:bg-gray-100"
        }`}
      >
        <img
          src="/icons/CaretRight.svg"
          alt="Следующая"
          className="w-5 h-5 hover:opacity-70 transition-opacity"
        />
      </button>
    </div>
  );
}
