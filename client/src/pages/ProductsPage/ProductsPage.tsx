import type { User } from "../../entities/user/types"; 

interface ProductsPageProps {
  user: User | null;
  token: string | null; 
}

export default function ProductsPage({ user, token }: ProductsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Товары</h1>
        <p>
          Привет, {user?.email}! Токен: {token ? "✓" : "✗"}
        </p>
      </div>
    </div>
  );
}
