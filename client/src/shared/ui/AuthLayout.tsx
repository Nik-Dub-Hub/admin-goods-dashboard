import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  error?: string;
  linkText: string;
  linkActionText: string;
  linkTo: string;
  divider?: boolean;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  error,
  linkText,
  linkActionText,
  linkTo,
  divider = true,
}: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="w-[515px] h-[704px] bg-white bg-gradient-to-b from-slate-50 via-white to-slate-10 rounded-[32px] p-8 flex flex-col items-center pt-12 shadow-2xl max-w-full max-h-full border-6 border-white">
        <div className="w-[399px] flex flex-col items-center">
          <div className="w-[62px] h-[52px] mb-4 mt-2 flex items-center justify-center">
            <img
              src="/Frame 1.svg"
              alt="Frame Icon"
              className="w-[82px] h-[82px] object-contain drop-shadow-sm"
            />
          </div>

          <h2
            style={{
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 600,
              fontSize: "36px",
              lineHeight: "42px",
              letterSpacing: "-0.02em",
              color: "#1F1F1F",
            }}
            className="mb-3 leading-tight w-full text-center"
          >
            {title}
          </h2>
          <h4
            style={{
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 350,
              fontSize: "16px",
              lineHeight: "20px",
              color: "#E0E0E0",
              textShadow: "0 0 1px rgba(0,0,0,0.15)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              fontOpticalSizing: "auto",
              fontVariationSettings: '"opsz" 16, "wght" 350',
              letterSpacing: "-0.015em",
            }}
            className="leading-tight mb-[32px] w-full text-center"
          >
            {subtitle}
          </h4>

          {children}
          {divider && (
            <div className="w-full h-6 flex items-center justify-center mb-[32px]">
              <div className="flex-1 h-px bg-gray-300 mx-2 opacity-50"></div>{" "}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#9CA3AF",
                }}
                className="px-2 whitespace-nowrap flex-shrink-0 z-10 bg-white"
              >
                или
              </span>
              <div className="flex-1 h-px bg-gray-300 mx-2 opacity-50"></div>{" "}
            </div>
          )}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: "#9CA3AF",
            }}
            className="text-center text-sm leading-relaxed w-full"
          >
            {linkText}{" "}
            <Link
              to={linkTo}
              style={{
                fontWeight: 500,
                color: "#242EDB",
              }}
              className="hover:text-[#2563EB] font-medium transition-colors duration-200 hover:underline"
            >
              {linkActionText}
            </Link>
          </p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </div>
    </div>
  );
}
