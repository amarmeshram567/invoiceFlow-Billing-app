import { motion } from "framer-motion";

const CTASection = () => (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 blur-[140px] animate-pulse-glow" />
        </div>

        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl px-8 py-16 md:px-16 md:py-20 text-center glow-effect-hover duration-300"
            >
                {/* Heading */}
                <h2 className="text-2xl md:text-3xl font-bold">
                    Be the First to{" "}
                    <span className="gradient-text">Bill Smarter</span>
                </h2>

                {/* Subtext */}
                <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                    Join thousands of businesses already saving time and money with InvoiceFlow.
                </p>

                {/* Email Form */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />

                    <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all whitespace-nowrap">
                        Join Waitlist
                    </button>

                </div>

            </motion.div>
        </div>
    </section>
);

export default CTASection;
