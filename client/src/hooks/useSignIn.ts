import React from "react";
import api from "../lib/api";
import useAuthStore from "../store/authStore";
import  {LoginResponse}  from "../types";

const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
        
      const res = await api.post<LoginResponse>("/auth/login", { username, password });
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);

    } catch (err: Error | any) {
      const message = err.response?.data?.message || "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useSignIn;
