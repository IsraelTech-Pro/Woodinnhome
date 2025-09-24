import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Star,
  Shield,
  Truck,
  Phone,
  Award,
  Users,
  CheckCircle,
  Timer,
  Gift,
  Mail,
  Play,
  Download,
  Headphones,
  CreditCard,
  RefreshCw
} from "lucide-react";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import { Sofa, Tv, Palette, Zap } from "lucide-react";
import { type ProductWithCategory, type Category } from "@shared/schema";
import { useRef, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import woodinnDeliveryImg from "@assets/image_1758733567781.png";
import woodinnNovemberImg from "@assets/image_1758733665512.png";

// Horizontal scrolling product section component
interface HorizontalProductSectionProps {
  title: string;
  subtitle: string;
  products: ProductWithCategory[];
  icon: LucideIcon;
  bgColor?: string;
  textColor?: string;
  timeLeft?: string;
  sectionId: string;
}

function HorizontalProductSection({ 
  title, 
  subtitle, 
  products, 
  icon: Icon, 
  bgColor = "bg-card", 
  textColor = "text-foreground",
  timeLeft,
  sectionId 
}: HorizontalProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-2 md:py-3">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`${bgColor} ${textColor} rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold" data-testid={`${sectionId}-title`}>
                  {title}
                </h3>
                <p className="text-sm opacity-80" data-testid={`${sectionId}-subtitle`}>
                  {subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {timeLeft && (
                <div className="hidden md:flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-mono" data-testid={`${sectionId}-timer`}>
                    Time Left: {timeLeft}
                  </span>
                </div>
              )}
              
              <Link href="/products">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white text-gray-800 border-white hover:bg-gray-100 font-semibold"
                  data-testid={`${sectionId}-see-all`}
                >
                  See All
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Products */}
        <div className="relative group">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            data-testid={`${sectionId}-scroll-left`}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            data-testid={`${sectionId}-scroll-right`}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Products Container */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              width: '100%',
              maxWidth: '100%'
            }}
            data-testid={`${sectionId}-container`}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 w-40 md:w-44 min-w-40 md:min-w-44"
                data-testid={`${sectionId}-product-${product.id}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Jumia-style Hero Section with Slideshow
function JumiaHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Woodinn Home promotional banners - image only (no text overlays)
  const banners = [
    {
      id: 1,
      image: woodinnDeliveryImg,
      alt: "Woodinn Home Delivery Service"
    },
    {
      id: 2,
      image: woodinnNovemberImg,
      alt: "Woodinn Home November Promotion"
    }
  ];

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="bg-gray-50 py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Sidebar - Categories - Hidden on mobile */}
          <div className="hidden md:block md:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products/${category.slug}`}
                    className="block text-sm text-gray-600 hover:text-primary transition-colors py-1"
                    data-testid={`hero-category-${category.slug}`}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="block text-sm text-gray-600 hover:text-primary transition-colors py-1 font-medium"
                  data-testid="hero-category-all"
                >
                  All Products
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Slideshow - Takes full width on mobile, 3/4 on desktop */}
          <div className="col-span-1 md:col-span-3">
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={banner.image} 
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                    data-testid={`hero-banner-${banner.id}`}
                  />
                </div>
              ))}
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    data-testid={`hero-slide-indicator-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", { featured: true }],
  });

  const { data: allProducts = [] } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
  });

  // Create different product sections
  const newArrivalsProducts = allProducts.slice(0, 8);
  const bestSellersProducts = allProducts.slice(2, 10);
  const featuredProducts_alt = allProducts.slice(1, 9);
  const electronicsProducts = allProducts.filter(p => p.category?.slug === 'electronics').slice(0, 8);
  const furnitureProducts = allProducts.filter(p => p.category?.slug === 'furniture').slice(0, 8);

  const categoryIcons = {
    furniture: Sofa,
    electronics: Tv,
    "home-decor": Palette,
    deals: Zap,
  };

  return (
    <div>
      {/* Jumia-style Hero Section */}
      <JumiaHero />

      {/* New Arrivals Section */}
      <HorizontalProductSection
        title="New Arrivals"
        subtitle="Latest additions to our store"
        products={newArrivalsProducts}
        icon={Sparkles}
        bgColor="bg-orange-500"
        textColor="text-white"
        sectionId="new-arrivals"
      />

      {/* Featured Products Section */}
      <HorizontalProductSection
        title="Featured Products"
        subtitle="Hand-picked for you"
        products={featuredProducts}
        icon={Star}
        sectionId="featured-products"
      />

      {/* Best Sellers Section */}
      <HorizontalProductSection
        title="Best Sellers"
        subtitle="Most popular items"
        products={bestSellersProducts}
        icon={TrendingUp}
        sectionId="best-sellers"
      />

      {/* Electronics Section */}
      {electronicsProducts.length > 0 && (
        <HorizontalProductSection
          title="Electronics & Appliances"
          subtitle="Modern tech for your home"
          products={electronicsProducts}
          icon={Tv}
          sectionId="electronics"
        />
      )}

      {/* Furniture Section */}
      {furnitureProducts.length > 0 && (
        <HorizontalProductSection
          title="Furniture & Home"
          subtitle="Comfort and style combined"
          products={furnitureProducts}
          icon={Sofa}
          sectionId="furniture"
        />
      )}

      {/* Flash Deals Section */}
      <HorizontalProductSection
        title="Flash Deals"
        subtitle="Limited time offers - Don't miss out!"
        products={bestSellersProducts.slice(0, 8)}
        icon={Timer}
        bgColor="bg-gradient-to-r from-red-500 to-orange-600"
        textColor="text-white"
        timeLeft="02:15:33"
        sectionId="flash-deals"
      />

      {/* Trust & Security Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8" data-testid="trust-section-title">
            Why Choose Woodinn Home?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center" data-testid="trust-feature-delivery">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Free Delivery</h4>
              <p className="text-sm text-gray-600">Free delivery across Nsawam and Eastern Region</p>
            </div>
            
            <div className="text-center" data-testid="trust-feature-warranty">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Quality Guarantee</h4>
              <p className="text-sm text-gray-600">1-year warranty on all electrical items</p>
            </div>
            
            <div className="text-center" data-testid="trust-feature-support">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Round-the-clock customer service</p>
            </div>
            
            <div className="text-center" data-testid="trust-feature-payment">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Flexible Payment</h4>
              <p className="text-sm text-gray-600">Cash on delivery & Mobile Money</p>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
