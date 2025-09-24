import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Truck, Phone, Star, Smartphone, Banknote, CreditCard, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Clock, ArrowRight } from "lucide-react";
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
    <section className="py-6 md:py-8">
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
                  className="border-white/30 text-current hover:bg-white/10"
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
  
  // Woodinn Home promotional banners using brand images
  const banners = [
    {
      id: 1,
      title: "We're always ready to deliver",
      subtitle: "SHOP NOW!",
      description: "Home Appliances • Electricals • Furniture & More",
      buttonText: "Visit or call us",
      image: woodinnDeliveryImg,
      bgColor: "from-orange-500 to-red-600",
      link: "/products"
    },
    {
      id: 2,
      title: "Welcome November!",
      subtitle: "HAPPY NEW MONTH",
      description: "Home Appliances • Electricals • Furniture & More",
      buttonText: "Shop Collection",
      image: woodinnNovemberImg, 
      bgColor: "from-orange-600 to-red-700",
      link: "/products"
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
    <section className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
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

          {/* Center - Main Slideshow */}
          <div className="lg:col-span-2">
            <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className={`h-full bg-gradient-to-r ${banner.bgColor} flex items-center relative overflow-hidden`}>
                    <div className="flex-1 p-6 lg:p-8 text-white z-10">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2" data-testid={`hero-banner-title-${banner.id}`}>
                        {banner.title}
                      </h2>
                      <p className="text-lg lg:text-xl font-semibold mb-2 text-yellow-200" data-testid={`hero-banner-subtitle-${banner.id}`}>
                        {banner.subtitle}
                      </p>
                      <p className="text-sm mb-4 opacity-90" data-testid={`hero-banner-description-${banner.id}`}>
                        {banner.description}
                      </p>
                      <Link href={banner.link}>
                        <Button 
                          size="sm" 
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                          data-testid={`hero-banner-button-${banner.id}`}
                        >
                          {banner.buttonText}
                        </Button>
                      </Link>
                    </div>
                    <div className="flex-1 relative">
                      <img 
                        src={banner.image} 
                        alt={banner.title}
                        className="absolute right-0 top-0 w-full h-full object-cover opacity-20 lg:opacity-40"
                      />
                    </div>
                  </div>
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

          {/* Right Sidebar - Services */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 text-center">
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">WOODINN DELIVERY</h4>
              <p className="text-xs text-gray-600">Send parcels easily</p>
            </Card>
            
            <Card className="p-4 text-center">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">SELL ON WOODINN</h4>
              <p className="text-xs text-gray-600">Make more money</p>
            </Card>
            
            <Card className="p-4 text-center bg-primary text-white">
              <Shield className="h-8 w-8 text-white mx-auto mb-2" />
              <h4 className="font-semibold text-sm">HOME STORE LOVER</h4>
              <p className="text-xs opacity-90">UP TO 45% OFF</p>
            </Card>
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


      {/* Trust Signals */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8" data-testid="trust-signals-title">
            Why Customers Trust Woodinn Home
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 trust-icon-bg rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Quality Guaranteed</h4>
              <p className="text-muted-foreground text-sm">
                All products come with warranty and quality assurance from trusted brands.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 trust-icon-bg rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-muted-foreground text-sm">
                Same-day delivery in Nsawam and next-day delivery to surrounding areas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 trust-icon-bg rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Local Support</h4>
              <p className="text-muted-foreground text-sm">
                Call or WhatsApp for instant support. We speak your language and understand your needs.
              </p>
            </div>
          </div>
          
          {/* Customer Testimonials */}
          <Card className="p-8">
            <h4 className="text-xl font-bold text-center mb-8" data-testid="testimonials-title">
              What Our Customers Say
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4" data-testid="testimonial-1">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                />
                <div>
                  <div className="flex text-accent mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Excellent service! Bought a fridge and it was delivered same day. Very professional and the quality is top-notch."
                  </p>
                  <p className="font-semibold text-sm">Akosua Mensah</p>
                  <p className="text-xs text-muted-foreground">Nsawam</p>
                </div>
              </div>
              
              <div className="flex gap-4" data-testid="testimonial-2">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                />
                <div>
                  <div className="flex text-accent mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Been shopping here for 5 years. Best prices in town and they accept Mobile Money. Very convenient!"
                  </p>
                  <p className="font-semibold text-sm">Kwame Asante</p>
                  <p className="text-xs text-muted-foreground">Adoagyiri</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8" data-testid="payment-methods-title">
            Convenient Payment Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 payment-icon-bg-accent rounded-full flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Mobile Money</h4>
              <p className="text-sm text-muted-foreground">
                MTN, Vodafone, AirtelTigo - Pay with your mobile money wallet instantly
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 payment-icon-bg-primary rounded-full flex items-center justify-center">
                <Banknote className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Cash on Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Pay when your order arrives at your doorstep - No advance payment needed
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 payment-icon-bg-secondary rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="font-semibold mb-2">Bank Transfer</h4>
              <p className="text-sm text-muted-foreground">
                Direct bank transfer for large purchases - Secure and reliable
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
