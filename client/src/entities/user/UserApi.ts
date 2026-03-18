export default class UserApi {
  static async signUp(userData: {
    username: string;
    email: string;
    password: string;
  }) {
   
    console.log(" Mock регистрация:", userData);

    const mockResponse = {
      message: "Аккаунт успешно создан!",
      loginHint: `Для входа используйте: логин "emilys" пароль "emilyspass"`,
    };
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockResponse;
  }

  static async signIn(credentials: { username: string; password: string }) {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Ошибка входа");
    return response.json();
  }
  static async getMe(token: string) {
    return fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, 
    }).then((res) => {
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    });
  }
}