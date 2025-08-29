import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const getUser = async () => {
    try {
      const res = await axios.get("/api/user");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: any) => {
    await csrf();
    setErrors([]);

    try {
      await axios.post("/login", data);
      await getUser();
      setLoggingIn(true);
    } catch (e: any) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        throw e;
      }
    }
  };

  const register = async (data: any) => {
    await csrf();
    setErrors([]);

    try {
      await axios.post("/register", data);
      await getUser();
    } catch (e: any) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        throw e;
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
    } finally {
      setUser(null);
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        errors,
        setErrors,
        successMsg,
        setSuccessMsg,
        loggingIn,
        loading,
        login,
        register,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
