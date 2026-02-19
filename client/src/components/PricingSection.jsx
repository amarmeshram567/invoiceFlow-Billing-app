import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Basic",
        price: "$8",
        description: "For freelancers just getting started",
        features: ["50 invoices/month", "Basic templates", "Email support", "1 user"],
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$15",
        description: "For growing teams and businesses",
        features: [
            "Unlimited invoices",
            "OCR scanning",
            "Priority support",
            "5 users",
            "Expense tracking",
        ],
        highlighted: true,
    },
    {
        name: "Premium",
        price: "$25",
        description: "For enterprises that need it all",
        features: [
            "Everything in Pro",
            "Custom branding",
            "API access",
            "Unlimited users",
            "Advanced analytics",
            "Dedicated manager",
        ],
        highlighted: false,
    },
];

const PricingSection = () => (
    <section className="relative py-28 px-6 md:px-12 lg:px-20 bg-background overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[140px] animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto text-center">

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
            >
                Track More.{" "}
                <span className="gradient-text">Earn More.</span>
            </motion.h2>

            {/* Pricing Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-8 items-stretch">

                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${plan.highlighted
                            ? "glass-card border-2 border-primary shadow-2xl glow-effect-hover"
                            : "glass-card"
                            }`}
                    >

                        {/* Most Popular Badge */}
                        {plan.highlighted && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                Most Popular
                            </span>
                        )}

                        {/* Plan Name */}
                        <h3 className="text-lg font-bold text-foreground">
                            {plan.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm mt-2 text-muted-foreground">
                            {plan.description}
                        </p>

                        {/* Price */}
                        <div className="mt-6 mb-8">
                            <span className="text-4xl font-extrabold text-foreground">
                                {plan.price}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                /month
                            </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 flex-1">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check size={16} className="text-primary" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <button
                            className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted
                                ? "bg-primary text-primary-foreground hover:scale-105 glow-effect-hover"
                                : "bg-secondary text-foreground hover:bg-secondary/70"
                                }`}
                        >
                            Get Started
                        </button>

                    </motion.div>
                ))}

            </div>
        </div>
    </section>
);

export default PricingSection;
