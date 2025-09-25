import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Package, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const loaderVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-orange-500",
        primary: "text-primary",
        secondary: "text-muted-foreground",
        white: "text-white",
        accent: "text-red-500",
      },
      size: {
        sm: "text-sm",
        md: "text-base", 
        lg: "text-lg",
        xl: "text-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8", 
  xl: "h-12 w-12",
};

interface WoodinnLoaderProps extends VariantProps<typeof loaderVariants> {
  text?: string;
  icon?: "spinner" | "package" | "cart" | "truck";
  className?: string;
  fullScreen?: boolean;
}

const getIcon = (iconType: string, size: string) => {
  const sizeClass = spinnerSizes[size as keyof typeof spinnerSizes];
  
  switch (iconType) {
    case "package":
      return <Package className={cn(sizeClass, "animate-pulse")} />;
    case "cart":
      return <ShoppingCart className={cn(sizeClass, "animate-bounce")} />;
    case "truck":
      return <Truck className={cn(sizeClass, "animate-pulse")} />;
    default:
      return <Loader2 className={cn(sizeClass, "animate-spin")} />;
  }
};

export function WoodinnLoader({
  variant,
  size = "md",
  text,
  icon = "spinner",
  className,
  fullScreen = false,
  ...props
}: WoodinnLoaderProps) {
  const content = (
    <div
      className={cn(loaderVariants({ variant, size }), className)}
      data-testid="woodinn-loader"
      {...props}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Animated logo/icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-ping"></div>
          {getIcon(icon, size || "md")}
        </div>
        
        {/* Loading text */}
        {text && (
          <p className="font-medium animate-pulse" data-testid="loader-text">
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Page loader component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <WoodinnLoader 
        size="lg" 
        text={text}
        icon="package"
        variant="default"
      />
    </div>
  );
}

// Button loader component (for inline loading states)
export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <WoodinnLoader 
      size={size}
      variant="white"
      icon="spinner"
      className="mr-2"
    />
  );
}

// Card loader component (for loading cards)
export function CardLoader() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-orange-200 h-10 w-10"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-orange-200 rounded w-3/4"></div>
          <div className="h-4 bg-orange-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-orange-200 rounded"></div>
        <div className="h-4 bg-orange-200 rounded w-5/6"></div>
        <div className="h-4 bg-orange-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

// Product grid loader
export function ProductGridLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-orange-200 rounded-lg h-48 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-orange-200 rounded w-3/4"></div>
            <div className="h-4 bg-orange-200 rounded w-1/2"></div>
            <div className="h-6 bg-orange-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Order processing loader (specialized for checkout)
export function OrderProcessingLoader() {
  return (
    <WoodinnLoader
      size="xl"
      text="Processing your order..."
      icon="package"
      variant="default"
      fullScreen
    />
  );
}

// Checkout loader
export function CheckoutLoader() {
  return (
    <WoodinnLoader
      size="lg"
      text="Preparing checkout..."
      icon="cart"
      variant="primary"
    />
  );
}

// Shipping loader  
export function ShippingLoader() {
  return (
    <WoodinnLoader
      size="lg"
      text="Calculating shipping..."
      icon="truck"
      variant="accent"
    />
  );
}