import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Users, 
  Truck, 
  Shield, 
  Heart, 
  Star,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="about-hero-title">
            About Woodinn Home
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto" data-testid="about-hero-subtitle">
            Your trusted partner for quality furniture and electronics in Ghana
          </p>
          <Badge className="mt-6 bg-white/20 text-white text-lg px-6 py-2" data-testid="about-hero-badge">
            Serving Nsawam & Beyond Since 2020
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Company Story */}
        <Card className="mb-12" data-testid="company-story-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 flex items-center justify-center gap-3">
              <Store className="h-8 w-8" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p className="mb-6" data-testid="company-story-text">
              Founded in 2020 in the heart of Nsawam, Ghana, Woodinn Home began as a small family business with a big dream: 
              to provide quality furniture and electrical appliances to Ghanaian families at affordable prices. What started 
              as a modest shop has grown into a trusted name throughout the Eastern Region and beyond.
            </p>
            <p className="mb-6">
              Our founders, passionate about quality craftsmanship and customer satisfaction, recognized the need for a reliable 
              source of home furnishings that combines international quality standards with local understanding and pricing. 
              Today, we proudly serve thousands of satisfied customers across Ghana.
            </p>
            <p>
              At Woodinn Home, we believe that every Ghanaian family deserves a beautiful, comfortable home filled with 
              quality products that stand the test of time. This belief drives everything we do, from our careful product 
              selection to our commitment to exceptional customer service.
            </p>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-orange-200 dark:border-orange-800" data-testid="mission-card">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
                <Heart className="h-6 w-6" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p data-testid="mission-text">
                To provide high-quality furniture and electrical appliances to Ghanaian families, 
                making beautiful and functional homes accessible to everyone through fair pricing, 
                exceptional service, and convenient payment options that respect local preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800" data-testid="vision-card">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400 flex items-center gap-3">
                <Star className="h-6 w-6" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p data-testid="vision-text">
                To become Ghana's most trusted and preferred destination for home furnishings, 
                known for our quality products, customer-first approach, and contribution to 
                making every Ghanaian home a place of comfort, style, and pride.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <Card className="mb-12" data-testid="values-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 mb-4">
              Our Core Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center" data-testid="value-quality">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Quality First</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We carefully select only the finest products that meet our high standards for durability and craftsmanship.
                </p>
              </div>

              <div className="text-center" data-testid="value-customers">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Customer Focus</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our customers are at the heart of everything we do. Their satisfaction is our primary measure of success.
                </p>
              </div>

              <div className="text-center" data-testid="value-reliability">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Reliability</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  From timely delivery to after-sales support, we stand behind our commitments to our customers.
                </p>
              </div>

              <div className="text-center" data-testid="value-accessibility">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe beautiful homes should be accessible to all, offering flexible payment options and fair pricing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Contact Information */}
        <Card data-testid="contact-info-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 mb-4">
              Visit Our Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div data-testid="store-location">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Main Street, Nsawam<br />
                  Eastern Region, Ghana
                </p>
              </div>

              <div data-testid="store-phone">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  +233 50 123 4567<br />
                  +233 24 987 6543
                </p>
              </div>

              <div data-testid="store-email">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  info@woodinnhome.com<br />
                  sales@woodinnhome.com
                </p>
              </div>

              <div data-testid="store-hours">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Hours</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mon - Fri: 8:00 AM - 6:00 PM<br />
                  Sat: 8:00 AM - 8:00 PM<br />
                  Sun: 10:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}