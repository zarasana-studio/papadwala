"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ArrowRight,
  KeyRound,
  Lock,
} from "lucide-react";
import { Link } from "next-view-transitions";
import {
  getFromSessionStorage,
  isValidEmail,
  normalizeEmail,
  setInSessionStorage,
} from "@/lib/helpers";

type AuthMode = "signin" | "signup";
type OtpStep = "email" | "verify";
type TabType = "otp" | "password";

type OtpFormValues = {
  email: string;
  otp: string;
};

type PasswordFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "signup";

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("otp");

  useEffect(() => {
    const savedTab = getFromSessionStorage<TabType | "">("auth-tab-preference");
    if (savedTab === "otp" || savedTab === "password") {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setInSessionStorage("auth-tab-preference", tab);
  };

  // Social loading states
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP state
  const [otpStep, setOtpStep] = useState<OtpStep>("email");

  // Password UI state
  const [pwShowPassword, setPwShowPassword] = useState(false);

  const otpForm = useForm<OtpFormValues>({
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onSubmit",
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
    mode: "onSubmit",
    shouldUnregister: true,
  });

  const otpEmail = otpForm.watch("email") || "";
  const otpCode = otpForm.watch("otp") || "";

  const otpErrorMessage =
    otpForm.formState.errors.root?.message ||
    otpForm.formState.errors.email?.message ||
    otpForm.formState.errors.otp?.message;

  const passwordErrorMessage =
    passwordForm.formState.errors.root?.message ||
    passwordForm.formState.errors.name?.message ||
    passwordForm.formState.errors.email?.message ||
    passwordForm.formState.errors.password?.message ||
    passwordForm.formState.errors.confirm?.message;

  // ── Social ──────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email OTP ────────────────────────────────────────────────────────────
  const handleSendOtp = async (values: OtpFormValues) => {
    otpForm.clearErrors();
    const email = normalizeEmail(values.email);
    otpForm.setValue("email", email, { shouldValidate: true });

    if (!isValidEmail(email)) {
      otpForm.setError("email", {
        type: "validate",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      otpForm.setError("root", {
        type: "server",
        message: error.message ?? "Failed to send code. Try again.",
      });
    } else {
      setOtpStep("verify");
      otpForm.clearErrors();
    }
  };

  const handleVerifyOtp = async (values: OtpFormValues) => {
    otpForm.clearErrors();
    const email = normalizeEmail(values.email);
    otpForm.setValue("email", email, { shouldValidate: true });

    if (!isValidEmail(email)) {
      otpForm.setError("email", {
        type: "validate",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!values.otp || values.otp.length !== 6) {
      otpForm.setError("otp", {
        type: "validate",
        message: "Please enter a valid 6-digit code.",
      });
      return;
    }

    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: values.otp,
    });

    if (error) {
      otpForm.setError("root", {
        type: "server",
        message: error.message ?? "Invalid code. Please try again.",
      });
    } else {
      router.push("/");
    }
  };

  // ── Email + Password ────────────────────────────────────────────────────
  const handlePassword = async (values: PasswordFormValues) => {
    passwordForm.clearErrors();
    const email = normalizeEmail(values.email);
    passwordForm.setValue("email", email, { shouldValidate: true });

    if (!isValidEmail(email)) {
      passwordForm.setError("email", {
        type: "validate",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (isSignUp && values.password !== values.confirm) {
      passwordForm.setError("confirm", {
        type: "validate",
        message: "Passwords do not match.",
      });
      return;
    }

    if (isSignUp) {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email,
        password: values.password,
        callbackURL: "/",
      });

      if (error) {
        passwordForm.setError("root", {
          type: "server",
          message: error.message ?? "Sign up failed. Try again.",
        });
      } else {
        router.push("/");
      }
    } else {
      const { error } = await authClient.signIn.email({
        email,
        password: values.password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (error) {
        passwordForm.setError("root", {
          type: "server",
          message: error.message ?? "Invalid credentials. Try again.",
        });
      } else {
        router.push("/");
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="auth-card"
        layoutId="auth-card"
        style={{ viewTransitionName: "auth-card" }}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-2xl shadow-orange-100 sm:p-10"
      >
        {/* Header */}
        <motion.div layout="position" className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-2xl font-serif font-extrabold text-white shadow-lg shadow-brand-primary/20">
            P
          </div>
          <h1 className="font-serif text-2xl font-semibold text-brand-dark">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp
              ? "Join thousands enjoying the finest handcrafted papads."
              : "Sign in to track orders and manage your preferences."}
          </p>
        </motion.div>

        {/* Tab Selector - decoupled from shadcn Tabs for smoother layouts */}
        <motion.div
          layout="position"
          className="mb-6 grid h-10 w-full grid-cols-2 gap-1 rounded-xl bg-orange-50 p-1"
        >
          <button
            type="button"
            onClick={() => handleTabChange("otp")}
            className={`rounded-lg text-xs font-medium transition-all ${
              activeTab === "otp"
                ? "bg-brand-primary text-white shadow"
                : "text-brand-dark/70 hover:text-brand-dark hover:bg-orange-100/50"
            }`}
          >
            Email OTP
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("password")}
            className={`rounded-lg text-xs font-medium transition-all ${
              activeTab === "password"
                ? "bg-brand-primary text-white shadow"
                : "text-brand-dark/70 hover:text-brand-dark hover:bg-orange-100/50"
            }`}
          >
            Password
          </button>
        </motion.div>

        {/* Form Content wrapped in popLayout */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeTab}
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.96 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0 }}
              className="h-full w-full"
            >
              {/* ── OTP Tab ──────────────────────────────────────────────────── */}
              {activeTab === "otp" && (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {otpStep === "email" ? (
                      <motion.form
                        key="otp-email-form"
                        layout="position"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={otpForm.handleSubmit(handleSendOtp)}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="otp-email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="otp-email"
                              type="email"
                              required
                              placeholder="you@example.com"
                              {...otpForm.register("email", {
                                required: "Email address is required.",
                                setValueAs: (value) =>
                                  typeof value === "string"
                                    ? normalizeEmail(value)
                                    : value,
                              })}
                              className="h-11 pl-9 rounded-xl border-gray-200 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                            />
                          </div>
                        </div>

                        {otpErrorMessage && (
                          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                            {otpErrorMessage}
                          </p>
                        )}

                        <Button
                          id="otp-send-btn"
                          type="submit"
                          disabled={otpForm.formState.isSubmitting}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-60"
                        >
                          {otpForm.formState.isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Send code <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp-verify-form"
                        layout="position"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
                        className="space-y-4"
                      >
                        <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3 text-sm text-brand-dark">
                          Code sent to{" "}
                          <span className="font-semibold">{otpEmail}</span>.{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setOtpStep("email");
                              otpForm.setValue("otp", "");
                              otpForm.clearErrors();
                            }}
                            className="text-brand-primary underline underline-offset-2"
                          >
                            Change
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="otp-code"
                            className="text-sm font-medium text-gray-700"
                          >
                            6-digit code
                          </Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="otp-code"
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              required
                              placeholder="••••••"
                              {...otpForm.register("otp", {
                                required: "Please enter the 6-digit code.",
                                validate: (value) =>
                                  /^[0-9]{6}$/.test(value || "") ||
                                  "Please enter a valid 6-digit code.",
                                setValueAs: (value) =>
                                  typeof value === "string"
                                    ? value.replace(/\D/g, "").slice(0, 6)
                                    : value,
                              })}
                              className="h-11 pl-9 rounded-xl border-gray-200 tracking-[0.3em] text-center text-lg font-mono focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                            />
                          </div>
                        </div>

                        {otpErrorMessage && (
                          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                            {otpErrorMessage}
                          </p>
                        )}

                        <Button
                          id="otp-verify-btn"
                          type="submit"
                          disabled={
                            otpForm.formState.isSubmitting || otpCode.length < 6
                          }
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-[0.98] disabled:opacity-60"
                        >
                          {otpForm.formState.isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Verify & {isSignUp ? "Create account" : "Sign in"}
                            </>
                          )}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Password Tab ──────────────────────────────────────────────── */}
              {activeTab === "password" && (
                <form
                  onSubmit={passwordForm.handleSubmit(handlePassword)}
                  className="relative max-h-full space-y-4 overflow-y-auto pr-1 py-4 [--form-fade:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)] mask-(--form-fade) [-webkit-mask-image:var(--form-fade)] scrollbar-subtle"
                >
                  <AnimatePresence mode="popLayout">
                    {isSignUp && (
                      <motion.div
                        key="pw-name-field"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginBottom: 24,
                        }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5 overflow-hidden"
                      >
                        <Label
                          htmlFor="pw-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full name
                        </Label>
                        <Input
                          id="pw-name"
                          type="text"
                          required
                          placeholder="Your name"
                          {...passwordForm.register("name", {
                            validate: (value) =>
                              !isSignUp ||
                              value.trim().length > 0 ||
                              "Full name is required.",
                            setValueAs: (value) =>
                              typeof value === "string" ? value.trim() : value,
                          })}
                          className="h-11 rounded-xl border-gray-200 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="pw-email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pw-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        {...passwordForm.register("email", {
                          required: "Email address is required.",
                          setValueAs: (value) =>
                            typeof value === "string"
                              ? normalizeEmail(value)
                              : value,
                        })}
                        className="h-11 pl-9 rounded-xl border-gray-200 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="pw-password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      {!isSignUp && (
                        <Link
                          href="/forgot-password"
                          className="text-xs text-brand-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pw-password"
                        type={pwShowPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="Min. 8 characters"
                        {...passwordForm.register("password", {
                          required: "Password is required.",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters.",
                          },
                        })}
                        className="h-11 pl-9 pr-10 rounded-xl border-gray-200 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setPwShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700 transition-colors"
                      >
                        {pwShowPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {isSignUp && (
                      <motion.div
                        key="pw-confirm-field"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5 overflow-hidden"
                      >
                        <Label
                          htmlFor="pw-confirm"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pw-confirm"
                            type={pwShowPassword ? "text" : "password"}
                            required
                            minLength={8}
                            placeholder="Repeat your password"
                            {...passwordForm.register("confirm", {
                              validate: (value) =>
                                !isSignUp ||
                                value === passwordForm.getValues("password") ||
                                "Passwords do not match.",
                            })}
                            className="h-11 pl-9 rounded-xl border-gray-200 focus-visible:ring-brand-primary/30 focus-visible:border-brand-primary"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {passwordErrorMessage && (
                    <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-4">
                      {passwordErrorMessage}
                    </p>
                  )}

                  <div className="pt-2">
                    <Button
                      id="pw-submit-btn"
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-dark text-sm font-semibold text-white transition-all hover:bg-brand-primary active:scale-[0.98] disabled:opacity-60"
                    >
                      {passwordForm.formState.isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isSignUp ? (
                        "Create account"
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 py-1">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              or continue with
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            id="auth-google-btn"
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FaGoogle className="h-4 w-4 text-[#4285F4]" />
            )}
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-brand-primary"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-brand-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Switch mode link */}
        <motion.p
          layout="position"
          className="mt-7 text-center text-xs text-muted-foreground"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={isSignUp ? "login-link" : "signup-link"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-brand-primary hover:underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-brand-primary hover:underline underline-offset-2"
                  >
                    Create one
                  </Link>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
