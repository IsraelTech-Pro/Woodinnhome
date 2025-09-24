import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Package, Users, BarChart3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type ProductWithCategory, type Category, type OrderWithItems } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string().url("Please enter valid image URLs")),
  inStock: z.boolean(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  featured: z.boolean(),
  tags: z.array(z.string()).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function Admin() {
  const { toast } = useToast();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [] } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      originalPrice: "",
      brand: "",
      categoryId: "",
      images: [],
      inStock: true,
      quantity: 0,
      featured: false,
      tags: [],
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully!" });
      setIsAddProductOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error creating product", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductForm> }) => {
      return apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully!" });
      setEditingProduct(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error updating product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error deleting product", variant: "destructive" });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order status updated!" });
    },
    onError: () => {
      toast({ title: "Error updating order status", variant: "destructive" });
    },
  });

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: ProductWithCategory) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price,
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      categoryId: product.categoryId,
      images: product.images,
      inStock: product.inStock,
      quantity: product.quantity,
      featured: product.featured,
      tags: product.tags || [],
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter((_, i) => i !== index));
  };

  const formatPrice = (price: string | number) => {
    return `GHS ${parseFloat(price.toString()).toLocaleString()}`;
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

  // Calculate statistics
  const totalRevenue = orders
    .filter(order => ["confirmed", "shipped", "delivered"].includes(order.status))
    .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(product => !product.inStock).length;

  const watchedImages = form.watch("images");
  const watchedTags = form.watch("tags");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" data-testid="admin-page-title">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Woodinn Home store</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="products" data-testid="products-tab">Products</TabsTrigger>
          <TabsTrigger value="orders" data-testid="orders-tab">Orders</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="analytics-tab">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="total-revenue">
                  {formatPrice(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">From confirmed and delivered orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="pending-orders">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="total-products">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">In your catalog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <Package className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive" data-testid="out-of-stock">
                  {outOfStockProducts}
                </div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Products</h2>
            <Dialog open={isAddProductOpen || !!editingProduct} onOpenChange={(open) => {
              if (!open) {
                setIsAddProductOpen(false);
                setEditingProduct(null);
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddProductOpen(true)} data-testid="add-product-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="product-name-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="product-brand-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="product-description-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="product-short-description-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (GHS)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} data-testid="product-price-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price (GHS)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} data-testid="product-original-price-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="product-quantity-input" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="product-category-select">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image URLs */}
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          data-testid="image-url-input"
                        />
                        <Button type="button" onClick={addImageUrl} data-testid="add-image-button">
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {watchedImages?.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <img src={url} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                            <span className="flex-1 text-sm truncate">{url}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeImage(index)}
                              data-testid={`remove-image-${index}`}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          data-testid="tag-input"
                        />
                        <Button type="button" onClick={addTag} data-testid="add-tag-button">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {watchedTags?.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => removeTag(index)}
                            data-testid={`tag-${index}`}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                data-testid="in-stock-checkbox"
                              />
                            </FormControl>
                            <FormLabel>In Stock</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                data-testid="featured-checkbox"
                              />
                            </FormControl>
                            <FormLabel>Featured Product</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddProductOpen(false);
                          setEditingProduct(null);
                          form.reset();
                        }}
                        data-testid="cancel-product-button"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        data-testid="save-product-button"
                      >
                        {createProductMutation.isPending || updateProductMutation.isPending 
                          ? "Saving..." 
                          : (editingProduct ? "Update" : "Create") + " Product"
                        }
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Products List */}
          <div className="grid gap-4">
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} data-testid={`admin-product-${product.id}`}>
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                              data-testid={`edit-product-${product.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-destructive"
                              data-testid={`delete-product-${product.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                        
                        <div className="flex gap-2">
                          <Badge variant={product.inStock ? "secondary" : "destructive"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          {product.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-6">Start by adding your first product.</p>
                  <Button onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <h2 className="text-2xl font-bold">Orders Management</h2>
          
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} data-testid={`admin-order-${order.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : 
                           order.paymentMethod === "mobile_money" ? "Mobile Money" : "Bank Transfer"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Items:</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <img 
                            src={item.productImage || '/placeholder.jpg'} 
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Customer Info:</h4>
                        <p className="text-muted-foreground">
                          Phone: {order.phone}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Delivery Address:</h4>
                        <p className="text-muted-foreground">
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
                    </div>

                    {order.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      
                      <Select 
                        value={order.status} 
                        onValueChange={(status) => updateOrderStatusMutation.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger className="w-48" data-testid={`order-status-select-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">Orders will appear here when customers start placing them.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => {
                    const count = orders.filter(order => order.status === status).length;
                    const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const productCount = products.filter(product => product.categoryId === category.id).length;
                    const percentage = products.length > 0 ? (productCount / products.length) * 100 : 0;
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-secondary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{productCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {orders.filter(order => order.status === "delivered").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(totalRevenue / orders.filter(order => order.status === "delivered").length || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {((orders.filter(order => order.status === "delivered").length / orders.length) * 100 || 0).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
