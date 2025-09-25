import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const alertVariants = cva(
  "relative w-full rounded-xl border p-6 shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        success: 
          "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-950 dark:to-emerald-950 dark:border-green-800 dark:text-green-200",
        warning: 
          "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-800 dark:from-amber-950 dark:to-orange-950 dark:border-amber-800 dark:text-amber-200",
        error: 
          "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 dark:from-red-950 dark:to-rose-950 dark:border-red-800 dark:text-red-200",
        info: 
          "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 text-blue-800 dark:from-blue-950 dark:to-sky-950 dark:border-blue-800 dark:text-blue-200",
        brand: 
          "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-800 dark:from-orange-950 dark:to-red-950 dark:border-orange-800 dark:text-orange-200",
      },
      size: {
        sm: "p-4 text-sm",
        md: "p-6 text-base",
        lg: "p-8 text-lg",
      }
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

const iconVariants = cva(
  "flex-shrink-0 rounded-full p-2",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200",
        warning: "bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-200",
        error: "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200",
        info: "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200",
        brand: "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-200",
      }
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

interface WoodinnAlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const getDefaultIcon = (variant: string) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    case "error":
      return <XCircle className="h-5 w-5" />;
    case "brand":
      return <Info className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

export function WoodinnAlert({
  variant,
  size,
  title,
  children,
  onClose,
  dismissible = false,
  icon,
  action,
  className,
  ...props
}: WoodinnAlertProps) {
  const defaultIcon = icon || getDefaultIcon(variant || "info");

  return (
    <div
      className={cn(alertVariants({ variant, size }), className)}
      data-testid={`woodinn-alert-${variant}`}
      {...props}
    >
      {/* Close button */}
      {(dismissible || onClose) && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          data-testid="alert-close-button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      <div className="flex gap-4">
        {/* Icon */}
        <div className={cn(iconVariants({ variant }))}>
          {defaultIcon}
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          {title && (
            <h4 className="font-semibold leading-none" data-testid="alert-title">
              {title}
            </h4>
          )}
          
          <div className="leading-relaxed" data-testid="alert-content">
            {children}
          </div>
          
          {/* Action button */}
          {action && (
            <div className="pt-2">
              <Button
                size="sm"
                variant={variant === "brand" ? "default" : "secondary"}
                onClick={action.onClick}
                className={cn(
                  "text-sm font-medium",
                  variant === "success" && "bg-green-600 hover:bg-green-700 text-white",
                  variant === "warning" && "bg-amber-600 hover:bg-amber-700 text-white",
                  variant === "error" && "bg-red-600 hover:bg-red-700 text-white",
                  variant === "info" && "bg-blue-600 hover:bg-blue-700 text-white"
                )}
                data-testid="alert-action-button"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Convenience components for common use cases
export function SuccessAlert(props: Omit<WoodinnAlertProps, 'variant'>) {
  return <WoodinnAlert variant="success" {...props} />;
}

export function WarningAlert(props: Omit<WoodinnAlertProps, 'variant'>) {
  return <WoodinnAlert variant="warning" {...props} />;
}

export function ErrorAlert(props: Omit<WoodinnAlertProps, 'variant'>) {
  return <WoodinnAlert variant="error" {...props} />;
}

export function InfoAlert(props: Omit<WoodinnAlertProps, 'variant'>) {
  return <WoodinnAlert variant="info" {...props} />;
}

export function BrandAlert(props: Omit<WoodinnAlertProps, 'variant'>) {
  return <WoodinnAlert variant="brand" {...props} />;
}