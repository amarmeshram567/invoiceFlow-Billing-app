// import React from "react";

// const variantStyles = {
//     default: "bg-card",
//     primary: "bg-card border-l-4 border-l-primary",
//     success: "bg-card border-l-4 border-l-success",
//     warning: "bg-card border-l-4 border-l-accent",
//     destructive: "bg-card border-l-4 border-l-destructive",
// };

// const iconVariantStyles = {
//     default: "bg-muted text-muted-foreground",
//     primary: "bg-primary/10 text-primary",
//     success: "bg-success/10 text-success",
//     warning: "bg-accent/10 text-accent",
//     destructive: "bg-destructive/10 text-destructive",
// };

// export function StatCard({
//     title,
//     value,
//     subtitle,
//     icon: Icon,
//     trend,
//     variant = "default",
// }) {
//     return (
//         <div
//             className={`${variantStyles[variant]} rounded-xl border p-5 shadow-card transition-shadow hover:shadow-card-hover`}
//         >
//             <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                     <p className="text-sm font-medium text-muted-foreground">
//                         {title}
//                     </p>

//                     <p className="text-2xl font-bold tracking-tight text-card-foreground">
//                         {value}
//                     </p>

//                     {subtitle && (
//                         <p className="text-xs text-muted-foreground">
//                             {subtitle}
//                         </p>
//                     )}

//                     {trend && (
//                         <p
//                             className={`text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"
//                                 }`}
//                         >
//                             {trend.positive ? "↑" : "↓"} {trend.value}
//                         </p>
//                     )}
//                 </div>

//                 <div className={`p-2.5 rounded-lg ${iconVariantStyles[variant]}`}>
//                     <Icon className="w-5 h-5" />
//                 </div>
//             </div>
//         </div>
//     );
// }



import React from "react";
import { motion } from "framer-motion";

const variantStyles = {
    default: "bg-card",
    primary: "bg-card border-l-4 border-l-primary",
    success: "bg-card border-l-4 border-l-success",
    warning: "bg-card border-l-4 border-l-accent",
    destructive: "bg-card border-l-4 border-l-destructive",
};

const iconVariantStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-accent/10 text-accent",
    destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = "default",
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className={`${variantStyles[variant]} rounded-xl border p-5 shadow-card transition-shadow hover:shadow-card-hover`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <p className="text-2xl font-bold tracking-tight text-card-foreground">
                        {value}
                    </p>

                    {subtitle && (
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}

                    {trend && typeof trend.value !== "undefined" && (
                        <p
                            className={`text-xs font-medium flex items-center gap-1 ${trend.positive ? "text-success" : "text-destructive"
                                }`}
                        >
                            <span>{trend.positive ? "↑" : "↓"}</span>
                            <span>{trend.value}</span>
                        </p>
                    )}
                </div>

                <div className={`p-2.5 rounded-lg ${iconVariantStyles[variant]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}
