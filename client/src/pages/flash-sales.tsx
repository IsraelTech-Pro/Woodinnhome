import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Clock, 
  Flame, 
  ShoppingCart, 
  Star,
  Timer,
  TrendingUp,
  Gift,
  Percent
} from "lucide-react";

interface FlashSale {
  id: string;
  productName: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  sold: number;
  available: number;
  endsAt: Date;
  category: string;
}

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const flashSales: FlashSale[] = [
    {
      id: "1",
      productName: "Samsung 43\" Smart TV",
      originalPrice: 2800,
      salePrice: 1999,
      discount: 29,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      sold: 47,
      available: 15,
      endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      category: "Electronics"
    },
    {
      id: "2", 
      productName: "Executive Office Chair",
      originalPrice: 850,
      salePrice: 599,
      discount: 30,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      sold: 23,
      available: 8,
      endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      category: "Furniture"
    },
    {
      id: "3",
      productName: "Double Door Refrigerator",
      originalPrice: 3400,
      salePrice: 2590,
      discount: 24,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      sold: 12,
      available: 3,
      endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      category: "Electronics"
    },
    {
      id: "4",
      productName: "Modern Dining Set",
      originalPrice: 1800,
      salePrice: 1299,
      discount: 28,
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      sold: 31,
      available: 12,
      endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      category: "Furniture"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const nextSaleEnd = Math.min(...flashSales.map(sale => sale.endsAt.getTime()));
      const distance = nextSaleEnd - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getProgressPercentage = (sold: number, total: number) => {
    return Math.round((sold / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 dark:from-red-600 dark:via-orange-600 dark:to-yellow-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-12 w-12 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold" data-testid="flash-sales-hero-title">
              Flash Sales
            </h1>
            <Flame className="h-12 w-12 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto mb-6" data-testid="flash-sales-hero-subtitle">
            Limited time offers with incredible discounts - Don't miss out!
          </p>
          <div className="flex items-center justify-center gap-4 text-2xl font-bold">
            <Badge className="bg-white/20 text-white text-lg px-4 py-2 animate-bounce" data-testid="flash-sales-timer">
              <Timer className="h-5 w-5 mr-2" />
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </Badge>
          </div>
          <p className="text-orange-200 mt-2">Next sale ending soon!</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Current Flash Sales */}
        <Card className="mb-12 border-red-200 dark:border-red-800" data-testid="current-sales-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-3">
              <Flame className="h-8 w-8" />
              Current Flash Sales
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              Amazing deals available for a limited time only!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {flashSales.map((sale) => {
                const progressPercent = getProgressPercentage(sale.sold, sale.sold + sale.available);
                const timeToEnd = sale.endsAt.getTime() - new Date().getTime();
                const hoursLeft = Math.floor(timeToEnd / (1000 * 60 * 60));
                
                return (
                  <Card key={sale.id} className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow" data-testid={`flash-sale-${sale.id}`}>
                    <CardHeader className="pb-4">
                      <div className="relative">
                        <img 
                          src={sale.image} 
                          alt={sale.productName}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse">
                          <Percent className="h-3 w-3 mr-1" />
                          {sale.discount}% OFF
                        </Badge>
                        <Badge variant="outline" className="absolute top-2 left-2 bg-white/90 text-gray-800">
                          {sale.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3" data-testid={`product-name-${sale.id}`}>
                        {sale.productName}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid={`sale-price-${sale.id}`}>
                          GHS {sale.salePrice.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through" data-testid={`original-price-${sale.id}`}>
                          GHS {sale.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Sold: {sale.sold}</span>
                          <span>Available: {sale.available}</span>
                        </div>
                        <Progress value={progressPercent} className="h-3" data-testid={`progress-${sale.id}`} />
                        <p className="text-xs text-center text-gray-500 mt-1">
                          {progressPercent}% claimed
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium" data-testid={`time-left-${sale.id}`}>
                            {hoursLeft}h left
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                        data-testid={`add-to-cart-${sale.id}`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Flash Sale Features */}
        <Card className="mb-12" data-testid="flash-sale-features-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400">
              Why Shop Flash Sales?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center" data-testid="feature-savings">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Huge Savings</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Save up to 50% on selected furniture and electronics with our limited-time flash sales.
                </p>
              </div>

              <div className="text-center" data-testid="feature-quality">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Premium Quality</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All flash sale items maintain our high quality standards - great products at great prices.
                </p>
              </div>

              <div className="text-center" data-testid="feature-limited">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Timer className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Limited Time</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Flash sales run for limited hours only. When they're gone, they're gone!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sales Teaser */}
        <Card data-testid="upcoming-sales-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 flex items-center justify-center gap-3">
              <Gift className="h-8 w-8" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Weekend Mega Flash Sale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                This weekend, enjoy up to 60% off on bedroom sets, kitchen appliances, and home decor items. 
                Mark your calendar and don't miss out on our biggest flash sale event of the month!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg px-6 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Saturday & Sunday
                </Badge>
                <Button 
                  variant="outline" 
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                  data-testid="notify-button"
                >
                  Notify Me
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}