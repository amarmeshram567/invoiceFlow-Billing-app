import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const headlines = [
    "Create invoices in seconds",
    "Track payments effortlessly",
    "Grow your business smarter",
    "Manage clients with ease",
];

const ExperiencePanel = () => {
    const [currentHeadline, setCurrentHeadline] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeadline((prev) => (prev + 1) % headlines.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
    }, []);

    return (
        <div
            className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden bg-gradient-to-br from-background via-secondary to-background animate-gradient-shift p-10"
            onMouseMove={handleMouseMove}
        >
            {/* Animated blobs */}
            <motion.div
                className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob animate-pulse-glow"
                style={{
                    x: mousePosition.x * 30,
                    y: mousePosition.y * 30,
                }}
            />

            <motion.div
                className="absolute bottom-32 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-blob animate-pulse-glow"
                style={{
                    x: mousePosition.x * -20,
                    y: mousePosition.y * -20,
                    animationDelay: "2s",
                }}
            />

            <motion.div
                className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float"
                style={{
                    x: mousePosition.x * 15,
                    y: mousePosition.y * 15,
                }}
            />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
            >
                <motion.h2
                    className="text-2xl font-bold gradient-text cursor-pointer"
                    whileHover={{ scale: 1.05, filter: "brightness(1.3)" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => navigate("/")}
                >
                    ✦ InvoiceFlow
                </motion.h2>
            </motion.div>

            {/* Center content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
                {/* Dashboard mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="glass-card p-6 mb-10 glow-effect"
                    style={{
                        transform: `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${mousePosition.y * -3}deg)`,
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-destructive/80" />
                        <div className="w-3 h-3 rounded-full bg-primary/80" />
                        <div className="w-3 h-3 rounded-full bg-success/80" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="h-3 w-24 bg-muted rounded-full" />
                            <div className="h-3 w-16 bg-primary/30 rounded-full" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-3 w-32 bg-muted rounded-full" />
                            <div className="h-3 w-20 bg-success/30 rounded-full" />
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="h-3 w-20 bg-muted rounded-full" />
                            <div className="h-3 w-14 bg-accent/30 rounded-full" />
                        </div>

                        <div className="h-20 bg-muted/50 rounded-lg mt-4 flex items-end gap-1 p-2">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-primary/60 rounded-t"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Rotating headline */}
                <div className="h-20">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={currentHeadline}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight"
                        >
                            {headlines[currentHeadline]}
                        </motion.h1>
                    </AnimatePresence>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-muted-foreground text-lg mt-4 max-w-md leading-relaxed"
                >
                    Create invoices, manage customers, and track payments — all from one
                    powerful dashboard.
                </motion.p>
            </div>

            {/* Bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="relative z-10 flex items-center gap-2 text-muted-foreground text-sm"
            >
                <div className="flex -space-x-2">
                    {["JD", "AK", "MR"].map((name, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium text-secondary-foreground"
                        >
                            {name}
                        </div>
                    ))}
                </div>
                <span className="ml-2">Trusted by 10,000+ businesses</span>
            </motion.div>
        </div>
    );
};

export default ExperiencePanel;
