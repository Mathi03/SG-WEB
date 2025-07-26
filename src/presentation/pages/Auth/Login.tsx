import { useSelector } from "react-redux";
import { LoginForm } from "./components/LoginForm";
import { RootState } from "@application/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/calendar", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 w-full">
      <div className="w-[800px]">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
