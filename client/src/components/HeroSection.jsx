import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroDashboard from "../assets/hero-dashboard.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

    const navigate = useNavigate()

    return (
        <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-background">

            {/* Glow Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/20 to-accent/20 blur-[120px] animate-pulse-glow" />
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                        Cut Your Billing Time in Minutes with{" "}
                        <span className="gradient-text animate-gradient-shift">
                            InvoiceFlow
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                        Automate invoicing, track payments, and manage expenses — all in one
                        smart platform designed for modern businesses.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        {/* Primary Button */}
                        <button onClick={() => navigate("/login")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 glow-effect-hover">
                            Start Free Trial
                            <ArrowRight size={18} />
                        </button>

                        {/* Outline Button */}
                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/60 backdrop-blur-xl font-medium hover:bg-secondary transition-all duration-300">
                            <Play size={16} />
                            Watch Demo
                        </button>

                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative"
                >
                    <div className="glass-card p-4 animate-float glow-effect-hover duration-300">
                        <img
                            src={heroDashboard}
                            alt="InvoiceFlow dashboard preview"
                            className="rounded-xl w-full"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default HeroSection;
