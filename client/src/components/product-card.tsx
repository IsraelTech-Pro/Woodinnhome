import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ProductWithCategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { userId } = useAuthStore();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    try {
      await apiRequest("POST", "/api/cart", {
        userId,
        productId: product.id,
        quantity: 1,
      });
      
      // Invalidate cart data to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return `GHS ${parseFloat(price).toLocaleString()}`;
  };

  const rating = parseFloat(product.rating);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200" data-testid={`product-card-${product.id}`}>
        <div className="relative">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-32 object-cover" 
          />
          {product.originalPrice && (
            <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
              -{Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)}%
            </Badge>
          )}
          {product.featured && !product.originalPrice && (
            <Badge className="absolute top-1 right-1 bg-primary text-white text-xs px-1.5 py-0.5">
              Popular
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-2">
          <h4 className="font-medium text-sm mb-1 line-clamp-2 leading-tight" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h4>
          {product.brand && (
            <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          )}
          
          {/* Rating - Compact */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${
                    star <= rating ? 'fill-current' : 'opacity-30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground" data-testid={`product-reviews-${product.id}`}>
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-primary" data-testid={`product-price-${product.id}`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button - Compact */}
          <Button 
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-7 text-xs"
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
