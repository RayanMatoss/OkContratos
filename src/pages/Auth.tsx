import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o login com seleção de município
    navigate("/login", { replace: true });
  }, [navigate]);

  return <Login />;
};

export default Auth;