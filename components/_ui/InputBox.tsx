import { cn } from "@/utils/cn.util";
import React from "react";

interface InputBoxProps
    extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    className?: string;
    variant?: "input" | "textarea";
    rows?: number;
}

const InputBox: React.FC<InputBoxProps> = ({
    label,
    className = "",
    variant = "input",
    rows,
    ...props
}) => {
    const baseClass = cn(
        "flex h-9 w-full rounded-[6px] border-[0.5px] border-[#E5E5E5] bg-[#F2F2F2] px-3 py-1 text-base shadow-sm transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variant === "textarea" && "resize-vertical",
        className
    )

    return (
        <div className="w-full">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}

            {variant === "textarea" ? (
                <textarea
                    className={baseClass}
                    rows={rows}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input
                    className={baseClass}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}
        </div>
    );
};

export default InputBox;
