import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">WH</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary">Woodinn Home</h1>
              <p className="text-xs text-muted-foreground">Quality Home & Electrical</p>
            </div>
          </Link>
          
          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input 
                type="search" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search icon for mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-search-button">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-20">
                <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mt-4">
                  <div className="relative">
                    <Input 
                      type="search" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2"
                      data-testid="mobile-search-input"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </form>
              </SheetContent>
            </Sheet>
            
            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={() => setCartOpen(true)}
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="mobile-menu-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/" 
                    className={`text-lg font-medium ${location === '/' ? 'text-primary' : 'text-foreground'}`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-home"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className={`text-lg font-medium ${location.startsWith('/products') ? 'text-primary' : 'text-foreground'}`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-products"
                  >
                    All Products
                  </Link>
                  <Link 
                    href="/products/furniture" 
                    className="text-lg font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-furniture"
                  >
                    Furniture
                  </Link>
                  <Link 
                    href="/products/electronics" 
                    className="text-lg font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-electronics"
                  >
                    Electronics
                  </Link>
                  <Link 
                    href="/products/home-decor" 
                    className="text-lg font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-home-decor"
                  >
                    Home Decor
                  </Link>
                  <Link 
                    href="/account" 
                    className={`text-lg font-medium ${location === '/account' ? 'text-primary' : 'text-foreground'}`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="nav-account"
                  >
                    My Account
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
