import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpForm from "../../features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "../../features/auth/ui/SignInForm/SignInForm";
import ProductsPage from "../../pages/ProductsPage/ProductsPage";
import type { User } from "../../entities/user/types";

interface RouterProps {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
}

export default function Router({ user, setUser, token }: RouterProps) {
  const isAuthenticated = !!token;

  console.log("🔍 Router: token:", !!token, "user:", !!user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <SignInForm setUser={setUser} />
            ) : (
              <Navigate to="/products" replace />
            )
          }
        />

        <Route path="/reg" element={<SignUpForm />} />

        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <ProductsPage user={user} token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
