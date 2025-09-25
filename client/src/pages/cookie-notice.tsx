import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Cookie, 
  Settings, 
  Eye, 
  BarChart3, 
  Target,
  Shield,
  CheckCircle,
  X,
  Info
} from "lucide-react";

export default function CookieNotice() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="cookie-hero-title">
            Cookie Notice
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto" data-testid="cookie-hero-subtitle">
            How we use cookies to enhance your browsing experience
          </p>
          <Badge className="mt-6 bg-white/20 text-white text-lg px-6 py-2" data-testid="cookie-hero-badge">
            Last Updated: January 1, 2024
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <Card className="mb-8" data-testid="cookie-intro-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Cookie className="h-6 w-6" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p className="mb-4" data-testid="cookie-intro-text">
              Cookies are small text files placed on your device by websites you visit. They help websites remember 
              your preferences, improve your browsing experience, and provide insights into how the website is used. 
              At Woodinn Home, we use cookies responsibly to enhance your shopping experience.
            </p>
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-orange-800 dark:text-orange-200 font-medium">
                <Info className="h-4 w-4 inline mr-2" />
                You have control over cookies. You can adjust your browser settings to manage or disable cookies, 
                though this may affect website functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <Card className="mb-8" data-testid="cookie-types-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Essential Cookies */}
              <Card className="border-green-200 dark:border-green-800" data-testid="essential-cookies">
                <CardHeader>
                  <CardTitle className="text-lg text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Essential Cookies
                    <Badge variant="outline" className="text-xs border-green-300 text-green-600 dark:border-green-700 dark:text-green-400">
                      Required
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">
                    These cookies are necessary for the website to function properly. They enable core features 
                    like security, account management, and shopping cart functionality.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>User authentication and session management</li>
                    <li>Shopping cart contents and checkout process</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Functional Cookies */}
              <Card className="border-blue-200 dark:border-blue-800" data-testid="functional-cookies">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Functional Cookies
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                      Optional
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">
                    These cookies enhance your experience by remembering your preferences and settings, 
                    making your visits more personalized and convenient.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Language and currency preferences</li>
                    <li>Dark/light theme selection</li>
                    <li>Recently viewed products</li>
                    <li>Product filters and sorting preferences</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Analytics Cookies */}
              <Card className="border-purple-200 dark:border-purple-800" data-testid="analytics-cookies">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Cookies
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400">
                      Optional
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">
                    These cookies help us understand how visitors interact with our website, allowing us to 
                    improve performance and user experience through data insights.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Page views and popular content</li>
                    <li>User journey and navigation patterns</li>
                    <li>Search terms and product interests</li>
                    <li>Website performance and error tracking</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Marketing Cookies */}
              <Card className="border-orange-200 dark:border-orange-800" data-testid="marketing-cookies">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Marketing Cookies
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400">
                      Optional
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 dark:text-gray-300">
                  <p className="mb-3">
                    These cookies enable us to show you relevant advertisements and measure the effectiveness 
                    of our marketing campaigns both on our site and other websites.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Personalized product recommendations</li>
                    <li>Targeted advertisements</li>
                    <li>Social media integration</li>
                    <li>Marketing campaign effectiveness</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8" data-testid="third-party-cookies-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p className="mb-4" data-testid="third-party-intro">
              Some cookies on our website are set by third-party services that we use to enhance functionality 
              and provide additional features. These services have their own privacy policies and cookie practices.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="google-analytics">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Helps us understand website usage and improve user experience.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Learn more: Google Privacy Policy
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="social-media">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Social Media</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Enables social sharing and integration with platforms like Facebook and WhatsApp.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Individual platform policies apply
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="payment-processors">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Payment Processors</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Secure payment processing for mobile money and other payment methods.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Processor-specific privacy policies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card className="mb-8" data-testid="managing-cookies-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Eye className="h-6 w-6" />
              Managing Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Website Cookie Settings</h3>
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="mb-4" data-testid="cookie-settings-text">
                  You can manage your cookie preferences for this website using our cookie settings panel. 
                  Changes will take effect immediately for your current session.
                </p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  data-testid="manage-cookies-button"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Cookie Settings
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Browser Settings</h3>
              <p className="mb-3" data-testid="browser-settings-text">
                You can also control cookies through your browser settings. Here's how to manage cookies in popular browsers:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Google Chrome</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Settings → Privacy and Security → Cookies and other site data
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Mozilla Firefox</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Options → Privacy & Security → Enhanced Tracking Protection
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Safari</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Microsoft Edge</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Settings → Site permissions → Cookies and site data
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Contact Information */}
        <Card data-testid="cookie-contact-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">Questions About Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="cookie-contact-text">
                If you have questions about our cookie practices or need help managing your cookie settings, 
                please don't hesitate to contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Email:</p>
                  <p>privacy@woodinnhome.com</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Phone:</p>
                  <p>+233 50 123 4567</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium" data-testid="cookie-update-date">
                This Cookie Notice was last updated on January 1, 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}