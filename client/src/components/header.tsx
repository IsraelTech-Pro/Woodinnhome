import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/auth-modal";
import MobileSearch from "@/components/mobile-search";
import { type CartItemWithProduct } from "@shared/schema";
import woodinnLogo from "@assets/Screenshot_2025-09-24_234230-removebg-preview_1758754088474.png";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { setOpen: setCartOpen } = useCartStore();
  const { user, userId, logout } = useAuthStore();

  // Get cart data from API instead of Zustand store
  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart", { userId }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Calculate cart count from API data
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <img 
              src={woodinnLogo} 
              alt="Woodinn Home Logo" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-secondary">Woodinn Home</h1>
              <p className="text-xs text-muted-foreground">Quality Home & Electrical</p>
            </div>
          </Link>
          
          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Input 
                type="search" 
                placeholder="Search products, brands and categories" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 h-10 rounded-md border border-gray-300 focus:ring-1 focus:ring-primary"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 text-xs"
                data-testid="search-button"
              >
                Search
              </Button>
            </div>
          </form>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={() => setMobileSearchOpen(true)}
              data-testid="mobile-search-button"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Authentication */}
            {user ? (
              <>
                {/* User Account */}
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="hidden md:flex text-sm items-center space-x-2" data-testid="account-link">
                    <User className="h-4 w-4" />
                    <span>Hi, {user.firstName}</span>
                  </Button>
                </Link>
                
                {/* Logout */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="hidden md:flex text-sm items-center space-x-1"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              /* Login Button */
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:flex text-sm items-center space-x-1"
                data-testid="login-button"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
            
            {/* Cart - Hidden for admin users */}
            {!(user?.isAdmin) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative" 
                onClick={() => setCartOpen(true)}
                data-testid="cart-button"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-sm">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg border-2 border-white" data-testid="cart-count">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Category Navigation Bar */}
        <div className="hidden md:flex items-center space-x-8 py-2 border-t border-gray-100">
          <Link 
            href="/products" 
            className={`text-sm font-medium hover:text-primary transition-colors ${location.startsWith('/products') && !location.includes('/furniture') && !location.includes('/electronics') && !location.includes('/home-decor') ? 'text-primary' : 'text-gray-600'}`}
            data-testid="nav-all-products"
          >
            All Products
          </Link>
          <Link 
            href="/products/furniture" 
            className={`text-sm font-medium hover:text-primary transition-colors ${location.includes('/furniture') ? 'text-primary' : 'text-gray-600'}`}
            data-testid="nav-furniture"
          >
            Furniture
          </Link>
          <Link 
            href="/products/electronics" 
            className={`text-sm font-medium hover:text-primary transition-colors ${location.includes('/electronics') ? 'text-primary' : 'text-gray-600'}`}
            data-testid="nav-electronics"
          >
            Electronics
          </Link>
          <Link 
            href="/products/home-decor" 
            className={`text-sm font-medium hover:text-primary transition-colors ${location.includes('/home-decor') ? 'text-primary' : 'text-gray-600'}`}
            data-testid="nav-home-decor"
          >
            Home Decor
          </Link>
          {user ? (
            <Link 
              href="/account" 
              className={`text-sm font-medium hover:text-primary transition-colors ${location === '/account' ? 'text-primary' : 'text-gray-600'}`}
              data-testid="nav-account-desktop"
            >
              My Account
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-sm font-medium hover:text-primary transition-colors text-gray-600"
              data-testid="nav-login-desktop"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab="login"
      />
      
      {/* Mobile Search Modal */}
      <MobileSearch 
        isOpen={mobileSearchOpen} 
        onClose={() => setMobileSearchOpen(false)} 
      />
    </header>
  );
}
