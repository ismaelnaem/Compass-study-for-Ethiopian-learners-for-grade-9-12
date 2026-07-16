import { useState } from "react";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import {
  auth, googleProvider, signInWithPopup, signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../lib/firebase";
import { Language } from "../translations";

interface LoginProps {
  language: Language;
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
}

// Standard, unsurprising login layout (Jakob's Law: users spend most of
// their time on other apps, so this should look like every login screen
// they already know how to use — no novelty for novelty's sake here).
export default function Login({ language, onLoginSuccess, onNavigateToSignUp }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const text = {
    title:
      language === "Amharic" ? "እንኳን ደህና መጡ" : language === "Oromo" ? "Baga Nagaan Dhuftan" : "Welcome back",
    subtitle:
      language === "Amharic"
        ? "ወደ መለያዎ ይግቡ"
        : language === "Oromo"
          ? "Herrega keessanitti seenaa"
          : "Log in to your account",
    emailLabel: language === "Amharic" ? "ኢሜይል" : language === "Oromo" ? "Iimeelii" : "Email address",
    passwordLabel: language === "Amharic" ? "የይለፍ ቃል" : language === "Oromo" ? "Jecha Iccitii" : "Password",
    loginButton: language === "Amharic" ? "ይግቡ" : language === "Oromo" ? "Seeni" : "Login",
    googleButton:
      language === "Amharic" ? "በጉግል (Google) ይቀጥሉ" : language === "Oromo" ? "Google dhaan itti fufi" : "Continue with Google",
    signUpButton: language === "Amharic" ? "መለያ ይፍጠሩ" : language === "Oromo" ? "Herrega Uumi" : "Create an account",
    forgotPassword:
      language === "Amharic" ? "የይለፍ ቃል ረሱ?" : language === "Oromo" ? "Jecha iccitii dagattee?" : "Forgot password?",
    resetSentMsg:
      language === "Amharic"
        ? "የመልሶ ማግኛ ኢሜይል ተልኳል። ገቢ መልእክትዎን ያረጋግጡ።"
        : language === "Oromo"
          ? "Iimeelii deebisanii argachuu ergameera. Saanduqa ergaa keessan ilaalaa."
          : "Reset email sent. Check your inbox.",
    genericError:
      language === "Amharic"
        ? "የሆነ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።"
        : language === "Oromo"
          ? "Wanti dogoggoraa uumameera. Maaloo irra deebi'ii yaali."
          : "Something went wrong. Please try again.",
    missingEmailForReset:
      language === "Amharic"
        ? "የይለፍ ቃል ለመቀየር መጀመሪያ ኢሜይልዎን ያስገቡ።"
        : language === "Oromo"
          ? "Jecha iccitii jijjiiruuf dura iimeelii kee galchi."
          : "Enter your email above first, then tap Forgot password.",
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setLoading("email");
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(text.genericError);
    }
    setLoading(null);
  };

  const handleGoogleLogin = async () => {
    setLoading("google");
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err: any) {
      setError(text.genericError);
    }
    setLoading(null);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(text.missingEmailForReset);
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError(text.genericError);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-[var(--color-bg-elevated)] rounded-3xl border border-[var(--color-border-subtle)] p-7 shadow-2xl">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{text.title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{text.subtitle}</p>
        </div>

        {/* Email */}
        <label className="block mb-4">
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 block">
            {text.emailLabel}
          </span>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 text-sm"
              autoComplete="email"
            />
          </div>
        </label>

        {/* Password */}
        <label className="block mb-1.5">
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5 block">
            {text.passwordLabel}
          </span>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 text-sm"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        {error && <p className="text-rose-400 text-xs mb-2">{error}</p>}
        {resetSent && <p className="text-emerald-400 text-xs mb-2">{text.resetSentMsg}</p>}

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold mb-5"
        >
          {text.forgotPassword}
        </button>

        {/* Primary action — Login. Most visually prominent element on the screen. */}
        <button
          onClick={handleEmailLogin}
          disabled={loading !== null || !email || !password}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold tracking-wide text-sm flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-[0.98]"
        >
          {loading === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : text.loginButton}
        </button>

        {/* Secondary action #1 — Google, right below Login per the locked spec */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading !== null}
          className="w-full mt-3 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition duration-200 disabled:opacity-50"
        >
          {loading === "google" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon />
              {text.googleButton}
            </>
          )}
        </button>

        {/* Secondary action #2 — Sign Up, outlined per the locked spec */}
        <button
          onClick={onNavigateToSignUp}
          className="w-full mt-3 py-3.5 bg-transparent border border-slate-700 hover:border-violet-500 text-[var(--color-text-primary)] rounded-2xl font-bold text-sm transition duration-200"
        >
          {text.signUpButton}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.48a5.54 5.54 0 01-2.4 3.63v3h3.87c2.27-2.09 3.57-5.17 3.57-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0012 24z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 014.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 000 12c0 1.94.46 3.77 1.27 5.38l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}
