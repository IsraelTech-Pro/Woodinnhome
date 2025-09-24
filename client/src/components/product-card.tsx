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
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group cursor-pointer transform hover:-translate-y-1 h-full flex flex-col" 
        data-testid={`product-card-${product.id}`}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 font-bold shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Popular Badge */}
          {product.featured && !product.originalPrice && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 font-bold shadow-lg">
              Popular
            </Badge>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-sm font-bold bg-red-500 px-4 py-2 rounded-lg shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Product Info with Responsive Sizing */}
        <div className="p-3 sm:p-6 min-h-[120px] sm:min-h-[160px] flex flex-col justify-between flex-1">
          <div className="flex-1">
            {/* Product Name - Responsive Typography */}
            <h4 
              className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors duration-200" 
              data-testid={`product-name-${product.id}`}
              title={product.name}
            >
              {product.name}
            </h4>
            
            {/* Brand with Enhanced Styling */}
            {product.brand && (
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 font-medium capitalize bg-gray-50 px-2 py-1 rounded-md inline-block">
                {product.brand}
              </p>
            )}
            
            {/* Rating with Better Visual */}
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium ml-1" data-testid={`product-reviews-${product.id}`}>
                  ({product.reviewCount})
                </span>
              </div>
            </div>
          </div>
          
          {/* Price Section - Enhanced Responsive Design */}
          <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-2 sm:mt-3">
            {/* Mobile: Stack prices vertically for better visibility */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="text-base font-bold text-gray-900" 
                  data-testid={`product-price-${product.id}`}
                >
                  {formatPrice(product.price)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Desktop: Larger, more prominent layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-baseline gap-2 lg:gap-3">
                <span 
                  className="text-xl lg:text-2xl font-bold text-gray-900" 
                  data-testid={`product-price-${product.id}`}
                >
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm lg:text-base text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <span className="text-xs lg:text-sm text-green-600 font-semibold bg-green-50 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full">
                  Save {discountPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}