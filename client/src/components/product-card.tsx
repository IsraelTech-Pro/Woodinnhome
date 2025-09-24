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
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200 group cursor-pointer" 
        data-testid={`product-card-${product.id}`}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 font-semibold">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Popular Badge */}
          {product.featured && !product.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 font-semibold">
              Popular
            </Badge>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-black/40 px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Product Name */}
          <h4 
            className="font-medium text-sm text-gray-800 mb-1 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors" 
            data-testid={`product-name-${product.id}`}
          >
            {product.name}
          </h4>
          
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2 capitalize">{product.brand}</p>
          )}
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${
                    star <= rating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'fill-gray-200 text-gray-200'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1" data-testid={`product-reviews-${product.id}`}>
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price Section */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span 
                className="text-lg font-bold text-gray-900" 
                data-testid={`product-price-${product.id}`}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}