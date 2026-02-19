import { motion } from "framer-motion";
import { FileText, ScanLine, BarChart3 } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Invoice Creation",
        description:
            "Generate professional invoices in seconds with customizable templates and automatic calculations.",
    },
    {
        icon: ScanLine,
        title: "OCR Receipt Scanning",
        description:
            "Snap a photo of any receipt and let AI extract the data instantly — no manual entry needed.",
    },
    {
        icon: BarChart3,
        title: "Expense Dashboard",
        description:
            "Visualize spending patterns, track budgets, and get real-time insights into your cash flow.",
    },
];

const FeaturesSection = () => (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-secondary/50 overflow-hidden">

        {/* Soft Glow Background */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto text-center">

            {/* Section Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
            >
                Smart Tools to Manage Your{" "}
                <span className="gradient-text">Invoices</span>
            </motion.h2>

            {/* Feature Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">

                {features.map(({ icon: Icon, title, description }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="glass-card p-8 text-center transition-all duration-300 hover:scale-105 glow-effect-hover"
                    >
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                            <Icon size={28} />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground">
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                ))}

            </div>
        </div>
    </section>
);

export default FeaturesSection;
