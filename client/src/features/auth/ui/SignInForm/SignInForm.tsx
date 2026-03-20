import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../app/store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../../app/store/slices/authSlice";
import UserApi from "../../../../entities/user/UserApi";
import InputField from "../../../../shared/ui/InputField";
import Button from "../../../../shared/ui/Button";
import AuthLayout from "../../../../shared/ui/AuthLayout";
import { validateSignIn } from "../../../../shared/lib/validationAuth";

interface SignInInputs {
  username: string;
  password: string;
}

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState<SignInInputs>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(savedRememberMe);
  }, []);

  useEffect(() => {
    const autoLoginData = sessionStorage.getItem("autoLogin");
    if (autoLoginData) {
      try {
        const { username, password } = JSON.parse(autoLoginData);
        setInputs({ username, password });
        sessionStorage.removeItem("autoLogin");
      } catch (e) {
        void e
        console.log("Автологин данные некорректны");
      }
    }
  }, []);

  const handleClearAll = () => {
    setInputs({ username: "", password: "" });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setError("");
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (checked) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  };

  const hasAnyInput = inputs.username.length > 0 || inputs.password.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validation = validateSignIn(inputs);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] as string;
      setError(firstError);
      setLoading(false);
      return;
    }

    setError("");

    try {
      dispatch(loginStart());
      const user = await UserApi.signIn(inputs);

      if (rememberMe && user.accessToken) {
        localStorage.setItem("accessToken", user.accessToken);
        sessionStorage.removeItem("accessToken");
      } else if (user.accessToken) {
        localStorage.removeItem("accessToken");
        sessionStorage.setItem("accessToken", user.accessToken);
      }

      dispatch(loginSuccess({ user, token: user.accessToken! }));
      navigate("/products");
    } catch (error: any) {
      console.error("Login error:", error);
      dispatch(loginFailure("Неверный логин или пароль"));
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Добро пожаловать!"
      subtitle="Пожалуйста, авторизируйтесь"
      error={error}
      linkText="Нет аккаунта?"
      linkActionText="Создать"
      linkTo="/reg"
    >
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
            Логин
          </h4>
          <InputField
            name="username"
            type="text"
            value={inputs.username}
            onChange={handleChange}
            placeholder="Введите логин"
            iconSrc="/icons/user-icon.svg"
            showClear={hasAnyInput}
            onClear={handleClearAll}
            disabled={loading}
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
            Пароль
          </h4>
          <InputField
            name="password"
            type={showPassword ? "text" : "password"}
            value={inputs.password}
            onChange={handleChange}
            placeholder="••••••••"
            iconSrc="/icons/lock-03.svg"
            showPasswordToggle={true}
            onPasswordToggle={handlePasswordToggle}
            hasPassword={inputs.password.length > 0}
            disabled={loading}
          />
        </div>
        <label className="flex items-center space-x-3 cursor-pointer group mb-[20px]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-[#3B82F6] bg-white border-2 border-[#D1D5DB] rounded focus:ring-[#3B82F6] focus:ring-2 focus:border-[#3B82F6] transition-all duration-200 hover:border-[#3B82F6]/50 group-hover:border-[#3B82F6]/30"
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              color: "#6B7280",
            }}
            className="select-none cursor-pointer hover:text-gray-800 transition-colors"
          >
            Запомнить данные
          </span>
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </Button>
      </form>
    </AuthLayout>
  );
}
