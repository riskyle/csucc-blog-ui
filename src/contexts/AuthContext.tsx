import React from "react";
import axios from "../api/axios";

export const AuthContext = React.createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [user, setUser] = React.useState<any>(null);
  const [errors, setErrors] = React.useState([]);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const login = async (data: any) => {
    await csrf();
    setErrors([]);

    try {
      setLoading(true);
      await axios.post("/login", data);
      await getUser();
    } catch (e: any) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    await csrf();
    setErrors([]);

    try {
      setLoading(true);
      await axios.post("/register", data);
      await getUser();
    } catch (e: any) {
      if (e.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate: any) => {
    try {
      await axios.post("/logout");
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  const checkIfAuthenticated = (navigate: any) => {
    if (!user) {
      navigate("/login");
    }
  };

  const checkIfAdmin = (navigate: any) => {
    if (user.role !== "admin") {
      navigate("/");
    }
  }

  const getUser = async () => {
    try {
      const res = await axios.get("/api/user");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      setUser(null);
    }
  };

  React.useEffect(() => {
    getUser();
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        errors,
        setErrors,
        successMsg,
        setSuccessMsg,
        loading,
        login,
        register,
        logout,
        getUser,
        checkIfAuthenticated,
        checkIfAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};
