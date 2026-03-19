import { useState, useEffect } from "react";
import ProductApi from "../../entities/product/ProductApi";
import type { User } from "../../entities/user/types";
import { PaginationControls } from "../../shared/ui/pagination/PaginationControls/PaginationControls";
import { PaginationInfo } from "../../shared/ui/pagination/PaginationInfo/PaginationInfo";
import { SortIcon } from "../../shared/ui/SortIcon";
import Button from "../../shared/ui/Button";
import InputField from "../../shared/ui/InputField";
import AuthLayout from "../../shared/ui/AuthLayout";

interface ProductsPageProps {
  user: User;
  token: string | null;
}

interface Product {
  id: number;
  name: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
}

interface PaginationInfoProps {
  total: number; // Общее количество товаров
  page: number; // Текущая страница
  perPage: number; // Сколько товаров на одной странице
}


type SortDirection = "asc" | "desc" | null;
interface SortState {
  field: keyof Product | null;
  direction: SortDirection;
}

// Обновляем интерфейс props (без изменений)
interface ProductsPageProps {
  user: User;
  token: string | null;
}

export default function ProductsPage({ user, token }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
 const [sort, setSort] = useState<SortState>({ field: null, direction: null });
  const perPage = 20;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    vendor: "",
    article: "",
    price: "",
  });
  const [showToast, setShowToast] = useState(false);

  // 🔥 Открытие модального окна
  const openAddModal = () => {
  console.log(1111111) 
    setIsAddModalOpen(true);
    setNewProduct({ name: "", vendor: "", article: "", price: "" });
  };

  // 🔥 Закрытие модального окна
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // 🔥 Обработчик формы (без реального API)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🆕 Новый товар:", newProduct);

    // Имитация успешного сохранения
    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        closeAddModal();
      }, 2000);
    }, 500);
  };

  // 🔥 Обработчик изменений формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  
  // 🔥 Загрузка товаров
useEffect(() => {
  loadProducts();
}, []);

  // 🔥 Поиск с debounce
useEffect(() => {
  const timeoutId = setTimeout(() => {
    loadProducts();
  }, 300);
  return () => clearTimeout(timeoutId);
}, [searchQuery, sort]);
 


  // 🔥 Обновление master checkbox
   useEffect(() => {
     const allSelected =
       products.length > 0 && products.every((p) => selectedProducts.has(p.id));
     const someSelected = products.some((p) => selectedProducts.has(p.id));
     setSelectAll(allSelected);

     const masterCheckbox = document.querySelector(
       "#master-checkbox",
     ) as HTMLInputElement;
     if (masterCheckbox) {
       masterCheckbox.indeterminate = someSelected && !allSelected;
     }
   }, [products, selectedProducts]);

   const sortProducts = (products: Product[], sort: SortState): Product[] => {
     if (!sort.field || sort.direction === null) return products;

     return [...products].sort((a, b) => {
       let aValue: any = a[sort.field];
       let bValue: any = b[sort.field];

       // Нормализация числовых значений
       if (sort.field === "price" || sort.field === "rating") {
         aValue = Number(aValue) || 0;
         bValue = Number(bValue) || 0;
       }

       if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
       if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
       return 0;
     });
   };

const loadProducts = async () => {
  console.log("🔥 LOAD PRODUCTS START", { searchQuery, page, sort });

  try {
    setLoading(true);
    const skip = (page - 1) * perPage;

    // 🔥 Маппинг для DummyJSON API
    const apiFieldMap: Partial<Record<keyof Product, string>> = {
      name: "title",
      vendor: "brand",
      article: "sku",
      rating: "rating",
      price: "price",
    };

    const sortBy = sort.field ? apiFieldMap[sort.field] : undefined;

    const response = await ProductApi.getProducts(
      perPage,
      skip,
      sortBy || undefined, // sortBy
      (sort.direction as "asc" | "desc") || "asc", // order
      undefined, // select
      searchQuery.trim() || undefined, // q
    );

    console.log("📡 RESPONSE:", response);

    const mappedProducts = response.products.map(mapProduct);
    setProducts(mappedProducts);
    setTotal(response.total || response.products.length);

    console.log(
      "✅ Products loaded:",
      mappedProducts.length,
      "Total:",
      response.total,
    );
  } catch (error) {
    console.error("💥 ОШИБКА API:", error);
    setProducts([]);
    setTotal(0);
  } finally {
    setLoading(false);
  }
};

  // 🔥 Обработчик сортировки
