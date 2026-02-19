import { motion } from "framer-motion";
import { Users, FileBarChart, Palette } from "lucide-react";

const addOns = [
    { icon: Users, title: "Extra Users", desc: "Add team members at $3/user/month" },
    { icon: FileBarChart, title: "Advanced Reporting", desc: "Detailed financial reports and forecasts" },
    { icon: Palette, title: "Custom Branding", desc: "White-label invoices with your brand" },
];

const AddOnsSection = () => (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-background overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center"
            >

                {/* Left Content */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Power Up with{" "}
                        <span className="gradient-text">Add-Ons</span>
                    </h2>

                    <p className="mt-4 text-muted-foreground max-w-md">
                        Customize your plan with optional extras to match your workflow
                        and scale your business effortlessly.
                    </p>

                    <ul className="mt-10 space-y-8">
                        {addOns.map(({ icon: Icon, title, desc }) => (
                            <li key={title} className="flex gap-5 items-start group">

                                {/* Icon */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                    <Icon size={22} />
                                </div>

                                {/* Text */}
                                <div>
                                    <h4 className="font-semibold text-foreground">
                                        {title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {desc}
                                    </p>
                                </div>

                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Decorative Element */}
                <div className="hidden md:flex justify-center relative">
                    <div className="w-72 h-72 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl animate-blob opacity-70" />
                </div>

            </motion.div>

        </div>
    </section>
);

export default AddOnsSection;
