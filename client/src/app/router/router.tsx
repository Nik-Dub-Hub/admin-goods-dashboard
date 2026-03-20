import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import SignUpForm from "../../features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "../../features/auth/ui/SignInForm/SignInForm";
import ProductsPage from "../../pages/ProductsPage/ProductsPage";

function RouterContent() {
  const { token } = useAppSelector((state) => state.auth);
  const hasToken = !!token;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={hasToken ? "/products" : "/login"} replace />}
      />

      <Route
        path="/login"
        element={
          !hasToken ? <SignInForm /> : <Navigate to="/products" replace />
        }
      />

      <Route path="/reg" element={<SignUpForm />} />

      <Route
        path="/products"
        element={hasToken ? <ProductsPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to={hasToken ? "/products" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}
