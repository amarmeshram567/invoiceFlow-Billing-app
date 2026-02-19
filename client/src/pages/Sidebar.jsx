import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    CreditCard,
    BarChart3,
    Receipt,
    Sun,
    Moon,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Customers", url: "/customers", icon: Users },
    { title: "Products", url: "/products", icon: Package },
    { title: "Invoices", url: "/invoices", icon: FileText },
    { title: "Payments", url: "/payments", icon: CreditCard },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings }
];

export function Sidebar() {

    const navigate = useNavigate()

    const { user, business, fetchBusiness } = useAppContext()

    //console.log("User in Sidebar:", user.name.slice(0, 1).toUpperCase()); // Debugging line

    console.log("Business in Sidebar:", business); // Debugging line

    const location = useLocation();
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );
    const [collapsed, setCollapsed] = useState(false)
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [])



    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'light') {
            root.classList.add("light");
        }
        else {
            root.classList.remove("light")
        }

        localStorage.setItem("theme", theme)
    }, [theme])



    useEffect(() => {
        fetchBusiness()
    }, [])


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/")
        toast.success("Logged out successfully")
    }



    return (
        <motion.aside
            animate={{ width: collapsed ? 64 : 256 }}
            transition={{ duration: 0.3 }}
            className={`
            ${collapsed ? 'w-16' : 'w-64'} 
            min-h-screen bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center"
                    >
                        <Receipt className="w-5 h-5 text-primary" />
                    </motion.div>

                    {!collapsed && (
                        <div>
                            <h1 className="text-lg font-bold gradient-text tracking-tight">
                                InvoiceFlow
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Invoice & Billing
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)
                    const Icon = item.icon;


                    return (
                        <Link key={item.url} to={item.url}>
                            <motion.div
                                whileHover={!collapsed ? { x: 4 } : {}}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center gap-3  rounded-lg text-sm font-medium transition-colors
                                    ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}
                                 ${isActive
                                        ? "text-primary font-semibold bg-muted dark:bg-muted/40"
                                        : "text-foreground/80 hover:bg-muted dark:hover:bg-muted/40"
                                    }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 rounded-lg bg-sidebar-accent/80 pointer-events-none"
                                        transition={{
                                            type: "spring",
                                            stiffness: 380,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                <Icon className={`z-10 transition-transform ${collapsed ? "w-5 h-5 scale-110" : "w-4.5 h-4.5"}`} />
                                {!collapsed && (
                                    <span className="z-10">{item.title}</span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>


            <div className="p-4 border-t border-sidebar-border">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`w-full flex items-center rounded-lg transition-colors
            ${collapsed
                            ? "justify-center p-2 hover:bg-accent/40"
                            : "gap-3 px-3 py-2 bg-secondary hover:bg-accent/50"
                        }`}
                >
                    {theme === "dark" ? (
                        <Sun
                            className={`text-primary transition-transform
                    ${collapsed ? "w-5 h-5 scale-110" : "w-4 h-4"}`}
                        />
                    ) : (
                        <Moon
                            className={`text-primary transition-transform
                    ${collapsed ? "w-5 h-5 scale-110" : "w-4 h-4"}`}
                        />
                    )}

                    {!collapsed && (
                        <span className="text-sm font-medium">
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                    )}
                </button>
            </div>


            <div className="p-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center p-2 text-sm justify-center text-foreground/80 hover:bg-muted dark:hover:bg-muted/40 rounded-lg"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-5 w-5" />}
                    {!collapsed && <span className="ml-2">Collapse</span>}
                </button>
            </div>

            <div className="p-4 border-t border-sidebar-border relative">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center rounded-lg transition-colors hover:bg-sidebar-accent
            ${collapsed
                            ? "justify-center p-2"
                            : "gap-3 px-3 py-2"
                        }`}
                >


                    <div
                        onClick={() => setOpen(!open)}
                        className={`rounded-full overflow-hidden bg-secondary flex items-center justify-center
                            cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 duration-300
                            ${collapsed ? "w-9 h-9" : "w-8 h-8"} sm:w-12 sm:h-12 md:w-12 md:h-12
                            lg:w-13 lg:h-13
                        `}
                    >
                        {business?.logo_url ? (
                            <img
                                src={business.logo_url}
                                alt="Business Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                                {business?.business_name?.slice(0, 1)?.toUpperCase() ||
                                    user?.name?.slice(0, 1)?.toUpperCase()}
                            </span>
                        )}
                    </div>


                    {open && (
                        <div
                            ref={dropdownRef}
                            className="absolute bottom-full left-0 mb-2 w-52
               bg-card border border-border
               rounded-lg shadow-lg z-50"
                        >
                            <div className="px-4 py-3 border-b border-border">
                                <p className="font-semibold truncate capitalize">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}



                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

        </motion.aside>
    );
}
