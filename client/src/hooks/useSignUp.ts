import React from "react";
import api from "../lib/api";
import { LoginResponse } from "../types";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      await api.post<LoginResponse>("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/signin"); // Rediriger vers la page de connexion après l'inscription réussie
    } catch (err: Error | any) {
      const message = err.response?.data?.message || "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useSignUp;
