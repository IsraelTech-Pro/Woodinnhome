import { 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithCategory,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem,
  type CartItemWithProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithItems,
  type HomeSection,
  type InsertHomeSection,
  users,
  categories,
  products,
  reviews,
  cartItems,
  orders,
  orderItems,
  homeSections
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string }): Promise<ProductWithCategory[]>;
  getProduct(id: string): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;

  // Orders
  getOrders(userId?: string): Promise<OrderWithItems[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Home Sections
  getHomeSections(): Promise<HomeSection[]>;
  getHomeSection(id: string): Promise<HomeSection | undefined>;
  createHomeSection(section: InsertHomeSection): Promise<HomeSection>;
  updateHomeSection(id: string, updates: Partial<InsertHomeSection>): Promise<HomeSection | undefined>;
  deleteHomeSection(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private reviews: Map<string, Review> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();
  private homeSections: Map<string, HomeSection> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const furniture = this.createCategorySync({
      name: "Furniture",
      description: "Chairs, Tables, Beds, and more",
      icon: "M3.75 21h16.5M4.5 3h15l-.75 13.5H5.25L4.5 3zm0 0-.375-1.125A1.125 1.125 0 0 0 2.25 3v0",
      slug: "furniture"
    });

    const electronics = this.createCategorySync({
      name: "Electronics",
      description: "TVs, Fridges, Fans, and appliances",
      icon: "M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      slug: "electronics"
    });

    const homeDecor = this.createCategorySync({
      name: "Home Decor",
      description: "Lamps, Curtains, Art, and decorative items",
      icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
      slug: "home-decor"
    });

    // Seed featured products
    this.createProductSync({
      name: "Modern Ceiling Fan",
      description: "Energy-efficient ceiling fan with LED lighting and remote control. Perfect for Ghanaian homes with variable speed settings and silent operation.",
      shortDescription: "Energy-efficient ceiling fan with LED lighting",
      price: "480.00",
      originalPrice: "520.00",
      brand: "Premium Brand",
      categoryId: electronics.id,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      specifications: {
        "Power": "75W",
        "Blade Span": "52 inches",
        "Speed Settings": "6",
        "Remote Control": "Yes",
        "LED Light": "18W"
      },
      inStock: true,
      quantity: 15,
      featured: true,
      rating: "4.8",
      reviewCount: 24,
      tags: ["ceiling fan", "led", "remote control", "energy efficient"]
    });

    this.createProductSync({
      name: "Wooden Dining Table",
      description: "Handcrafted solid wood dining table seats 6 people comfortably. Made from local hardwood with beautiful natural grain patterns.",
      shortDescription: "Handcrafted solid wood dining table for 6",
      price: "1200.00",
      brand: "Local Craft",
      categoryId: furniture.id,
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      specifications: {
        "Material": "Solid Hardwood",
        "Dimensions": "180cm x 90cm x 75cm",
        "Seating": "6 people",
        "Finish": "Natural oil finish",
        "Weight": "45kg"
      },
      inStock: true,
      quantity: 8,
      featured: true,
      rating: "4.9",
      reviewCount: 18,
      tags: ["dining table", "wood", "handcrafted", "6 seater"]
    });

    this.createProductSync({
      name: "Double Door Refrigerator",
      description: "Samsung double door refrigerator with frost-free technology, large capacity perfect for Ghanaian families. Energy efficient with 5-star rating.",
      shortDescription: "Samsung double door frost-free refrigerator",
      price: "2890.00",
      originalPrice: "3400.00",
      brand: "Samsung",
      categoryId: electronics.id,
      images: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      specifications: {
        "Capacity": "465L",
        "Type": "Double Door",
        "Defrosting": "Frost Free",
        "Energy Rating": "5 Star",
        "Warranty": "10 years compressor"
      },
      inStock: true,
      quantity: 5,
      featured: true,
      rating: "4.7",
      reviewCount: 31,
      tags: ["refrigerator", "samsung", "frost free", "energy efficient"]
    });

    this.createProductSync({
      name: "Designer Table Lamp",
      description: "Modern designer table lamp with adjustable brightness and contemporary design. Perfect accent lighting for any room.",
      shortDescription: "Modern designer table lamp with adjustable brightness",
      price: "150.00",
      brand: "Modern Style",
      categoryId: homeDecor.id,
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      specifications: {
        "Material": "Metal and fabric",
        "Height": "65cm",
        "Bulb Type": "LED",
        "Switch": "Touch control",
        "Power": "12W"
      },
      inStock: true,
      quantity: 20,
      featured: true,
      rating: "4.6",
      reviewCount: 12,
      tags: ["table lamp", "designer", "led", "touch control"]
    });
  }

  private createCategorySync(category: InsertCategory): Category {
    const id = randomUUID();
    const newCategory: Category = { 
      ...category, 
      id,
      description: category.description || null 
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  private createProductSync(product: InsertProduct): Product {
    const id = randomUUID();
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now,
      quantity: product.quantity || 0,
      brand: product.brand || null,
      shortDescription: product.shortDescription || null,
      originalPrice: product.originalPrice || null,
      tags: product.tags || null,
      specifications: product.specifications || null,
      inStock: product.inStock !== undefined ? product.inStock : true,
      featured: product.featured !== undefined ? product.featured : false,
      rating: product.rating || "0",
      reviewCount: product.reviewCount || 0
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      isAdmin: false,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null 
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string }): Promise<ProductWithCategory[]> {
    let products = Array.from(this.products.values());

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }

    return products.map(product => {
      const category = this.categories.get(product.categoryId);
      return { ...product, category: category! };
    });
  }

  async getProduct(id: string): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const category = this.categories.get(product.categoryId);
    return { ...product, category: category! };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: now,
      quantity: insertProduct.quantity || 0,
      brand: insertProduct.brand || null,
      shortDescription: insertProduct.shortDescription || null,
      originalPrice: insertProduct.originalPrice || null,
      tags: insertProduct.tags || null,
      specifications: insertProduct.specifications || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : false,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const now = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: now,
      verified: false,
      title: insertReview.title || null,
      comment: insertReview.comment || null
    };
    this.reviews.set(id, review);
    return review;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => {
      const product = this.products.get(item.productId);
      return { ...item, product: product! };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existing = Array.from(this.cartItems.values()).find(
      item => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existing) {
      existing.quantity += insertItem.quantity;
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const now = new Date();
    const item: CartItem = { 
      ...insertItem, 
      id, 
      createdAt: now
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
  }

  // Orders
  async getOrders(userId?: string): Promise<OrderWithItems[]> {
    let orders = Array.from(this.orders.values());
    
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }

    return orders.map(order => {
      const items = Array.from(this.orderItems.values())
        .filter(item => item.orderId === order.id)
        .map(item => {
          const product = this.products.get(item.productId);
          return { ...item, product: product! };
        });
      return { ...order, items };
    });
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        return { ...item, product: product! };
      });

    return { ...order, items };
  }

  async createOrder(insertOrder: InsertOrder, insertItems: InsertOrderItem[]): Promise<Order> {
    const orderId = randomUUID();
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id: orderId, 
      createdAt: now,
      notes: insertOrder.notes || null
    };
    this.orders.set(orderId, order);

    // Create order items
    insertItems.forEach(insertItem => {
      const itemId = randomUUID();
      const item: OrderItem = { 
        ...insertItem, 
        id: itemId, 
        orderId,
        productImage: insertItem.productImage || null
      };
      this.orderItems.set(itemId, item);
    });

    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // Home Sections
  async getHomeSections(): Promise<HomeSection[]> {
    return Array.from(this.homeSections.values())
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .filter(section => section.isActive);
  }

  async getHomeSection(id: string): Promise<HomeSection | undefined> {
    return this.homeSections.get(id);
  }

  async createHomeSection(insertSection: InsertHomeSection): Promise<HomeSection> {
    const sectionId = randomUUID();
    const now = new Date();
    const section: HomeSection = { 
      ...insertSection, 
      id: sectionId, 
      subtitle: insertSection.subtitle || null,
      isActive: insertSection.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    this.homeSections.set(sectionId, section);
    return section;
  }

  async updateHomeSection(id: string, updates: Partial<InsertHomeSection>): Promise<HomeSection | undefined> {
    const section = this.homeSections.get(id);
    if (!section) return undefined;

    const updatedSection = { 
      ...section, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.homeSections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteHomeSection(id: string): Promise<boolean> {
    return this.homeSections.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Products
  async getProducts(filters?: { categoryId?: string; featured?: boolean; search?: string }): Promise<ProductWithCategory[]> {
    const baseQuery = db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const conditions = [];

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm),
          ilike(products.brand, searchTerm)
        )
      );
    }

    const result = conditions.length > 0 
      ? await baseQuery.where(and(...conditions))
      : await baseQuery;
    
    return result.map(({ products: product, categories: category }) => ({
      ...product,
      category: category!
    }));
  }

  async getProduct(id: string): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!result) return undefined;

    return {
      ...result.products,
      category: result.categories!
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const result = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return result.map(({ cart_items: cartItem, products: product }) => ({
      ...cartItem,
      product: product!
    }));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, insertItem.userId),
          eq(cartItems.productId, insertItem.productId)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + insertItem.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [item] = await db.insert(cartItems).values(insertItem).returning();
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Orders
  async getOrders(userId?: string): Promise<OrderWithItems[]> {
    const orderResults = userId 
      ? await db.select().from(orders).where(eq(orders.userId, userId))
      : await db.select().from(orders);
    
    // Get order items for all orders
    const orderIds = orderResults.map(order => order.id);
    const itemsResult = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(orderIds.length > 0 ? or(...orderIds.map(id => eq(orderItems.orderId, id))) : eq(orderItems.orderId, ""));

    // Group items by order
    const itemsByOrder = itemsResult.reduce((acc, { order_items: item, products: product }) => {
      if (!acc[item.orderId]) acc[item.orderId] = [];
      acc[item.orderId].push({ ...item, product: product! });
      return acc;
    }, {} as Record<string, (OrderItem & { product: Product })[]>);

    return orderResults.map(order => ({
      ...order,
      items: itemsByOrder[order.id] || []
    }));
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const itemsResult = await db
      .select()
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    const items = itemsResult.map(({ order_items: item, products: product }) => ({
      ...item,
      product: product!
    }));

    return { ...order, items };
  }

  async createOrder(insertOrder: InsertOrder, insertItems: InsertOrderItem[]): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();

    // Create order items
    const itemsWithOrderId = insertItems.map(item => ({
      ...item,
      orderId: order.id
    }));
    
    await db.insert(orderItems).values(itemsWithOrderId);

    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Home Sections
  async getHomeSections(): Promise<HomeSection[]> {
    return await db
      .select()
      .from(homeSections)
      .where(eq(homeSections.isActive, true))
      .orderBy(homeSections.displayOrder);
  }

  async getHomeSection(id: string): Promise<HomeSection | undefined> {
    const [section] = await db.select().from(homeSections).where(eq(homeSections.id, id));
    return section || undefined;
  }

  async createHomeSection(insertSection: InsertHomeSection): Promise<HomeSection> {
    const [section] = await db.insert(homeSections).values(insertSection).returning();
    return section;
  }

  async updateHomeSection(id: string, updates: Partial<InsertHomeSection>): Promise<HomeSection | undefined> {
    const [section] = await db
      .update(homeSections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(homeSections.id, id))
      .returning();
    return section || undefined;
  }

  async deleteHomeSection(id: string): Promise<boolean> {
    const result = await db.delete(homeSections).where(eq(homeSections.id, id));
    return (result.rowCount || 0) > 0;
  }
}

// Use DatabaseStorage for production, keeping MemStorage for development fallback
export const storage = new DatabaseStorage();
