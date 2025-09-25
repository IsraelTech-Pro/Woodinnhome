import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, CheckCircle, XCircle, User, MapPin, Phone, Mail, Calendar, Shield, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/auth-modal";
import { type OrderWithItems } from "@shared/schema";

export default function Account() {
  const { user, userId, refreshUser } = useAuthStore();
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Refresh user data on mount to get latest admin status
  useEffect(() => {
    if (user && userId !== 'guest') {
      refreshUser();
    }
  }, [refreshUser, user, userId]);

  // Check for order highlight from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    if (orderId) {
      setHighlightedOrderId(orderId);
      // Remove the parameter after a few seconds
      setTimeout(() => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('order');
        window.history.replaceState({}, '', newUrl.toString());
        setHighlightedOrderId(null);
      }, 5000);
    }
  }, []);

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders", { userId }],
  });

  const formatPrice = (price: string | number) => {
    return `GHS ${parseFloat(price.toString()).toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
      case "shipped":
        return <Package className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "mobile_money":
        return "Mobile Money";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 w-48 rounded"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" data-testid="account-page-title">My Account</h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="orders" data-testid="orders-tab">Orders</TabsTrigger>
          <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" data-testid="orders-section-title">Order History</h2>
            {orders.length > 0 && (
              <p className="text-muted-foreground" data-testid="orders-count">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2" data-testid="no-orders-title">No orders yet</h3>
                <p className="text-muted-foreground mb-6" data-testid="no-orders-description">
                  When you place your first order, it will appear here.
                </p>
                <Button onClick={() => window.location.href = "/products"} data-testid="start-shopping-button">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`${
                    highlightedOrderId === order.id ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
                  data-testid={`order-${order.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)} data-testid={`order-status-${order.id}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4" data-testid={`order-item-${item.id}`}>
                          <img 
                            src={item.productImage || '/placeholder.jpg'} 
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.price)}</p>
                            <p className="text-sm text-muted-foreground">each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Payment Method</p>
                          <p className="text-muted-foreground" data-testid={`order-payment-${order.id}`}>
                            {getPaymentMethodDisplay(order.paymentMethod)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Delivery Address</p>
                          <p className="text-muted-foreground" data-testid={`order-address-${order.id}`}>
                            {typeof order.shippingAddress === 'object' && order.shippingAddress ? (
                              <>
                                {(order.shippingAddress as any).street}<br />
                                {(order.shippingAddress as any).city}, {(order.shippingAddress as any).region}
                              </>
                            ) : (
                              'Address not available'
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-primary" data-testid={`order-total-${order.id}`}>
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {highlightedOrderId === order.id && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-5 w-5" />
                          <p className="font-medium">Order placed successfully!</p>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          We'll contact you shortly to confirm your order details.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-2xl font-bold" data-testid="profile-section-title">Profile Information</h2>
          
          {!user || userId === 'guest' ? (
            // Guest user state
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Welcome, Guest!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You're currently shopping as a guest. Create an account to enjoy personalized features and track your orders.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <Package className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">Order Tracking</h4>
                      <p className="text-xs text-muted-foreground">Track your orders easily</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <User className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">Personal Profile</h4>
                      <p className="text-xs text-muted-foreground">Save your preferences</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setAuthModalOpen(true)}
                      className="w-full sm:w-auto"
                      data-testid="create-account-button"
                    >
                      Create Account
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setAuthModalOpen(true)}
                      className="w-full sm:w-auto"
                      data-testid="login-account-button"
                    >
                      Login to Existing Account
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="font-medium text-muted-foreground">Current Session</Label>
                  <p className="text-lg" data-testid="account-type">Guest User</p>
                  <p className="text-sm text-muted-foreground">
                    Orders placed: {orders.length}
                  </p>
                </div>
                
                <AuthModal 
                  open={authModalOpen} 
                  onOpenChange={setAuthModalOpen}
                  defaultTab="register"
                />
              </CardContent>
            </Card>
          ) : (
            // Authenticated user state
            <>
              {/* User Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-orange-400 to-red-500 text-white">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold" data-testid="user-full-name">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-muted-foreground" data-testid="user-username">
                          @{user.username}
                        </p>
                        {user.isAdmin && (
                          <Badge className="bg-orange-100 text-orange-800 mt-2" data-testid="admin-badge">
                            <Shield className="h-3 w-3 mr-1" />
                            Administrator
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <Button variant="outline" size="sm" data-testid="edit-profile-button">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <p className="text-lg" data-testid="user-email">{user.email}</p>
                      </div>
                      
                      {user.phone && (
                        <div>
                          <Label className="font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </Label>
                          <p className="text-lg" data-testid="user-phone">{user.phone}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Member Since
                        </Label>
                        <p className="text-lg" data-testid="user-join-date">
                          {new Date(user.createdAt).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="font-medium text-muted-foreground">Orders Placed</Label>
                        <p className="text-lg" data-testid="total-orders">{orders.length}</p>
                        <p className="text-sm text-muted-foreground">
                          Total orders in your account
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => window.location.href = "/products"}
                  data-testid="continue-shopping-profile"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => window.open('https://wa.me/233000000000', '_blank')}
                  data-testid="contact-support"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Delivery Areas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nsawam - Same day delivery</li>
                    <li>• Adoagyiri - Next day delivery</li>
                    <li>• Suhum - Next day delivery</li>
                    <li>• Other Eastern Region areas - 2-3 days</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Delivery Fees</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Orders over GHS 500: FREE delivery</li>
                    <li>• Orders under GHS 500: GHS 25 delivery fee</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}
