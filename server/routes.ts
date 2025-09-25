import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertCartItemSchema,
  insertOrderSchema,
  insertReviewSchema,
  insertHomeSectionSchema,
  insertUserSchema,
  loginSchema,
  registerSchema
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Check username availability
      const existingUsername = await storage.getUserByUsername(validData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(validData.password, saltRounds);

      // Create user (remove confirmPassword from data)
      const { confirmPassword, ...userData } = validData;
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid registration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validData.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid login data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Get current user endpoint (for refreshing user data)
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId || userId === 'guest') {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, featured, search } = req.query;
      const filters = {
        categoryId: categoryId as string,
        featured: featured === "true" ? true : featured === "false" ? false : undefined,
        search: search as string,
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const updates = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Reviews
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:productId/reviews", async (req, res) => {
    try {
      const validData = insertReviewSchema.parse({
        ...req.body,
        productId: req.params.productId,
      });
      const review = await storage.createReview(validData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  // Cart - Session-based for now (in production would use user authentication)
  app.get("/api/cart", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const userId = req.body.userId || "guest";
      const validData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const cartItem = await storage.addToCart(validData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const deleted = await storage.removeFromCart(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  const createOrderSchema = z.object({
    userId: z.string().default("guest"),
    paymentMethod: z.enum(["cod", "mobile_money", "bank_transfer"]),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      region: z.string(),
      country: z.string().default("Ghana"),
    }),
    phone: z.string(),
    notes: z.string().optional(),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.string(),
      productName: z.string(),
      productImage: z.string().optional(),
    })),
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validData = createOrderSchema.parse(req.body);
      
      // Calculate total amount
      const totalAmount = validData.items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity, 
        0
      ).toFixed(2);

      const orderData = {
        userId: validData.userId,
        status: "pending",
        paymentMethod: validData.paymentMethod,
        paymentStatus: validData.paymentMethod === "cod" ? "pending" : "pending",
        totalAmount,
        shippingAddress: validData.shippingAddress,
        phone: validData.phone,
        notes: validData.notes,
      };

      const order = await storage.createOrder(orderData, validData.items.map(item => ({ ...item, orderId: '' })));
      
      // Clear cart after successful order
      await storage.clearCart(validData.userId);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Home Sections (Admin only)
  app.get("/api/home-sections", async (req, res) => {
    try {
      const sections = await storage.getHomeSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch home sections" });
    }
  });

  app.get("/api/home-sections/:id", async (req, res) => {
    try {
      const section = await storage.getHomeSection(req.params.id);
      if (!section) {
        return res.status(404).json({ error: "Home section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch home section" });
    }
  });

  app.post("/api/home-sections", async (req, res) => {
    try {
      const validData = insertHomeSectionSchema.parse(req.body);
      const section = await storage.createHomeSection(validData);
      res.status(201).json(section);
    } catch (error) {
      res.status(400).json({ error: "Invalid home section data" });
    }
  });

  app.put("/api/home-sections/:id", async (req, res) => {
    try {
      const validData = insertHomeSectionSchema.partial().parse(req.body);
      const section = await storage.updateHomeSection(req.params.id, validData);
      if (!section) {
        return res.status(404).json({ error: "Home section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(400).json({ error: "Invalid home section data" });
    }
  });

  app.delete("/api/home-sections/:id", async (req, res) => {
    try {
      const success = await storage.deleteHomeSection(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Home section not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete home section" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
