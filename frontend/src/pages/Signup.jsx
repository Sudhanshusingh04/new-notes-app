
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username =
        "Username must contain at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:8000/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Signup failed. Please try again."
        );
      }

      setSuccess(true);
      setMessage(
        data.message || "Account created successfully!"
      );

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/verify");
      }, 1000);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-6">

      {/* Background glow effects */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Signup card */}
      <div className="relative z-10 w-full max-w-sm">
        <Card className="w-full overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/90 text-white shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">

          <CardHeader className="space-y-1 px-6 pb-3 pt-6">
            <CardTitle className="text-center text-3xl font-bold tracking-tight text-white">
              Sign Up
            </CardTitle>

            <CardDescription className="text-center text-sm text-slate-400">
              Create your account to get started
            </CardDescription>

            <div className="pt-1 text-center">
              <h2 className="text-lg font-semibold text-slate-100">
                Create your account
              </h2>

              <p className="mt-0.5 text-sm text-slate-400">
                Enter your details below to sign up.
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSignup} className="space-y-4">

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-300">
                  Username
                </Label>

                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    className={`h-11 rounded-xl border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {errors.username && (
                  <p className="text-xs text-red-400">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300">
                  Email address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={`h-11 rounded-xl border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 ${
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
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`h-11 rounded-xl border-slate-700 bg-slate-800/80 pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {/* Success or error message */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Signup button */}
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Login link */}
            <p className="mt-5 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
              >
                Login
              </button>
            </p>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
