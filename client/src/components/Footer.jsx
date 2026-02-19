const links = ["Features", "Pricing", "Reviews", "FAQ"];

const Footer = () => (
    <footer className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 blur-[120px] animate-pulse-glow" />
        </div>

        <div className="mx-auto">

            <div className="glass-card rounded-2xl p-10 md:p-14">

                <div className="flex flex-col md:flex-row justify-between gap-12">

                    {/* Brand */}
                    <div className="max-w-sm">
                        <h3 className="text-xl font-bold gradient-text">
                            InvoiceFlow
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            The modern billing platform that helps businesses invoice faster,
                            track smarter, and get paid sooner.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-sm mb-5">
                            Quick Links
                        </h4>

                        <ul className="space-y-3">
                            {links.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-14 pt-6 border-t border-border text-center text-xs text-muted-foreground">
                    © 2026 InvoiceFlow. All rights reserved.
                </div>

            </div>
        </div>
    </footer>
);

export default Footer;
