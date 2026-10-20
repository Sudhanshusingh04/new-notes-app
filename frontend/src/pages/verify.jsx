
import React from "react";
import { MailCheck, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

function Verify() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-10">

        {/* Email Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <MailCheck className="h-10 w-10 text-blue-600" />
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          Check your email
        </h1>

        {/* Description */}
        <p className="mb-6 text-sm leading-6 text-slate-600">
          We've sent you an email with a verification link.
          Please check your inbox and click the link to verify
          your email address and complete your signup.
        </p>

        {/* Info Box */}
        <div className="mb-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <p className="text-sm leading-5 text-blue-800">
            Didn't receive the email? Check your spam or junk
            folder. Make sure you entered the correct email address.
          </p>
        </div>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-400">
          Secure account verification
        </p>
      </div>
    </div>
  );
}

export default Verify;