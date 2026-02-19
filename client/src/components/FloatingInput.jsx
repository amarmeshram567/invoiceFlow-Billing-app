import { useState, useRef } from "react";
import { motion } from "framer-motion";

const FloatingInput = ({ label, icon: Icon, error, id, ...props }) => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const hasValue = props.value && String(props.value).length > 0;

    return (
        <div className="relative">
            <div
                className={`relative flex items-center rounded-xl border transition-all duration-300 ${error
                    ? "border-destructive"
                    : focused
                        ? "border-primary glow-effect"
                        : "border-border hover:border-muted-foreground/30"
                    } bg-muted/30`}
            >
                <Icon
                    className={`ml-4 w-5 h-5 transition-colors duration-300 ${focused ? "text-primary" : "text-muted-foreground"
                        }`}
                />

                <input
                    ref={inputRef}
                    id={id}
                    {...props}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    className="peer w-full bg-transparent px-3 py-4 text-foreground placeholder-transparent outline-none text-sm"
                    placeholder={label}
                />

                <label
                    htmlFor={id}
                    onClick={() => inputRef.current && inputRef.current.focus()}
                    className={`absolute left-11 transition-all duration-300 pointer-events-none ${focused || hasValue
                        ? "text-xs -translate-y-3 text-primary"
                        : "text-sm text-muted-foreground translate-y-0"
                        }`}
                >
                    {label}
                </label>
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-xs mt-1.5 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default FloatingInput;
