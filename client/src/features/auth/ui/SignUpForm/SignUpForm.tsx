import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import UserApi from "../../../../entities/user/UserApi";
import InputField from "../../../../shared/ui/InputField";
import Button from "../../../../shared/ui/Button";
import AuthLayout from "../../../../shared/ui/AuthLayout";
import { validateSignUpEmailPassword } from "../../../../shared/lib/validationAuth";

interface SignUpInputs {
  username: string;
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [inputs, setInputs] = useState<SignUpInputs>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(savedRememberMe);
  }, []);

  const handleClearAll = () => {
    setInputs({ username: "", email: "", password: "" });
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
    localStorage.setItem("rememberMe", checked.toString());
  };

  const hasAnyInput =
    inputs.username.length > 0 ||
    inputs.email.length > 0 ||
    inputs.password.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const validation = validateSignUpEmailPassword({
      email: inputs.email,
      password: inputs.password,
    });

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0] as string;
      setError(firstError);
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await UserApi.signUp(inputs); 
      setError(`${response.loginHint}`);

      setTimeout(() => {
        sessionStorage.setItem(
          "autoLogin",
          JSON.stringify({
            username: "emilys",
            password: "emilyspass",
          }),
        );
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("SignUp error:", error);
      setError("Ошибка регистрации. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Заполните данные для регистрации"
      error={error}
      linkText="Уже есть аккаунт?"
      linkActionText="Войти"
      linkTo="/login"
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
            Email
          </h4>
          <InputField
            name="email"
            type="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="example@mail.com"
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
          {loading ? "Создаем..." : "Зарегистрироваться"}
        </Button>
      </form>
    </AuthLayout>
  );
}
