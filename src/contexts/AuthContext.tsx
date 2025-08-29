import { createContext, useContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [loggingIn, setLogginIn] = useState(false);

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const login = async ({ ...data }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/login", data)
      .then((res) => {
        let user = res.data.user;

        localStorage.setItem("u_token", res.data.token);
        setLogginIn(true);
      })
      .catch((e) => {
        if (e.response.status !== 422) throw e;
        setErrors(e.response.data.errors);
      })
  };

  const register = async ({ ...data }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/register", data)
      .then((res) => {
        let user = res.data.user;
        console.log(user);
      })
      .catch((e) => {
        if (e.response.status !== 422) throw e;
        setErrors(e.response.data.errors);
      })
  };

  const logout = () => {
    axios.post("/logout").catch((e) => {
      if (e?.response?.status) throw e;
    });

    localStorage.removeItem("u_token");
  };

  const token = localStorage.getItem("u_token");

  return (
    <AuthContext.Provider
      value={{
        loggingIn,
        token,
        errors,
        setErrors,
        successMsg,
        setSuccessMsg,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};