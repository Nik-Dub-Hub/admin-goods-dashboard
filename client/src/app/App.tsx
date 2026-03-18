import "../app/App.css";
import UserApi from "../entities/user/UserApi";
import Router from "./router/router";
import { useState, useEffect } from "react";
import type { User } from "../entities/user/types";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log("App: initAuth start");

      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (token) {
          console.log("App: token found IMMEDIATE /products");

          try {
            const userData = await UserApi.getMe(token);
            setUser(userData);
          } catch (error) {
            void error;
            console.error("App: getMe failed, but token valid");
          }
        }
      } catch (error) {
        void error;
        console.error("App: fatal error");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, []);

  if (initializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        Проверка...
      </div>
    );
  }

  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  return <Router user={user} setUser={setUser} token={token} />;
}

export default App;
