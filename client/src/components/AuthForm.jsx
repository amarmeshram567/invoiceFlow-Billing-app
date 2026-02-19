import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Check, Loader2, Eye, EyeOff } from "lucide-react";
import confetti from "canvas-confetti";
import FloatingInput from "../components/FloatingInput";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import PasswordStrength from "./PasswordStrength";


const AuthForm = () => {

    const { setUser } = useAppContext()

    const navigate = useNavigate()


    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        setErrors({});
        setSuccess(false);
    }, [mode]);

    const validate = () => {
        const newErrors = {};

        if (mode === "signup" && !name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "At least 6 characters";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const endpoint =
                mode === "signup"
                    ? "/api/auth/signup"
                    : "/api/auth/login";

            const payload =
                mode === "signup"
                    ? { name, email, password }
                    : { email, password };

            const { data } = await api.post(endpoint, payload);

            if (data.success) {

                if (rememberMe) {
                    localStorage.setItem("token", data.token);
                } else {
                    sessionStorage.setItem("token", data.token);
                }
                setUser(data.user)
            }

            setSuccess(true);

            if (mode === "signup") {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#d97706", "#f59e0b", "#fbbf24"],
                });
                toast.success("Account created successfully! 🎉");
            } else {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#d97706", "#f59e0b", "#fbbf24"],
                });
                toast.success("Welcome back!");
            }

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };


    const formVariants = {
        hidden: { opacity: 0, x: mode === "login" ? -30 : 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            x: mode === "login" ? 30 : -30,
            transition: { duration: 0.3 },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center h-full px-6 sm:px-10 py-10">
            {/* Mobile header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    ✦ InvoiceFlow
                </h2>
                <p className="text-muted-foreground text-sm">
                    Run your business smarter
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md glass-card p-8 glow-effect-hover transition-shadow duration-500 ${shake ? "animate-shake" : ""
                    }`}
            >
                {/* Tabs */}
                <div className="relative flex mb-8 bg-muted/50 rounded-xl p-1">
                    {["login", "signup"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setMode(tab)}
                            className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 z-10 ${mode === tab
                                ? "text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab === "login" ? "Sign In" : "Sign Up"}
                        </button>
                    ))}

                    <motion.div
                        className="absolute top-1 bottom-1 bg-primary rounded-lg"
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                            width: "calc(50% - 4px)",
                            left: mode === "login" ? 4 : "calc(50% + 0px)",
                        }}
                    />
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                    <motion.form
                        key={mode}
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="space-y-4">
                            {mode === "signup" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <FloatingInput
                                        id="name"
                                        label="Full Name"
                                        icon={User}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        error={errors.name}
                                    />
                                </motion.div>
                            )}

                            <FloatingInput
                                id="email"
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                            />

                            <div className="relative">
                                <FloatingInput
                                    id="password"
                                    label="Password"
                                    icon={Lock}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {mode === "signup" && (
                                <PasswordStrength password={password} />
                            )}
                        </div>

                        {/* Remember me */}
                        {mode === "login" && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setRememberMe(!rememberMe)}
                                        className={`w-4 h-4 rounded border flex items-center justify-center ${rememberMe
                                            ? "bg-primary border-primary"
                                            : "border-border"
                                            }`}
                                    >
                                        {rememberMe && (
                                            <Check className="w-3 h-3 text-primary-foreground" />
                                        )}
                                    </div>
                                    Remember me
                                </label>
                            </div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${success
                                ? "bg-success text-success-foreground"
                                : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : success ? (
                                <Check className="w-5 h-5" />
                            ) : mode === "login" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>

                        {/* divider */}
                        {/* <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">or continue with</span>
                            <div className="flex-1 h-px bg-border" />
                        </div> */}

                        {/* Social buttons */}
                        {/* <div className="flex gap-3">
                            {["Google", "GitHub"].map((provider) => (
                                <motion.button
                                    key={provider}
                                    type="button"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 py-3 rounded-xl border border-border bg-muted/30 text-sm font-medium text-foreground hover:bg-muted/60 transition-all duration-300"
                                >
                                    {provider}
                                </motion.button>
                            ))}
                        </div> */}

                    </motion.form>
                </AnimatePresence>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="text-primary hover:text-accent transition-colors font-medium"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </motion.div>

            <p className="text-xs text-muted-foreground mt-5 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
};

export default AuthForm;
