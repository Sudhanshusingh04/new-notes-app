
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

function Verifyemail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/user/verify/${encodeURIComponent(token)}`
        );

        if (response.redirected && response.ok) {
          window.location.href = response.url;
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          setMessage(errorText || "Email verification failed.");
          return;
        }

        setMessage("Email verified successfully!");
        navigate("/login");
      } catch (error) {
        setMessage("Unable to connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Email Verification
        </h1>

        <p className="text-slate-600">{message}</p>

        {loading && (
          <p className="mt-3 text-sm text-blue-600">
            Please wait...
          </p>
        )}

        {!loading && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Verifyemail;
