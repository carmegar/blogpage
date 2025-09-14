interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text,
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg
          className="h-full w-full text-blue-600 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {text}
        </span>
      )}
    </div>
  );
}

export function LoadingButton({
  children,
  loading,
  ...props
}: {
  children: React.ReactNode;
  loading: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${props.className} ${loading ? "cursor-not-allowed opacity-75" : ""}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <Loading size="sm" />}
        <span>{children}</span>
      </div>
    </button>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </div>
  );
}
