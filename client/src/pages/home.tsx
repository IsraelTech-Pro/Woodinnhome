import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Truck, Phone, Star, Smartphone, Banknote, CreditCard, ChevronLeft, ChevronRight, Flame, TrendingUp, Sparkles, Clock } from "lucide-react";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import { Sofa, Tv, Palette, Zap } from "lucide-react";
import { type ProductWithCategory, type Category } from "@shared/schema";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

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
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
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
                className="flex-shrink-0 w-64 md:w-72 min-w-64 md:min-w-72"
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
  const flashSaleProducts = allProducts.slice(0, 8);
  const bestSellersProducts = allProducts.slice(2, 10);
  const newArrivalsProducts = allProducts.slice(1, 9);
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
      {/* Hero Section */}
      <section className="hero-gradient text-white overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4" data-testid="hero-title">
                Quality Home & Electrical Goods
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-6" data-testid="hero-description">
                Trusted by Nsawam families for over 10 years. Shop furniture, electronics, and home essentials with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary font-semibold hover:bg-gray-100"
                    data-testid="hero-shop-now"
                  >
                    Shop Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white font-semibold hover:bg-white hover:text-primary"
                  onClick={() => window.open('https://wa.me/233000000000', '_blank')}
                  data-testid="hero-whatsapp"
                >
                  WhatsApp Us
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern living room with electrical appliances and furniture" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold text-sm">
                Free Delivery in Nsawam
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8" data-testid="categories-title">
            Shop by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sofa;
              return (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  description={category.description || ""}
                  slug={category.slug}
                  icon={IconComponent}
                />
              );
            })}
            
            {/* Special Deals Category */}
            <Link href="/products?featured=true">
              <button className="bg-card hover:shadow-lg transition-shadow rounded-xl p-6 text-center group w-full" data-testid="category-deals">
                <div className="w-16 h-16 mx-auto mb-4 category-icon-bg rounded-full flex items-center justify-center group-hover:category-icon-bg transition-colors">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-card-foreground">Best Deals</h4>
                <p className="text-sm text-muted-foreground">Special Offers</p>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <HorizontalProductSection
        title="Flash Sales"
        subtitle="Limited time offers"
        products={flashSaleProducts}
        icon={Flame}
        bgColor="bg-red-500"
        textColor="text-white"
        timeLeft="02h : 35m : 40s"
        sectionId="flash-sales"
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

      {/* New Arrivals Section */}
      <HorizontalProductSection
        title="New Arrivals"
        subtitle="Latest additions to our store"
        products={newArrivalsProducts}
        icon={Sparkles}
        sectionId="new-arrivals"
      />

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
