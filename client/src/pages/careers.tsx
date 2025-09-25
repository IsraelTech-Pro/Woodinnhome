import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  Users, 
  Heart, 
  Award, 
  Clock, 
  MapPin,
  Mail,
  GraduationCap,
  TrendingUp,
  Coffee,
  Lightbulb,
  Handshake
} from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      id: "sales-rep",
      title: "Sales Representative",
      department: "Sales",
      type: "Full-time",
      location: "Nsawam, Ghana",
      description: "Join our sales team to help customers find the perfect furniture and electronics for their homes.",
      requirements: [
        "2+ years sales experience preferred",
        "Excellent communication skills in English and local languages",
        "Customer service oriented",
        "Knowledge of furniture/electronics helpful"
      ]
    },
    {
      id: "warehouse-coord",
      title: "Warehouse Coordinator",
      department: "Operations",
      type: "Full-time", 
      location: "Nsawam, Ghana",
      description: "Manage inventory, coordinate deliveries, and ensure efficient warehouse operations.",
      requirements: [
        "Experience in warehouse/inventory management",
        "Strong organizational skills",
        "Ability to lift and move furniture",
        "Valid driver's license preferred"
      ]
    },
    {
      id: "customer-service",
      title: "Customer Service Associate",
      department: "Customer Service",
      type: "Full-time",
      location: "Nsawam, Ghana", 
      description: "Provide exceptional customer support through phone, email, and in-person interactions.",
      requirements: [
        "High school diploma or equivalent",
        "Strong communication skills",
        "Computer literacy",
        "Patient and helpful personality"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Hours",
      description: "Work-life balance with flexible scheduling options"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Training & Development",
      description: "Continuous learning opportunities and skill development"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Career Growth",
      description: "Clear advancement paths and promotion opportunities"
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Great Environment",
      description: "Friendly workplace with team activities and events"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Performance Bonuses",
      description: "Recognition and rewards for outstanding performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="careers-hero-title">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto mb-6" data-testid="careers-hero-subtitle">
            Build your career with Ghana's trusted home furnishing company
          </p>
          <Badge className="bg-white/20 text-white text-lg px-6 py-2" data-testid="careers-hero-badge">
            Growing Team • Great Culture • Amazing Opportunities
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-orange-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Why Work With Us */}
        <Card className="mb-12" data-testid="why-work-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 flex items-center justify-center gap-3">
              <Briefcase className="h-8 w-8" />
              Why Work with Woodinn Home?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p className="mb-6" data-testid="why-work-text">
              At Woodinn Home, we believe our employees are our greatest asset. We're not just building a business; 
              we're building a family of dedicated professionals who share our passion for helping Ghanaian families 
              create beautiful homes.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center" data-testid="culture-growth">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Growth Opportunities</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We invest in our team's professional development with clear career paths and advancement opportunities.
                </p>
              </div>
              <div className="text-center" data-testid="culture-innovation">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Innovation Culture</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your ideas matter. We encourage creativity and innovation in everything we do.
                </p>
              </div>
              <div className="text-center" data-testid="culture-values">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Values-Driven</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Work with a team that shares your values and commitment to excellence and customer service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-12" data-testid="benefits-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 mb-4">
              Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center" data-testid={`benefit-${index}`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-orange-600 dark:text-orange-400">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="mb-12" data-testid="positions-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 flex items-center justify-center gap-3">
              <Users className="h-8 w-8" />
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card key={position.id} className="border-orange-200 dark:border-orange-800" data-testid={`position-${position.id}`}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-gray-800 dark:text-gray-200">{position.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            {position.department}
                          </Badge>
                          <Badge variant="outline" className="border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400">
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shrink-0"
                        data-testid={`apply-${position.id}`}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{position.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Application Process */}
        <Card data-testid="application-process-card">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-orange-600 dark:text-orange-400 mb-4">
              How to Apply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div data-testid="step-apply">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Submit Application</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Send your CV and cover letter to our HR team via email or apply through our website.
                </p>
              </div>

              <div data-testid="step-interview">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Interview Process</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll schedule an interview to discuss your experience and learn more about your goals.
                </p>
              </div>

              <div data-testid="step-onboard">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Join Our Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome aboard! We'll provide comprehensive onboarding and training to set you up for success.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Ready to Start Your Career?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Don't see a position that fits? Send us your CV anyway! We're always looking for talented individuals to join our growing team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-5 w-5" />
                  <span>careers@woodinnhome.com</span>
                </div>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  data-testid="email-cv-button"
                >
                  Email Your CV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}