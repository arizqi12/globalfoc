import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(`❌ Login gagal: ${error.message}`);
    } else {
      // Login sukses, lempar ke /admin
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md w-full max-w-sm space-y-4"
      >
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-xs text-slate-500 mt-1">
            GlobalFoc Management Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@globalfoc.com"
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs disabled:opacity-50"
        >
          {loading ? "Verifikasi..." : "Masuk Dashboard"}
        </button>
      </form>
    </div>
  );
}
