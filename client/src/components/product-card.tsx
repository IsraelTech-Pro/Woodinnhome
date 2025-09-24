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
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
        <div className="relative">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-48 object-cover" 
          />
          {product.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              Save {Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)}%
            </Badge>
          )}
          {product.featured && !product.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
              Popular
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-semibold mb-1" data-testid={`product-name-${product.id}`}>{product.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-accent">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${
                    star <= rating ? 'fill-current' : 'opacity-30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground" data-testid={`product-reviews-${product.id}`}>
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button 
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-testid={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
