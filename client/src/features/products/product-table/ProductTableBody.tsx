import React from "react";

interface TableProduct {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}

interface ProductTableBodyProps {
  products: TableProduct[];
  selectedProducts: number[];
  onToggleProduct: (id: number) => void;
}

export const ProductTableBody: React.FC<ProductTableBodyProps> = ({
  products,
  selectedProducts,
  onToggleProduct,
}) => {
  const isSelected = (id: number) => selectedProducts.includes(id);

  return (
    <tbody className="divide-y divide-gray-200">
      {products.map((product) => (
        <tr
          key={product.id}
          className={isSelected(product.id) ? "bg-blue-50/30" : ""}
        >
          <td className="relative">
            <div className="flex items-center gap-3">
              {isSelected(product.id) && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3C538E]" />
              )}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleProduct(product.id);
                }}
              >
                <img
                  src={
                    isSelected(product.id)
                      ? "/icons/Checkbox-on.svg"
                      : "/icons/Checkbox-off.svg"
                  }
                  alt="checkbox"
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg" />
                <div>
                  <span
                    className="text-gray-900 text-base leading-none block"
                    style={{
                      fontSize: "16px",
                      lineHeight: "auto",
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </span>
                  <span
                    className="text-sm text-gray-500 truncate block"
                    style={{ fontSize: "14px", lineHeight: "auto" }}
                  >
                    категория
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td className="text-center">
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'Open Sans', sans-serif",
                lineHeight: "auto",
              }}
            >
              {product.vendor}
            </span>
          </td>
          <td className="text-center">
            <span
              style={{
                fontSize: "16px",
                lineHeight: "auto",
                fontFamily: "var(--paragraph-font)",
                color: "#000000",
              }}
            >
              {product.article}
            </span>
          </td>
          <td className="text-center">
            <span
              className="text-base font-light leading-none"
              style={{ fontFamily: "var(--paragraph-font)", color: "#000000" }}
            >
              {(() => {
                const rating = product.rating ?? 0;
                const intPart = Math.floor(rating);
                const fracPart =
                  rating % 1 === 0 ? "" : rating.toFixed(1).split(".")[1];
                const isLowRating = rating < 3.5;

                return (
                  <>
                    <span
                      style={{ color: isLowRating ? "#F11010" : "#000000" }}
                    >
                      {intPart}
                      {fracPart && `.${fracPart}`}
                    </span>
                    <span style={{ color: "#000000" }}>/5</span>
                  </>
                );
              })()}
            </span>
          </td>
          <td className="text-center">
            <span
              style={{
                fontSize: "16px",
                lineHeight: "auto",
                fontFamily: "'Roboto Mono', monospace",
                color: "#000000",
              }}
            >
              {(() => {
                const price = product.price ?? 0;
                const formattedPrice = price.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                const [integerPart, decimalPart] = formattedPrice.split(",");
                return (
                  <>
                    <span className="text-black">{integerPart}</span>
                    <span className="text-gray-500">,{decimalPart}</span>
                  </>
                );
              })()}
            </span>
          </td>
          <td className="px-6 py-3 w-[13%]">
            <div className="flex justify-end gap-9">
              <img
                src="/icons/Frame 1963.svg"
                alt="Action"
                className="w-[52px] h-[27px] cursor-pointer flex-shrink-0"
              />
              <img
                src="/icons/DotsThreeCircle.svg"
                alt="Menu"
                className="w-[32px] h-[32px] cursor-pointer flex-shrink-0"
              />
            </div>
          </td>
          <td className="px-6 py-3 w-[13%]">
            <div className="flex justify-end gap-9"></div>
          </td>
        </tr>
      ))}

      {products.length === 0 && (
        <tr>
          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
            Товары не найдены
          </td>
        </tr>
      )}
    </tbody>
  );
};
