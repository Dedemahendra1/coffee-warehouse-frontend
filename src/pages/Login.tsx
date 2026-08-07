import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useRoleRedirect } from "../hooks/useRoleRedirect";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useRoleRedirect(); // 🔄 redirect handled by hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex flex-1 h-screen items-center">
      <div className="flex flex-col h-screen overflow-hidden rounded-tr-[32px] w-[685px] shrink-0 blue-gradient">
        <div className="px-[40px] pt-[46px]">
          <p className="font-semibold text-lg text-monday-lime-green-char">
            — Senopati Coffee &middot; Inventory & Distribution System
          </p>

          <p className="font-extrabold text-[42px] leading-tight uppercase text-white mt-4">
            Smarter Inventory,
            <br />
            Better Coffee Operations
          </p>
        </div>

        <div className="flex-1 mt-8 overflow-hidden rounded-tl-[28px]">
          <img
            src="/assets/images/backgrounds/bg-cafe2.jpg"
            className="w-full h-full object-cover"
            alt="Coffee Warehouse"
          />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-[435px] shrink-0 rounded-3xl gap-10 p-6 bg-white"
        >
          
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-3 text-center">
              <p className="font-semibold text-2xl">Hey🙌🏻, Welcome Back!</p>
              <p className="font-medium text-monday-gray">
                Login to your account to continue!
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="group relative">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/sms-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your email address
                </p>
                <input
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder=""
                />
              </label>
              <label className="group relative">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/lock-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Your password
                </p>
                <input
                  id="passwordInput"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-16 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300 tracking-[0.3em]"
                  placeholder=""
                />
                <button
                  id="togglePassword"
                  type="button"
                  className="absolute transform -translate-y-1/2 top-1/2 right-6"
                >
                  <img
                    src="/assets/images/icons/eye-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </button>
              </label>
              <p className="font-medium text-sm text-monday-gray">
                Forget Password?{" "}
                <a
                  href="#"
                  className="font-semibold text-monday-blue hover:underline"
                >
                  Reset Password
                </a>
              </p>
            </div>
            <button type="submit" className="btn btn-primary w-full font-bold">
              Sign In
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
