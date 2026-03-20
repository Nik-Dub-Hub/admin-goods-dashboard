import React, { useState} from "react";
import AuthLayout from "../../../shared/ui/AuthLayout";
import InputField from "../../../shared/ui/InputField";
import Button from "../../../shared/ui/Button";


interface NewProduct {
  name: string;
  vendor: string;
  article: string;
  price: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void; 
  onProductSubmit: (product: NewProduct) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductSubmit,
}) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    vendor: "",
    article: "",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name as keyof NewProduct]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Новый товар:", newProduct);
    onProductSubmit(newProduct);
  };

  const handleCloseClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <AuthLayout
        title="Добавить товар"
        subtitle="Заполните основные поля товара"
        error={""}
        linkText=""
        linkActionText=""
        linkTo=""
        divider={false}
        
      >
        <button
          onClick={handleCloseClick}
          className="fixed top-9 right-9 z-[1000] w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="w-full space-y-0">
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
              onClear={() => setNewProduct((prev) => ({ ...prev, vendor: "" }))}
              disabled={false}
            />
          </div>

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
              onClear={() => setNewProduct((prev) => ({ ...prev, price: "" }))}
              disabled={false}
            />
          </div>

          <Button type="submit">Добавить товар</Button>
        </form>
      </AuthLayout>
    </>
  );
};