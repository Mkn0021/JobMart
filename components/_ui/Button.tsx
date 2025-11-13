import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn.util";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = ({
    children,
    className,
    variant = "primary",
    ...props
}: ButtonProps) => {
    const { href, ...rest } = props;
    const combinedClasses = cn(
        "px-4 py-2 text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center justify-center rounded-[6px] ",
        "hover:-translate-y-1 active:scale-95",
        variant === "primary"
            ? "bg-[linear-gradient(181deg,_#5E5E5E_18.12%,_#000_99.57%)] shadow-secondary text-white"
            : "text-black bg-white rounded-[6px] border border-[#E5E5E5]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        className
    );

    if (href) {
        return (
            <Link
                href={href}
                className={combinedClasses}
                {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClasses}
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
};
