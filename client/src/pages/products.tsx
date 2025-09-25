import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/product-card";
import { type ProductWithCategory, type Category } from "@shared/schema";

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Products() {
  const params = useParams();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});

  // Debounced search query for real-time search
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Extract search from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", { 
      categoryId: params.category ? categories.find(c => c.slug === params.category)?.id : undefined,
      search: debouncedSearchQuery || undefined,
    }],
    enabled: !params.category || categories.length > 0,
  });

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
      return false;
    }

    // Price filter
    const price = parseFloat(product.price);
    if (priceRange.min && price < priceRange.min) return false;
    if (priceRange.max && price > priceRange.max) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price_high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Auto-update URL when search query changes (for bookmarking)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedSearchQuery.trim()) {
      url.searchParams.set('search', debouncedSearchQuery);
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url.toString());
  }, [debouncedSearchQuery]);

  const currentCategory = params.category ? categories.find(c => c.slug === params.category) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="products-page-title">
          {currentCategory ? currentCategory.name : 'All Products'}
        </h1>
        {currentCategory && (
          <p className="text-muted-foreground" data-testid="category-description">
            {currentCategory.description}
          </p>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Real-time Search */}
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Type to search products in real-time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="products-search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isLoading && debouncedSearchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48" data-testid="sort-select">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price_low">Price (Low to High)</SelectItem>
            <SelectItem value="price_high">Price (High to Low)</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden" data-testid="mobile-filters-button">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Categories Filter */}
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                        data-testid={`mobile-filter-category-${category.slug}`}
                      />
                      <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-3">Price Range (GHS)</h4>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={priceRange.min || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                    data-testid="mobile-min-price"
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={priceRange.max || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                    data-testid="mobile-max-price"
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative">
        {/* Desktop Sidebar Filters - Fixed Position */}
        <div className="hidden md:block fixed left-4 top-20 w-64 z-10 bg-white border rounded-lg p-4 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-lg">
          <h3 className="font-semibold mb-4">Filters</h3>
                
          {/* Categories Navigation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Categories</h4>
            <div className="space-y-2">
              <Link
                href="/products"
                className={`block text-sm px-3 py-2 rounded-md transition-colors ${
                  !params.category 
                    ? 'bg-orange-500 text-white font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
                data-testid="category-nav-all"
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className={`block text-sm px-3 py-2 rounded-md transition-colors ${
                    params.category === category.slug 
                      ? 'bg-orange-500 text-white font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                  }`}
                  data-testid={`category-nav-${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Additional Filters</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.id]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                      }
                    }}
                    data-testid={`additional-filter-${category.slug}`}
                  />
                  <Label htmlFor={`filter-${category.id}`} className="text-sm">{category.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Price Range (GHS)</h4>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min price"
                value={priceRange.min || ""}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                data-testid="min-price"
              />
              <Input
                type="number"
                placeholder="Max price"
                value={priceRange.max || ""}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                data-testid="max-price"
              />
            </div>
          </div>
        </div>

        {/* Products Grid - Scrollable with margin for fixed sidebar */}
        <div className="md:ml-72 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
                  <div className="space-y-1">
                    <div className="bg-gray-200 h-2 rounded"></div>
                    <div className="bg-gray-200 h-2 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-sm" data-testid="products-count">
                  Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4" data-testid="no-products-message">
                No products found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setPriceRange({});
                }}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
