import { Link } from "wouter";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/lib/auth-store";
import { type CartItemWithProduct } from "@shared/schema";

export default function Cart() {
  const { userId, user } = useAuthStore();

  // Redirect admin users away from cart page
  if (user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-8">
            Admin users cannot access the shopping cart. This page is for customers only.
          </p>
          <Link href="/admin">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Go to Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart", { userId }],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/cart?userId=${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const formatPrice = (price: string | number) => {
    return `GHS ${parseFloat(price.toString()).toLocaleString()}`;
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCartMutation.mutate();
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 500 ? 0 : 25; // Free delivery for orders over GHS 500
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 w-48 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" data-testid="cart-page-title">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
            data-testid="clear-cart-button"
          >
            Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-8">
            <svg 
              className="mx-auto h-32 w-32 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0-2.5 5M7 13l2.5 5m4.5-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4" data-testid="empty-cart-title">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8" data-testid="empty-cart-description">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" data-testid="continue-shopping-button">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Link href={`/product/${item.product.id}`}>
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer" data-testid={`cart-item-name-${item.id}`}>
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary" data-testid={`cart-item-price-${item.id}`}>
                            {formatPrice(item.product.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Subtotal: {formatPrice(parseFloat(item.product.price) * item.quantity)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              data-testid={`decrease-quantity-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium" data-testid={`cart-item-quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                              data-testid={`increase-quantity-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isPending}
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle data-testid="order-summary-title">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span data-testid="subtotal-amount">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""} data-testid="delivery-fee">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  
                  {deliveryFee === 0 && (
                    <p className="text-sm text-green-600">🎉 Free delivery on orders over GHS 500!</p>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary" data-testid="total-amount">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full" data-testid="checkout-button">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/products" className="w-full">
                    <Button variant="outline" size="lg" className="w-full" data-testid="continue-shopping-footer">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
                
                {/* Payment Methods Preview */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">We Accept:</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>💰 Cash on Delivery</span>
                    <span>•</span>
                    <span>📱 Mobile Money</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
