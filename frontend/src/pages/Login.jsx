
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      // Replace this URL with your actual backend login endpoint.
      const response = await fetch(
        "http://localhost:8000/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess(true);
      setMessage(data.message || "Login successful!");

      // Adjust the token field to match your backend response.
      if (data.accessToken) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("accessToken", data.accessToken);
      }

      // Change "/" if your dashboard uses another route.
      navigate("/");
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.message || "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/90 text-white shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">

          <CardHeader className="space-y-4 px-6 pb-5 pt-8 sm:px-8">

        

            <div className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                Welcome Back
              </CardTitle>

              <CardDescription className="text-sm text-slate-400">
                Sign in to continue to your account
              </CardDescription>
            </div>

          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={`h-12 rounded-xl border-slate-700 bg-slate-800/70 pl-10 text-white placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={`h-12 rounded-xl border-slate-700 bg-slate-800/70 pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me: native HTML checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-indigo-600"
                />

                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal text-slate-400"
                >
                  Remember me
                </Label>
              </div>

              {/* Success or error message */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border px-3 py-3 text-sm ${
                    success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Login button */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

            </form>

            {/* Signup link */}
            <div className="mt-7 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-slate-500">
          Secure login · Your account, your space
        </p>
      </div>
    </main>
  );
}

export default Login;
