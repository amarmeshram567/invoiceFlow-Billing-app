import { motion } from "framer-motion";

const testimonials = [
    { name: "Sarah Chen", role: "CFO at Nextera", quote: "InvoiceFlow cut our billing cycle from days to minutes. Absolute game-changer." },
    { name: "Marcus Johnson", role: "Freelance Designer", quote: "The OCR scanning is incredibly accurate. I just snap receipts and everything's done." },
    { name: "Emily Rodriguez", role: "Startup Founder", quote: "We switched from three different tools. InvoiceFlow does it all in one place." },
    { name: "David Kim", role: "Accountant", quote: "The expense dashboard gives me insights I never had before. My clients love the reports." },
    { name: "Lisa Wang", role: "E-commerce Owner", quote: "Recurring invoices saved me hours every week. Best investment for my business." },
    { name: "James Taylor", role: "Agency Director", quote: "Professional, fast, and reliable. Our clients always comment on how clean our invoices look." },
];

const TestimonialsSection = () => (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-secondary/50 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto text-center">

            {/* Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
            >
                What Our{" "}
                <span className="gradient-text">Customers</span>{" "}
                Are Saying
            </motion.h2>

            {/* Testimonial Grid */}
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {testimonials.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card p-6 text-left transition-all duration-300 hover:scale-105 glow-effect-hover"
                    >
                        {/* Quote */}
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            "{t.quote}"
                        </p>

                        {/* User Info */}
                        <div className="mt-6 flex items-center gap-4">

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                {t.name.charAt(0)}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {t.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t.role}
                                </p>
                            </div>

                        </div>

                    </motion.div>
                ))}

            </div>
        </div>
    </section>
);

export default TestimonialsSection;
