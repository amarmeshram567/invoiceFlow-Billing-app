import { motion } from "framer-motion";

const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};

const labels = ["Weak", "Fair", "Good", "Strong"];
const colors = [
    "bg-destructive",
    "bg-primary/60",
    "bg-primary",
    "bg-success",
];

const PasswordStrength = ({ password }) => {
    if (!password) return null;
    const strength = getStrength(password);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-1.5"
        >
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < strength ? colors[strength - 1] : "bg-muted"
                            }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.1 }}
                    />
                ))}
            </div>

            <p
                className={`text-xs ${strength <= 1
                    ? "text-destructive"
                    : strength <= 2
                        ? "text-primary"
                        : "text-success"
                    }`}
            >
                {labels[strength - 1] || "Too short"}
            </p>
        </motion.div>
    );
};

export default PasswordStrength;
