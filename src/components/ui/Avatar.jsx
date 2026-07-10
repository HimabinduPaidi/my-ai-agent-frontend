import { User } from "lucide-react";
import { useState } from "react";

export default function Avatar({
  src,
  alt = "",
  size = "md",
  showStatus = false,
  className = "",
}) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-9 h-9 rounded-lg",
    lg: "w-10 h-10 rounded-xl",
  };

  const iconSizes = { sm: 14, md: 15, lg: 18 };

  return (
    <div className={`relative shrink-0 ${className}`}>
      {!src || error ? (
        <div
          className={`${sizes[size]} bg-background border border-border flex items-center justify-center`}
        >
          <User size={iconSizes[size]} className="text-text-muted" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className={`${sizes[size]} object-cover border border-border`}
        />
      )}
      {showStatus && (
        <span
          className="absolute -bottom-px -right-px w-2 h-2 bg-success rounded-full border-2 border-surface block"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
