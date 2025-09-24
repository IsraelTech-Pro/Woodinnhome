import { db } from "../server/db";
import { categories, products } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await db.delete(products);
    await db.delete(categories);

    // Seed categories
    const [furniture, electronics, homeDecor] = await db.insert(categories).values([
      {
        name: "Furniture",
        description: "Chairs, Tables, Beds, and more",
        icon: "M3.75 21h16.5M4.5 3h15l-.75 13.5H5.25L4.5 3zm0 0-.375-1.125A1.125 1.125 0 0 0 2.25 3v0",
        slug: "furniture"
      },
      {
        name: "Electronics",
        description: "TVs, Fridges, Fans, and appliances",
        icon: "M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        slug: "electronics"
      },
      {
        name: "Home Decor",
        description: "Lamps, Curtains, Art, and decorative items",
        icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
        slug: "home-decor"
      }
    ]).returning();

    console.log("✅ Categories seeded:", { furniture: furniture.id, electronics: electronics.id, homeDecor: homeDecor.id });

    // Seed featured products
    await db.insert(products).values([
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        name: "Office Swivel Chair",
        description: "Ergonomic office chair with lumbar support and adjustable height. Perfect for home office or study room with breathable mesh material.",
        shortDescription: "Ergonomic office chair with lumbar support",
        price: "320.00",
        originalPrice: "380.00",
        brand: "Office Pro",
        categoryId: furniture.id,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        specifications: {
          "Material": "Mesh and plastic",
          "Weight Capacity": "120kg",
          "Height Adjustment": "Yes",
          "Armrests": "Fixed",
          "Wheels": "5 wheels"
        },
        inStock: true,
        quantity: 12,
        featured: false,
        rating: "4.4",
        reviewCount: 8,
        tags: ["office chair", "ergonomic", "mesh", "swivel"]
      },
      {
        name: "Smart TV 55 inch",
        description: "Samsung 55-inch Smart TV with 4K Ultra HD resolution, built-in WiFi, and streaming apps. Experience crystal clear picture quality.",
        shortDescription: "Samsung 55-inch 4K Smart TV",
        price: "3200.00",
        originalPrice: "3800.00",
        brand: "Samsung",
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        specifications: {
          "Screen Size": "55 inches",
          "Resolution": "4K Ultra HD",
          "Smart Features": "Yes",
          "WiFi": "Built-in",
          "HDMI Ports": "3"
        },
        inStock: true,
        quantity: 7,
        featured: true,
        rating: "4.9",
        reviewCount: 42,
        tags: ["smart tv", "4k", "samsung", "wifi"]
      },
      {
        name: "Decorative Wall Mirror",
        description: "Beautiful round wall mirror with decorative frame. Adds elegance to any room while making spaces appear larger and brighter.",
        shortDescription: "Beautiful round decorative wall mirror",
        price: "89.00",
        brand: "Home Decor Plus",
        categoryId: homeDecor.id,
        images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        specifications: {
          "Shape": "Round",
          "Diameter": "60cm",
          "Frame Material": "Metal",
          "Mounting": "Wall hanging",
          "Weight": "2.5kg"
        },
        inStock: true,
        quantity: 25,
        featured: false,
        rating: "4.3",
        reviewCount: 15,
        tags: ["wall mirror", "decorative", "round", "metal frame"]
      },
      {
        name: "Kitchen Blender",
        description: "High-power kitchen blender perfect for smoothies, soups, and crushing ice. Multiple speed settings with durable stainless steel blades.",
        shortDescription: "High-power kitchen blender for smoothies",
        price: "180.00",
        originalPrice: "220.00",
        brand: "Kitchen Pro",
        categoryId: electronics.id,
        images: ["https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        specifications: {
          "Power": "1000W",
          "Capacity": "1.5L",
          "Speed Settings": "5",
          "Blade Material": "Stainless Steel",
          "Ice Crushing": "Yes"
        },
        inStock: true,
        quantity: 18,
        featured: false,
        rating: "4.5",
        reviewCount: 22,
        tags: ["blender", "kitchen", "smoothies", "high power"]
      }
    ]);

    console.log("✅ Products seeded successfully!");
    console.log("🎉 Database seeding completed!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});