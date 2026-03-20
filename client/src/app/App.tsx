import { useEffect } from "react";
import Router from "./router/router";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loginSuccess } from "./store/slices/authSlice";
import UserApi from "../entities/user/UserApi";

function App() {
  const dispatch = useAppDispatch();
  const { loading: authLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (token) {
          try {
            const userData = await UserApi.getMe(token);
            dispatch(loginSuccess({ user: userData, token }));
          } catch (error) {
            void error;
            console.error("App: getMe failed, clearing token");
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
          }
        }
      } catch (error) {
        void error;
        console.error("App: fatal error");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
      }
    };

    initAuth();
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        Проверка...
      </div>
    );
  }

  return <Router />;
}

export default App;
