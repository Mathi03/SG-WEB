import { ComponentProps, useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useNavigate } from "react-router-dom";
import banner from "@assets/banner.jpg";
import logo from "@assets/logoV2.png";
import { cn } from "@lib/utils";
import { useRequest } from "ahooks";
import AuthController from "@infrastructure/controllers/AuthController";
import { setHeader } from "@application/common/Globals";
import { useDispatch } from "react-redux";
import { login } from "@application/slices/authSlice";
import ClipLoader from "react-spinners/ClipLoader";

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { run: runLogin, loading } = useRequest(
    () => AuthController.login({ email, password }),
    {
      manual: true,
      onSuccess: (response) => {
        sessionStorage.setItem("accessToken", response?.token ?? "");
        sessionStorage.setItem("userInfo", JSON.stringify(response?.user));

        setHeader(`Bearer ${response?.token}`);
        dispatch(
          login({
            isAuthenticated: true,
            user: response!.user!,
            token: response?.token,
          })
        );
        navigate("/dashboard", {
          replace: true,
        });
      },
      onError: () => {
        setErrorMessage("Credenciales inválidas, por favor intente de nuevo.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runLogin();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-6 py-12 pmd:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={logo}
                  alt="Image"
                  className="inset-0 h-[100px] w-[180px] object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {loading ? (
                <div className="bg-[#0f2135] flex items-center justify-center w-full h-full h-[36px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm px-4 py-2">
                  <ClipLoader color="#fff" loading={true} size={25} />
                </div>
              ) : (
                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              )}

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  O continuar con
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Login with Google</span>
              </Button>
              {errorMessage && (
                <span className="block sm:inline text-[12px] text-red-500 font-semibold">
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={banner}
              alt="Image"
              className="bg-[#014177] absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
