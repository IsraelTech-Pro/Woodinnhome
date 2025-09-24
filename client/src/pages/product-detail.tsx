import { useParams, Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductCard from "@/components/product-card";
import { type ProductWithCategory, type Review } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const params = useParams();
  const { userId } = useAuthStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: product, isLoading } = useQuery<ProductWithCategory>({
    queryKey: ["/api/products", params.id],
    enabled: !!params.id,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/products", params.id, "reviews"],
    enabled: !!params.id,
  });

  const { data: relatedProducts = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", { categoryId: product?.categoryId }],
    enabled: !!product?.categoryId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        userId,
        productId: params.id,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/products/${params.id}/reviews`, {
        userId,
        rating: reviewRating,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", params.id, "reviews"] });
      setReviewComment("");
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 mb-6 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 aspect-square rounded-2xl"></div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 w-20 h-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-200 h-10 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-16 w-full rounded"></div>
                <div className="bg-gray-200 h-12 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800" data-testid="product-not-found">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products">
            <Button size="lg" data-testid="back-to-products">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return `GHS ${parseFloat(price).toLocaleString()}`;
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewComment.trim()) {
      addReviewMutation.mutate();
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const relatedProductsFiltered = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary" data-testid="back-button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <span className="text-gray-400">/</span>
          <Link href={`/products/${product.category.slug}`}>
            <span className="text-gray-600 hover:text-primary cursor-pointer transition-colors">
              {product.category.name}
            </span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-800" data-testid="product-breadcrumb-name">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images Gallery - Left Thumbnails + Main Image */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Thumbnail Column - Should be on LEFT */}
              <div className="flex flex-col gap-2 w-20">
                {product.images.length > 1 ? (
                  product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-orange-500 ring-2 ring-orange-200 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid={`product-thumbnail-${index}`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-gray-400">
                    {/* Empty space for single image products */}
                  </div>
                )}
              </div>
              
              {/* Main Image - Should be on RIGHT */}
              <div className="relative group flex-1 max-w-md mx-auto lg:max-w-full">
                <div 
                  className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-md cursor-zoom-in transition-all duration-300 ${
                    isImageZoomed ? 'transform scale-105' : ''
                  }`}
                  onClick={() => setIsFullscreen(true)}
                  onMouseEnter={() => setIsImageZoomed(true)}
                  onMouseLeave={() => setIsImageZoomed(false)}
                >
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    data-testid="main-product-image"
                  />
                  
                  {/* Zoom Indicator */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-sm px-3 py-1 font-semibold">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                        data-testid="prev-image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                        data-testid="next-image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Fallback: Horizontal thumbnails for single image or mobile */}
            {product.images.length === 1 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                Main product image
              </div>
            )}
          </div>

          {/* Enhanced Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight" data-testid="product-title">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-600 text-lg font-medium" data-testid="product-brand">{product.brand}</p>
              )}
            </div>

            {/* Rating & Reviews */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${
                          star <= Math.round(averageRating) ? 'fill-current' : 'opacity-30'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900" data-testid="product-rating">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900" data-testid="product-price">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-green-600 font-semibold">
                  You save {formatPrice((parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(2))} ({discountPercentage}% off)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {product.inStock ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-semibold" data-testid="in-stock">
                    In Stock ({product.quantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-semibold" data-testid="out-of-stock">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-4">
                <Label htmlFor="quantity" className="font-semibold">Quantity:</Label>
                <div className="flex items-center gap-0 border border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-l-lg rounded-r-none border-r"
                    data-testid="decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold bg-gray-50 h-10 flex items-center justify-center" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    disabled={quantity >= product.quantity}
                    className="h-10 w-10 rounded-r-lg rounded-l-none border-l"
                    data-testid="increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold h-12"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCartMutation.isPending}
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg" className="h-12 w-12" data-testid="wishlist-button">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 w-12" data-testid="share-button">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <Card className="shadow-sm border-gray-100">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-gray-900">Why Choose This Product?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Free delivery in Nsawam</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Warranty included</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Cash on delivery available</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Mobile Money payment accepted</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <TabsTrigger value="description" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white" data-testid="tab-description">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white" data-testid="tab-specifications">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white" data-testid="tab-reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card className="shadow-sm border-gray-100">
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed text-lg" data-testid="product-description">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card className="shadow-sm border-gray-100">
              <CardContent className="pt-6">
                {product.specifications && typeof product.specifications === 'object' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="product-specifications">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="font-semibold text-gray-900">{key}:</span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No specifications available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Add Review */}
              <Card className="shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-gray-900">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label htmlFor="rating" className="font-semibold">Rating</Label>
                      <Select value={reviewRating.toString()} onValueChange={(value) => setReviewRating(Number(value))}>
                        <SelectTrigger className="mt-2" data-testid="review-rating-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                          <SelectItem value="4">4 Stars - Very Good</SelectItem>
                          <SelectItem value="3">3 Stars - Good</SelectItem>
                          <SelectItem value="2">2 Stars - Fair</SelectItem>
                          <SelectItem value="1">1 Star - Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="comment" className="font-semibold">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience with this product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="mt-2 min-h-[100px]"
                        data-testid="review-comment-input"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={!reviewComment.trim() || addReviewMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      data-testid="submit-review-button"
                    >
                      {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id} className="shadow-sm border-gray-100" data-testid={`review-${review.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${
                                  star <= review.rating ? 'fill-current' : 'opacity-30'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-sm border-gray-100">
                    <CardContent className="pt-6 text-center py-12">
                      <p className="text-gray-500 text-lg" data-testid="no-reviews-message">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProductsFiltered.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900" data-testid="related-products-title">
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProductsFiltered.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex justify-between items-center">
              <span>{product.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFullscreen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 relative bg-gray-50">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}