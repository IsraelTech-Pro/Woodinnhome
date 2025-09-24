import { useParams, Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-32 mb-4 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="product-not-found">Product not found</h1>
          <Link href="/products">
            <Button data-testid="back-to-products">Back to Products</Button>
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

  const relatedProductsFiltered = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/products">
          <Button variant="ghost" size="sm" data-testid="back-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/products/${product.category.slug}`}>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer">
            {product.category.name}
          </span>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium" data-testid="product-breadcrumb-name">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden border">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="main-product-image"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                  data-testid={`product-thumbnail-${index}`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="product-title">{product.name}</h1>
            <p className="text-muted-foreground text-lg" data-testid="product-brand">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) ? 'fill-current' : 'opacity-30'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground" data-testid="product-rating">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary" data-testid="product-price">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-sm text-green-600">
                You save {formatPrice((parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(2))}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800" data-testid="in-stock">
                ✓ In Stock ({product.quantity} available)
              </Badge>
            ) : (
              <Badge variant="destructive" data-testid="out-of-stock">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity">Quantity:</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center" data-testid="quantity-display">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity}
                  data-testid="increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCartMutation.isPending}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" data-testid="wishlist-button">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" data-testid="share-button">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Free delivery in Nsawam
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Warranty included
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Cash on delivery available
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
          <TabsTrigger value="specifications" data-testid="tab-specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {product.specifications && typeof product.specifications === 'object' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="product-specifications">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Add Review */}
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select value={reviewRating.toString()} onValueChange={(value) => setReviewRating(Number(value))}>
                      <SelectTrigger data-testid="review-rating-select">
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
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      data-testid="review-comment-input"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={!reviewComment.trim() || addReviewMutation.isPending}
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
                  <Card key={review.id} data-testid={`review-${review.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-accent">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'fill-current' : 'opacity-30'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground" data-testid="no-reviews-message">
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
          <h2 className="text-2xl font-bold mb-6" data-testid="related-products-title">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProductsFiltered.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
