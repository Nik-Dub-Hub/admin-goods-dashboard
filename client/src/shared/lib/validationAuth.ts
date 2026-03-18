export const validateSignIn = (data: {
  username: string;
  password: string;
}) => {
  const hasEmptyFields = !data.username.trim() || !data.password.trim();
  if (hasEmptyFields) {
    return {
      isValid: false,
      errors: { general: "Не все поля заполнены" },
    };
  }

  const errors: Record<string, string> = {};

  if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username = "Только латиница, цифры, спецсимволы";
  }

  if (data.password.length < 6) {
    errors.password = "Минимум 6 символов";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignUpEmailPassword = (data: {
  email: string;
  password: string;
}) => {
  const hasEmptyFields = !data.email.trim() || !data.password.trim();
  if (hasEmptyFields) {
    return {
      isValid: false,
      errors: { general: "Не все поля заполнены" },
    };
  }

  const errors: Record<string, string> = {};

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
    errors.email = "Неверный email";
  }

  if (data.password.length < 6) {
    errors.password = "Минимум 6 символов";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
