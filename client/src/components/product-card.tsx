import { Link } from "wouter";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return `GHS ${parseFloat(price).toLocaleString()}`;
  };

  const rating = parseFloat(product.rating);
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-300 group cursor-pointer" 
        data-testid={`product-card-${product.id}`}
      >
        {/* Product Image - Compact */}
        <div className="relative aspect-square bg-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          
          {/* Discount Badge - Top Right Corner */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 font-bold rounded-sm">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Compact Product Info */}
        <div className="p-2">
          {/* Product Name - Ultra Compact */}
          <h4 
            className="font-medium text-xs text-gray-800 mb-1 line-clamp-2 leading-tight" 
            data-testid={`product-name-${product.id}`}
            title={product.name}
          >
            {product.name}
          </h4>
          
          {/* Price Section - Simple Layout */}
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="text-sm font-bold text-gray-900" 
              data-testid={`product-price-${product.id}`}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}