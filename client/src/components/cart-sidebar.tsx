import { useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type CartItemWithProduct } from "@shared/schema";

export default function CartSidebar() {
  const { isOpen, setOpen } = useCartStore();
  const { userId, user } = useAuthStore();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart", { userId }],
    enabled: isOpen,
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

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

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

  // Don't render cart sidebar for admin users
  if (user?.isAdmin) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:w-96" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} data-testid="close-cart">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-4" data-testid="empty-cart-message">Your cart is empty</p>
            <Link href="/products">
              <Button onClick={() => setOpen(false)} data-testid="continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 mt-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" data-testid={`cart-item-name-${item.id}`}>
                        {item.product.name}
                      </h4>
                      <p className="text-primary font-semibold" data-testid={`cart-item-price-${item.id}`}>
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`cart-item-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateQuantityMutation.isPending}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeItemMutation.isPending}
                          data-testid={`remove-item-${item.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Cart Total and Checkout */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-primary" data-testid="cart-total">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              
              <div className="space-y-2">
                <Link href="/cart" className="w-full">
                  <Button variant="outline" className="w-full" onClick={() => setOpen(false)} data-testid="view-cart">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full" onClick={() => setOpen(false)} data-testid="checkout-button">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
