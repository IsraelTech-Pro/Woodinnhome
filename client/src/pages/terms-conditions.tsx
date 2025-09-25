import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale
} from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="terms-hero-title">
            Terms & Conditions
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto" data-testid="terms-hero-subtitle">
            Legal terms governing your use of Woodinn Home services
          </p>
          <Badge className="mt-6 bg-white/20 text-white text-lg px-6 py-2" data-testid="terms-hero-badge">
            Effective Date: January 1, 2024
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <Card className="mb-8" data-testid="introduction-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <FileText className="h-6 w-6" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p data-testid="introduction-text">
              These Terms and Conditions ("Terms") govern your use of the Woodinn Home website and services. 
              By accessing our website, making a purchase, or using our services, you agree to be bound by these Terms. 
              Please read them carefully before proceeding with any transactions.
            </p>
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-orange-800 dark:text-orange-200 font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                If you do not agree with any part of these terms, please do not use our website or services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Website Use */}
        <Card className="mb-8" data-testid="website-use-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">1. Website Use</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Permitted Use</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="permitted-use-list">
                <li>Browse and purchase furniture and electronics for personal use</li>
                <li>Create an account to track orders and manage preferences</li>
                <li>Access customer support services</li>
                <li>Leave honest reviews and feedback about products</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Prohibited Activities</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="prohibited-activities-list">
                <li>Using the website for any unlawful purpose or commercial resale</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Posting false, misleading, or defamatory content</li>
                <li>Interfering with the website's functionality or security</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Products and Orders */}
        <Card className="mb-8" data-testid="products-orders-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <CreditCard className="h-6 w-6" />
              2. Products and Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Product Information</h3>
              <p data-testid="product-info-text">
                We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant 
                that product descriptions or other content is error-free, complete, or current. Colors may vary slightly 
                due to monitor settings and lighting conditions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Pricing and Availability</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="pricing-availability-list">
                <li>All prices are in Ghana Cedis (GHS) and include applicable taxes</li>
                <li>Prices are subject to change without notice</li>
                <li>Product availability is updated regularly but not guaranteed</li>
                <li>We reserve the right to limit quantities and refuse orders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Order Acceptance</h3>
              <p data-testid="order-acceptance-text">
                Your order constitutes an offer to purchase. We may accept or decline your order at our discretion. 
                Order confirmation does not guarantee acceptance. Payment authorization is required before order fulfillment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="mb-8" data-testid="payment-terms-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">3. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Accepted Payment Methods</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="payment-methods-list">
                <li>Cash on Delivery (COD) - payment upon product delivery</li>
                <li>Mobile Money (MTN Mobile Money, Vodafone Cash, AirtelTigo Money)</li>
                <li>Bank transfer to our designated accounts</li>
                <li>In-store payment at our Nsawam location</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Payment Security</h3>
              <p data-testid="payment-security-text">
                All payment information is processed securely. We do not store your payment details on our servers. 
                For COD orders, payment is collected at the time of delivery by our authorized personnel.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery and Returns */}
        <Card className="mb-8" data-testid="delivery-returns-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Truck className="h-6 w-6" />
              4. Delivery and Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Delivery Policy</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="delivery-policy-list">
                <li>Free delivery within Nsawam and surrounding areas</li>
                <li>Delivery charges apply for locations outside our standard delivery zone</li>
                <li>Delivery timeframes: 1-3 business days for in-stock items</li>
                <li>Customer must be present or authorize someone to receive delivery</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Return Policy</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="return-policy-list">
                <li>7-day return window for unused items in original packaging</li>
                <li>Customer responsible for return shipping costs unless item is defective</li>
                <li>Electronics must include all original accessories and manuals</li>
                <li>Custom or made-to-order items are not eligible for return</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranties and Liability */}
        <Card className="mb-8" data-testid="warranty-liability-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Shield className="h-6 w-6" />
              5. Warranties and Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Product Warranties</h3>
              <p data-testid="warranty-text">
                Products come with manufacturer warranties where applicable. Woodinn Home facilitates warranty claims 
                but is not responsible for manufacturer warranty terms. Extended warranty options may be available 
                for purchase with select products.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Limitation of Liability</h3>
              <p data-testid="liability-text">
                To the fullest extent permitted by law, Woodinn Home's liability is limited to the purchase price 
                of the product. We are not liable for indirect, incidental, or consequential damages arising from 
                product use or website access.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data */}
        <Card className="mb-8" data-testid="privacy-data-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">6. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p data-testid="privacy-text">
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using 
              our services, you consent to our data practices as described in the Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Changes and Termination */}
        <Card className="mb-8" data-testid="changes-termination-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Clock className="h-6 w-6" />
              7. Changes and Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Terms Updates</h3>
              <p data-testid="terms-updates-text">
                We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website 
                with a new effective date. Continued use of our services after changes constitutes acceptance of the 
                revised Terms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Account Termination</h3>
              <p data-testid="account-termination-text">
                We may suspend or terminate your account for violation of these Terms. You may close your account 
                at any time by contacting customer service. Termination does not affect pending orders or legal obligations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Contact Information */}
        <Card data-testid="contact-legal-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Scale className="h-6 w-6" />
              Legal Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="legal-contact-text">
                For questions about these Terms and Conditions or to report violations, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Email:</p>
                  <p>legal@woodinnhome.com</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Phone:</p>
                  <p>+233 50 123 4567</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Address:</p>
                  <p>Woodinn Home, Main Street, Nsawam, Eastern Region, Ghana</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Business Hours:</p>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium" data-testid="terms-effective-date">
                These Terms and Conditions are effective as of January 1, 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}