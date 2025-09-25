import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Globe,
  Settings
} from "lucide-react";

export default function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="privacy-hero-title">
            Privacy Notice
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto" data-testid="privacy-hero-subtitle">
            How we collect, use, and protect your personal information
          </p>
          <Badge className="mt-6 bg-white/20 text-white text-lg px-6 py-2" data-testid="privacy-hero-badge">
            Last Updated: January 1, 2024
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <Card className="mb-8" data-testid="privacy-intro-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Shield className="h-6 w-6" />
              Our Commitment to Your Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p className="mb-4" data-testid="privacy-intro-text">
              At Woodinn Home, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Notice explains how we collect, use, store, and protect your data when you visit our 
              website, make a purchase, or interact with our services.
            </p>
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-orange-800 dark:text-orange-200 font-medium">
                <Eye className="h-4 w-4 inline mr-2" />
                We only collect information necessary to provide you with excellent service and never sell your data to third parties.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8" data-testid="info-collection-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Database className="h-6 w-6" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="personal-info-list">
                <li>Name, email address, and phone number</li>
                <li>Delivery address and billing information</li>
                <li>Account credentials (username and encrypted password)</li>
                <li>Purchase history and preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="auto-collected-list">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website and search terms used</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Optional Information</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="optional-info-list">
                <li>Product reviews and ratings</li>
                <li>Survey responses and feedback</li>
                <li>Marketing communication preferences</li>
                <li>Customer service interaction records</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8" data-testid="info-usage-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Service Provision</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="service-provision-list">
                <li>Process and fulfill your orders</li>
                <li>Arrange delivery and installation services</li>
                <li>Manage your account and preferences</li>
                <li>Provide customer support and assistance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Communication</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="communication-list">
                <li>Send order confirmations and delivery updates</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Notify you of important service changes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Business Operations</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="business-operations-list">
                <li>Improve our website and user experience</li>
                <li>Analyze shopping patterns and preferences</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-8" data-testid="info-sharing-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Users className="h-6 w-6" />
              3. Information Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-medium">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Limited Sharing Circumstances</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="limited-sharing-list">
                <li><strong>Delivery Partners:</strong> Name and address for product delivery</li>
                <li><strong>Payment Processors:</strong> Transaction information for payment processing</li>
                <li><strong>Service Providers:</strong> Technical support and maintenance services</li>
                <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8" data-testid="data-security-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Lock className="h-6 w-6" />
              4. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Security Measures</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="security-measures-list">
                <li>Encrypted data transmission using SSL technology</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal information</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Your Responsibility</h3>
              <p data-testid="user-responsibility-text">
                Please help protect your account by using a strong password, not sharing your login credentials, 
                and logging out of your account when using shared computers. Contact us immediately if you 
                suspect unauthorized access to your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8" data-testid="user-rights-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Settings className="h-6 w-6" />
              5. Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Access and Control</h3>
              <ul className="list-disc list-inside space-y-1" data-testid="access-control-list">
                <li><strong>Access:</strong> Request copies of your personal information we hold</li>
                <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Marketing Communications</h3>
              <p data-testid="marketing-comms-text">
                You can opt out of marketing emails at any time by clicking the unsubscribe link in our emails 
                or by contacting our customer service. This will not affect service-related communications such 
                as order confirmations or delivery notifications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8" data-testid="cookies-tracking-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Globe className="h-6 w-6" />
              6. Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Cookie Usage</h3>
              <p className="mb-3" data-testid="cookie-usage-text">
                We use cookies and similar technologies to enhance your browsing experience, remember your preferences, 
                and analyze website traffic. See our Cookie Notice for detailed information about our cookie practices.
              </p>
              <ul className="list-disc list-inside space-y-1" data-testid="cookie-types-list">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (optional)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8" data-testid="data-retention-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p className="mb-4" data-testid="retention-policy-text">
              We retain your personal information only as long as necessary to provide our services, comply with 
              legal obligations, resolve disputes, and enforce our agreements. Specific retention periods include:
            </p>
            <ul className="list-disc list-inside space-y-1" data-testid="retention-periods-list">
              <li><strong>Account Information:</strong> Retained while your account is active</li>
              <li><strong>Purchase Records:</strong> 7 years for tax and legal compliance</li>
              <li><strong>Marketing Data:</strong> Until you opt out or withdraw consent</li>
              <li><strong>Website Analytics:</strong> Aggregated data retained for 2 years</li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Contact Information */}
        <Card data-testid="privacy-contact-card">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <Mail className="h-6 w-6" />
              Contact Us About Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="privacy-contact-text">
                If you have questions about this Privacy Notice, want to exercise your privacy rights, 
                or have concerns about how we handle your information, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Privacy Officer:</p>
                  <p>privacy@woodinnhome.com</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Phone:</p>
                  <p>+233 50 123 4567</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Address:</p>
                  <p>Woodinn Home, Main Street, Nsawam, Ghana</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Response Time:</p>
                  <p>We respond to privacy requests within 30 days</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Changes to this Privacy Notice will be posted on our website. We encourage you to review 
                this notice periodically for any updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}