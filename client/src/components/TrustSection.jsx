import { motion } from "framer-motion";
import { ShieldCheck, Lock, Globe, CreditCard, Cloud } from "lucide-react";

const items = [
    { icon: ShieldCheck, label: "SSL Secured" },
    { icon: Lock, label: "Encrypted Data" },
    { icon: Globe, label: "GDPR Compliant" },
    { icon: CreditCard, label: "Secure Payments" },
    { icon: Cloud, label: "Reliable Cloud" },
];

const TrustSection = () => (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-background overflow-hidden">

        {/* Soft Glow Background */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="max-w-6xl mx-auto text-center">

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
            >
                Secure, Trusted, and Built for{" "}
                <span className="gradient-text">Modern Businesses</span>
            </motion.h2>

            {/* Trust Items */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8"
            >
                {items.map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="glass-card p-6 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300 glow-effect-hover"
                    >
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon size={24} />
                        </div>

                        <span className="text-sm text-muted-foreground font-medium">
                            {label}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    </section>
);

export default TrustSection;