const handleSort = (field: keyof Product) => {
  const apiFieldMap: Partial<Record<keyof Product, string>> = {
    name: "title",
    vendor: "brand",
    article: "sku",
    rating: "rating",
    price: "price",
  };

  const apiField = apiFieldMap[field];
  if (!apiField) return;

  if (sort.field === field) {
    setSort({
      field,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  } else {
    setSort({ field, direction: "asc" });
  }
};

 const mapProduct = (product: any): Product => ({
   id: product.id,
   name: product.title,
   vendor: product.brand,
   article: product.sku || `SKU-${product.id}`,
   rating: product.rating,
   price: product.price,
 });

  const handleRefresh = () => {
    setSearchQuery("");
    loadProducts();
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = products.map((p) => p.id);
      setSelectedProducts(new Set(allIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const toggleProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // 🔥 Loading показывает полный UI с индикатором
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] py-5">
        {/* HEADER */}
        <div className="w-full h-[105px] bg-white rounded-lg mb-6 flex items-center justify-between px-8">
          <div className="flex items-center">
            <h1
              className="text-3xl font-bold text-black"
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
                type="text"
                placeholder="Найти"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none pl-12 pr-4 text-base text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8">
          <div className="relative h-[80px] mb-6">
            <div>
              <h2
                className="font-bold text-black"
                style={{
                  fontSize: "20px",
                  lineHeight: "20px",
                  fontWeight: 700,
                }}
              >
                Все позиции
              </h2>
            </div>
            <div className="absolute right-0 top-0 flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="w-[42px] h-[42px] bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:shadow-sm transition-all"
              >
                <img
                  src="/icons/ArrowsClockwise.svg"
                  alt="Refresh"
                  className="w-[22px] h-[22px]"
                />
              </button>
              <button
                onClick={openAddModal}
                className="w-[147px] h-[42px] bg-[#242EDB] rounded-lg flex items-center justify-center space-x-5 hover:bg-[#1e27c3] transition-all"
              >
                <img
                  src="/icons/Vector.svg"
                  alt="Add"
                  className="w-[17px] h-[17px]"
                />
                <span
                  className="text-white font-medium"
                  style={{
                    fontSize: "14px",
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  Добавить
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading && (
              <div className="overflow-x-auto">
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Спиннер */}
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />

                    {/* Прогресс-бар */}
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#242EDB] to-blue-600 h-2 rounded-full animate-pulse transition-all duration-1000"
                        style={{ width: "60%" }} // можно сделать динамическим
                      />
                    </div>

                    <div className="text-sm text-gray-500">
                      Загрузка товаров...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] py-5">
      {/* HEADER */}
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
              type="text"
              placeholder="Найти"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none pl-12 pr-4 text-base text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8">
        {/* ВЕРХНЯЯ ПАНЕЛЬ */}
        <div className="relative h-[80px] mb-6">
          <div>
            <h2
              className="font-bold text-black leading-tight"
              style={{ fontSize: "20px", lineHeight: "20px", fontWeight: 700 }}
            >
              Все позиции
            </h2>
          </div>

          <div className="absolute right-[0px] top-[0px] flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="w-[42px] h-[42px] bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:shadow-sm transition-all"
            >
              <img
                src="/icons/ArrowsClockwise.svg"
                alt="ArrowsClockwise Icon"
                className="w-[22px] h-[22px]"
              />
            </button>

            <button
              onClick={openAddModal} // 🔥 ЭТО ОТСУТСТВУЕТ!
              className="w-[147px] h-[42px] bg-[#242EDB] rounded-lg flex items-center justify-center space-x-5 hover:bg-[#1e27c3] transition-all"
            >
              <img
                src="/icons/Vector.svg"
                alt="Vector Icon"
                className="w-[17px] h-[17px]"
              />
              <span
                className="text-white font-medium leading-none"
                style={{ fontSize: "14px", fontFamily: "'Cairo', sans-serif" }}
              >
                Добавить
              </span>
            </button>
          </div>
        </div>

        {/* ТАБЛИЦА */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed [&_th]:px-3 [&_td]:px-3">
            <thead>
              <tr>
                {/* Наименование + чекбокс */}
                <th className="px-6 py-4 text-left w-[30%]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 cursor-pointer relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectAll(!selectAll);
                      }}
                    >
                      <img
                        src={
                          selectAll
                            ? "/icons/Checkbox-on.svg"
                            : "/icons/Checkbox-off.svg"
                        }
                        alt="checkbox"
                        className="w-4 h-4 absolute inset-0"
                      />
                    </div>
                    <span className="font-semibold text-gray-500 text-[14px]">
                      Наименование
                    </span>
                  </div>
                </th>

                <th
                  className="px-6 py-4 text-center w-[15%] pl-5 justify-end pr-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("vendor")}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-gray-500 text-[14px]">
                      Вендор
                    </span>
                    {sort.field === "vendor" && (
                      <SortIcon direction={sort.direction} />
                    )}
                  </div>
                </th>

                {/* Артикул - добавляем сортировку */}
                <th
                  className="px-6 py-4 text-center w-[15%] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("article")}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-gray-500 text-[14px]">
                      Артикул
                    </span>
                    {sort.field === "article" && (
                      <SortIcon direction={sort.direction} />
                    )}
                  </div>
                </th>

                {/* Оценка - добавляем сортировку */}
                <th
                  className="px-6 py-4 text-center w-[10%] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-gray-500 text-[14px]">
                      Оценка
                    </span>
                    {sort.field === "rating" && (
                      <SortIcon direction={sort.direction} />
                    )}
                  </div>
                </th>

                {/* Цена - добавляем сортировку */}
                <th
                  className="px-6 py-4 text-center w-[10%] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-gray-500 text-[14px]">
                      Цена, ₽
                    </span>
                    {sort.field === "price" && (
                      <SortIcon direction={sort.direction} />
                    )}
                  </div>
                </th>

                {/* Действия без сортировки */}
                <th className="px-6 py-4 w-[5%]"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={
                    selectedProducts.has(product.id) ? "bg-blue-50/30" : ""
                  }
                >
                  {/* Наименование */}
                  <td className="relative">
                    <div className="flex items-center gap-3">
                      {/* Синяя полоска */}
                      {selectedProducts.has(product.id) && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3C538E]" />
                      )}

                      {/* Чекбокс */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProduct(product.id);
                        }}
                      >
                        <img
                          src={
                            selectedProducts.has(product.id)
                              ? "/icons/Checkbox-on.svg"
                              : "/icons/Checkbox-off.svg"
                          }
                          alt="checkbox"
                          className="w-4 h-4"
                        />
                      </div>

                      {/* Иконка + название */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-lg " />
                        <div>
                          <span
                            className="text-gray-900 text-base leading-none block"
                            style={{
                              fontSize: "16px",
                              lineHeight: "auto",
                              fontWeight: 600,
                              fontFamily: "var(--heading6-font)", // или конкретный H6 шрифт
                            }}
                          >
                            {product.name}
                          </span>
                          {/* Подзаголовок если есть */}
                          <span
                            className="text-sm text-gray-500 truncate block"
                            style={{
                              fontSize: "14px",
                              lineHeight: "auto",
                              fontFamily: "var(--label-font)", // или конкретный Label шрифт
                            }}
                          >
                            категория
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Вендор */}
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

                  {/* Артикул */}
                  <td className="text-center">
                    <span
                      style={{
                        fontSize: "16px",
                        lineHeight: "auto",
                        fontFamily: "var(--paragraph-font)", // или system-ui
                        color: "#000000",
                      }}
                    >
                      {product.article}
                    </span>
                  </td>

                  {/* Оценка */}
                  <td className="text-center">
                    <span
                      className="text-base font-light leading-none"
                      style={{
                        fontFamily: "var(--paragraph-font)",
                        color: "#000000",
                      }}
                    >
                      {(() => {
                        const rating = product.rating ?? 0;
                        const intPart = Math.floor(rating);
                        const fracPart =
                          rating % 1 === 0
                            ? ""
                            : rating.toFixed(1).split(".")[1];

                        // 🔥 КРАСНЫЙ если rating < 3.5
                        const isLowRating = rating < 3.5;

                        return (
                          <>
                            <span
                              style={{
                                color: isLowRating ? "#F11010" : "#000000",
                              }}
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

                  {/* Цена */}
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

                        // Форматируем полное число с запятой и 2 знаками после
                        const formattedPrice = price.toLocaleString("ru-RU", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });

                        // Разделяем на целую и дробную части
                        const [integerPart, decimalPart] =
                          formattedPrice.split(",");

                        return (
                          <>
                            <span className="text-black">{integerPart}</span>
                            <span className="text-gray-500">
                              ,{decimalPart}
                            </span>{" "}
                          </>
                        );
                      })()}
                    </span>
                  </td>
                  {/* Действия */}
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
                  <td>
                    <div></div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Товары не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-6 px-3 py-4 border-t">
            <PaginationInfo total={total} page={page} perPage={perPage} />
            <PaginationControls
              total={total}
              page={page}
              perPage={perPage}
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
            />
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <AuthLayout
          title="Добавить товар"
          subtitle="Заполните основные поля товара"
          error={""}
          linkText=""
          linkActionText=""
          linkTo=""
          divider={false}
        >
          <form onSubmit={handleSubmit} className="w-full space-y-0">
            {/* 🔥 Наименование (в стиле Логин) */}
            <div className="mb-[16px]">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#6B7280",
                }}
                className="mb-2 font-medium"
              >
                Наименование
              </h4>
              <InputField
                name="name"
                type="text"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Введите название товара"
                iconSrc="/icons/tag.svg"
                showClear={newProduct.name.length > 0}
                onClear={() => setNewProduct((prev) => ({ ...prev, name: "" }))}
                disabled={false}
              />
            </div>

            {/* 🔥 Вендор */}
            <div className="mb-[16px]">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#6B7280",
                }}
                className="mb-2 font-medium"
              >
                Вендор
              </h4>
              <InputField
                name="vendor"
                type="text"
                value={newProduct.vendor}
                onChange={handleInputChange}
                placeholder="Введите вендора"
                iconSrc="/icons/factory.svg"
                showClear={newProduct.vendor.length > 0}
                onClear={() =>
                  setNewProduct((prev) => ({ ...prev, vendor: "" }))
                }
                disabled={false}
              />
            </div>

            {/* 🔥 Артикул */}
            <div className="mb-[16px]">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#6B7280",
                }}
                className="mb-2 font-medium"
              >
                Артикул
              </h4>
              <InputField
                name="article"
                type="text"
                value={newProduct.article}
                onChange={handleInputChange}
                placeholder="Введите артикул"
                iconSrc="/icons/qr-code.svg"
                showClear={newProduct.article.length > 0}
                onClear={() =>
                  setNewProduct((prev) => ({ ...prev, article: "" }))
                }
                disabled={false}
              />
            </div>

            {/* 🔥 ЦЕНА (вместо количества) */}
            <div className="mb-[20px]">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#6B7280",
                }}
                className="mb-2 font-medium"
              >
                Цена, ₽
              </h4>
              <InputField
                name="price"
                type="text"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="0.00"
                iconSrc="/icons/ruble.svg"
                showClear={newProduct.price.length > 0}
                onClear={() =>
                  setNewProduct((prev) => ({ ...prev, price: "" }))
                }
                disabled={false}
              />
            </div>

            {/* 🔥 Кнопка */}
            <Button type="submit">Добавить товар</Button>
          </form>
        </AuthLayout>
      )}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 border-green-600 flex items-center space-x-3 max-w-sm">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Товар успешно добавлен!</span>
          </div>
        </div>
      )}
    </div>
  );
}
