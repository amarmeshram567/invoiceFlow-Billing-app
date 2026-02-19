import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    { q: "How does the free trial work?", a: "You get 14 days of full access to all Pro features. No credit card required. Cancel anytime." },
    { q: "Can I upgrade or downgrade my plan?", a: "Absolutely. You can switch plans at any time and we'll prorate the difference automatically." },
    { q: "Is my data secure?", a: "Yes. We use AES-256 encryption, SSL certificates, and are fully GDPR compliant. Your data is safe with us." },
    { q: "Do you support multiple currencies?", a: "We support over 150 currencies with automatic exchange rate updates for international invoicing." },
    { q: "Can I integrate with my accounting software?", a: "Yes, we integrate with QuickBooks, Xero, FreshBooks, and more. Custom API access is available on Premium." },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden">

            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
            </div>

            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold text-center"
                >
                    Got Questions?{" "}
                    <span className="gradient-text">We've Got Answers</span>
                </motion.h2>

                {/* FAQ List */}
                <div className="mt-16 space-y-6">
                    {faqs.map((faq, i) => {
                        const isOpen = openIndex === i;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card glow-effect-hover transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-sm md:text-base">
                                        {faq.q}
                                    </span>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 text-primary ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
