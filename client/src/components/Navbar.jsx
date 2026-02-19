import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// const navLinks = ["Home", "Features", "Pricing", "Reviews", "FAQ"];

const navLinks = [
    { label: "Home", id: "home" },
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "Reviews", id: "reviews" },
    { label: "FAQ", id: "faq" },
];


const Navbar = () => {
    const [active, setActive] = useState("Home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate()

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        setActive(id);
    };


    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4">
            <nav className="glass-card max-w-6xl mx-auto flex items-center justify-between px-6 py-3">

                {/* Logo */}
                <a href="/" className="text-xl cursor-pointer font-bold gradient-text">
                    InvoiceFlow
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {/* {navLinks.map((link) => (
                        <button
                            key={link}
                            onClick={() => setActive(link)}
                            className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link}

                            {active === link && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    ))} */}
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleScroll(link.id)}
                            className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}

                            {active === link.id && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}


                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">

                    {/* Ghost Button */}
                    <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300">
                        Login
                    </button>

                    {/* Primary Button */}
                    <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 glow-effect-hover">
                        Get Started
                    </button>

                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card max-w-6xl mx-auto mt-2 p-4 md:hidden flex flex-col gap-2"
                >
                    {/* {navLinks.map((link) => (
                        <button
                            key={link}
                            onClick={() => {
                                setActive(link);
                                setMobileOpen(false);
                            }}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg text-left transition-colors"
                        >
                            {link}
                        </button>
                    ))} */}

                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => {
                                handleScroll(link.id);
                                setMobileOpen(false);
                            }}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg text-left transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}


                    <div className="flex gap-2 mt-2">
                        <button onClick={() => navigate("/login")} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300">
                            Login
                        </button>

                        <button onClick={() => navigate("/login")} className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 glow-effect-hover">
                            Get Started
                        </button>
                    </div>
                </motion.div>
            )}
        </header>
    );
};

export default Navbar;
