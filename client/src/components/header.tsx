import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { setOpen: setCartOpen, getItemCount } = useCartStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WH</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-secondary">Woodinn Home</h1>
              <p className="text-xs text-muted-foreground">Quality Home & Electrical</p>
            </div>
          </Link>
          
          {/* Search Bar - Full width on desktop, prominent on mobile */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
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
            {/* Account Link */}
            <Link href="/account">
              <Button variant="ghost" size="sm" className="hidden md:flex text-sm" data-testid="account-link">
                Account
              </Button>
            </Link>
            
            {/* Cart */}
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
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                  {cartItemCount}
                </span>
              )}
            </Button>
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
          <Link 
            href="/account" 
            className={`text-sm font-medium hover:text-primary transition-colors ${location === '/account' ? 'text-primary' : 'text-gray-600'}`}
            data-testid="nav-account-desktop"
          >
            My Account
          </Link>
        </div>
      </div>
    </header>
  );
}
