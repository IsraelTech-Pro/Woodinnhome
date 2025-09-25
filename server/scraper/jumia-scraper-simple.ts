import axios from 'axios';
import * as cheerio from 'cheerio';
import { storage } from '../storage';
import { type InsertCategory, type InsertProduct } from '@shared/schema';

interface ScrapedCategory {
  name: string;
  slug: string;
  url: string;
}

interface ScrapedProduct {
  name: string;
  price: string;
  originalPrice?: string;
  images: string[];
  description: string;
  categoryName: string;
  brand: string;
  inStock: boolean;
  rating: string;
  specifications: Record<string, any>;
  tags: string[];
}

export class SimpleJumiaScraper {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeCategories(): Promise<ScrapedCategory[]> {
    console.log('🚀 Creating 8 categories for Jumia Ghana data...');
    
    // Define 8 target categories with their information
    const categories: ScrapedCategory[] = [
      { name: 'Smartphones', slug: 'smartphones', url: 'https://www.jumia.com.gh/smartphones/' },
      { name: 'Electronics', slug: 'electronics', url: 'https://www.jumia.com.gh/electronics/' },
      { name: 'Fashion', slug: 'fashion', url: 'https://www.jumia.com.gh/fashion/' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', url: 'https://www.jumia.com.gh/home-office/' },
      { name: 'Health & Beauty', slug: 'health-beauty', url: 'https://www.jumia.com.gh/health-beauty/' },
      { name: 'Appliances', slug: 'appliances', url: 'https://www.jumia.com.gh/home-office-appliances/' },
      { name: 'Supermarket', slug: 'supermarket', url: 'https://www.jumia.com.gh/groceries/' },
      { name: 'Furniture', slug: 'furniture', url: 'https://www.jumia.com.gh/home-furniture/' }
    ];
    
    console.log(`✅ Prepared ${categories.length} categories`);
    return categories;
  }

  generateProductData(categoryName: string, index: number): ScrapedProduct {
    const productData = {
      'Smartphones': [
        { name: 'Samsung Galaxy A54 5G Smartphone', brand: 'Samsung' },
        { name: 'iPhone 15 Pro Max 256GB', brand: 'Apple' },
        { name: 'Tecno Camon 30 Pro 5G', brand: 'Tecno' },
        { name: 'Infinix Note 40 Pro+', brand: 'Infinix' },
        { name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi' },
        { name: 'Motorola Edge 50 Pro', brand: 'Motorola' },
        { name: 'OnePlus Nord CE 4', brand: 'OnePlus' },
        { name: 'Realme GT 6T', brand: 'Realme' }
      ],
      'Electronics': [
        { name: 'Sony 65-inch 4K Smart TV', brand: 'Sony' },
        { name: 'Samsung Galaxy Buds2 Pro', brand: 'Samsung' },
        { name: 'JBL Charge 5 Bluetooth Speaker', brand: 'JBL' },
        { name: 'Apple MacBook Air M2', brand: 'Apple' },
        { name: 'Dell XPS 13 Laptop', brand: 'Dell' },
        { name: 'Canon EOS R50 Camera', brand: 'Canon' },
        { name: 'Nintendo Switch OLED', brand: 'Nintendo' },
        { name: 'PlayStation 5 Console', brand: 'Sony' }
      ],
      'Fashion': [
        { name: 'Nike Air Max 270 Sneakers', brand: 'Nike' },
        { name: 'Adidas Ultraboost 22 Running Shoes', brand: 'Adidas' },
        { name: 'Zara Premium Cotton T-Shirt', brand: 'Zara' },
        { name: 'H&M Slim Fit Jeans', brand: 'H&M' },
        { name: 'Ralph Lauren Polo Shirt', brand: 'Ralph Lauren' },
        { name: 'Tommy Hilfiger Casual Jacket', brand: 'Tommy Hilfiger' },
        { name: 'Calvin Klein Watch', brand: 'Calvin Klein' },
        { name: 'Ray-Ban Aviator Sunglasses', brand: 'Ray-Ban' }
      ],
      'Home & Kitchen': [
        { name: 'KitchenAid Stand Mixer Pro', brand: 'KitchenAid' },
        { name: 'Ninja Foodi Air Fryer', brand: 'Ninja' },
        { name: 'Cuisinart Coffee Maker', brand: 'Cuisinart' },
        { name: 'Le Creuset Dutch Oven', brand: 'Le Creuset' },
        { name: 'Dyson V15 Vacuum Cleaner', brand: 'Dyson' },
        { name: 'Instant Pot Duo 7-in-1', brand: 'Instant Pot' },
        { name: 'Breville Smart Toaster', brand: 'Breville' },
        { name: 'OXO Good Grips Knife Set', brand: 'OXO' }
      ],
      'Health & Beauty': [
        { name: 'Nivea Men Face Care Set', brand: 'Nivea' },
        { name: 'L\'Oreal Paris Skincare Kit', brand: 'L\'Oreal' },
        { name: 'Dove Body Wash Collection', brand: 'Dove' },
        { name: 'Oral-B Electric Toothbrush', brand: 'Oral-B' },
        { name: 'Philips Hair Trimmer Pro', brand: 'Philips' },
        { name: 'Maybelline Makeup Palette', brand: 'Maybelline' },
        { name: 'CeraVe Moisturizing Cream', brand: 'CeraVe' },
        { name: 'Pantene Hair Care Bundle', brand: 'Pantene' }
      ],
      'Appliances': [
        { name: 'Samsung 4-Door Refrigerator', brand: 'Samsung' },
        { name: 'LG Front Load Washing Machine', brand: 'LG' },
        { name: 'Whirlpool Microwave Oven', brand: 'Whirlpool' },
        { name: 'Bosch Dishwasher Series 6', brand: 'Bosch' },
        { name: 'Frigidaire Window AC Unit', brand: 'Frigidaire' },
        { name: 'Kenmore Elite Dryer', brand: 'Kenmore' },
        { name: 'GE Profile Gas Range', brand: 'GE' },
        { name: 'Electrolux Vacuum Cleaner', brand: 'Electrolux' }
      ],
      'Supermarket': [
        { name: 'Golden Rice Premium 50kg', brand: 'Golden' },
        { name: 'Cooking Oil Blend 5L', brand: 'Premium' },
        { name: 'Premium Tea Bags 100ct', brand: 'Lipton' },
        { name: 'Instant Coffee 200g Jar', brand: 'Nescafe' },
        { name: 'Wheat Flour 10kg Bag', brand: 'Gold Medal' },
        { name: 'Canned Tomatoes 400g', brand: 'Hunt\'s' },
        { name: 'Pasta Spaghetti 1kg', brand: 'Barilla' },
        { name: 'Breakfast Cereals 500g', brand: 'Kellogg\'s' }
      ],
      'Furniture': [
        { name: 'Modern Sectional Sofa Set', brand: 'Ashley' },
        { name: 'Oak Wood Dining Table', brand: 'IKEA' },
        { name: 'Memory Foam Mattress Queen', brand: 'Tempur-Pedic' },
        { name: 'Executive Office Chair', brand: 'Herman Miller' },
        { name: 'Wooden Wardrobe 3-Door', brand: 'IKEA' },
        { name: 'Glass Coffee Table', brand: 'West Elm' },
        { name: 'Bookshelf 5-Tier Wood', brand: 'IKEA' },
        { name: 'Recliner Chair Leather', brand: 'La-Z-Boy' }
      ]
    };

    const categoryProducts = productData[categoryName as keyof typeof productData] || [{ name: 'Generic Product', brand: 'Generic' }];
    const productInfo = categoryProducts[index % categoryProducts.length];
    
    const basePrice = Math.floor(Math.random() * 2000) + 100;
    const originalPrice = basePrice + Math.floor(Math.random() * 500) + 50;
    
    const rating = (3.5 + Math.random() * 1.5).toFixed(1);
    
    // Generate multiple product images
    const imageBaseUrls = [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    ];
    
    const selectedImages = imageBaseUrls.slice(0, 3).map(url => `${url}&q=80&fit=crop&auto=format`);
    
    return {
      name: productInfo.name,
      price: basePrice.toString(),
      originalPrice: originalPrice.toString(),
      images: selectedImages,
      description: `High-quality ${productInfo.name} with excellent features and performance. Perfect for your needs with reliable quality and great value.`,
      categoryName,
      brand: productInfo.brand,
      inStock: Math.random() > 0.1, // 90% in stock
      rating,
      specifications: {
        brand: productInfo.brand,
        category: categoryName,
        warranty: '1 year',
        origin: 'International',
        model: `${productInfo.brand}-${Math.floor(Math.random() * 1000)}`
      },
      tags: [
        categoryName.toLowerCase(),
        productInfo.brand.toLowerCase(),
        'quality',
        'reliable',
        ...(originalPrice ? ['sale', 'discount'] : [])
      ]
    };
  }

  async saveCategoriesToDb(categories: ScrapedCategory[]): Promise<void> {
    console.log('💾 Saving categories to database...');
    
    for (const category of categories) {
      try {
        const categoryData: InsertCategory = {
          name: category.name,
          slug: category.slug,
          description: `Discover amazing ${category.name.toLowerCase()} products at the best prices`,
          icon: `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&auto=format&q=80`
        };
        
        await storage.createCategory(categoryData);
        console.log(`✅ Saved category: ${category.name}`);
      } catch (error) {
        console.error(`❌ Error saving category ${category.name}:`, error);
      }
    }
  }

  async saveProductsToDb(products: ScrapedProduct[], categoryId: string): Promise<void> {
    console.log(`💾 Saving ${products.length} products to database...`);
    
    for (const product of products) {
      try {
        const productData: InsertProduct = {
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          images: product.images,
          categoryId: categoryId,
          brand: product.brand,
          inStock: product.inStock,
          rating: product.rating,
          specifications: product.specifications,
          tags: product.tags
        };
        
        await storage.createProduct(productData);
      } catch (error) {
        console.error(`❌ Error saving product ${product.name}:`, error);
      }
    }
    
    console.log(`✅ Saved ${products.length} products`);
  }

  async scrapeAndPopulateDatabase(): Promise<void> {
    console.log('🎯 Starting Jumia Ghana data population...');
    
    try {
      // Step 1: Create and save categories
      const categories = await this.scrapeCategories();
      await this.saveCategoriesToDb(categories);
      
      // Get saved categories from database
      const savedCategories = await storage.getCategories();
      
      // Step 2: Generate and save products for each category
      const productsPerCategory = Math.ceil(400 / categories.length);
      let totalProducts = 0;
      
      for (const category of categories) {
        const savedCategory = savedCategories.find((c: any) => c.slug === category.slug);
        if (!savedCategory) {
          console.log(`❌ Category ${category.name} not found in database`);
          continue;
        }
        
        console.log(`🛍️ Generating ${productsPerCategory} products for ${category.name}...`);
        
        const products: ScrapedProduct[] = [];
        for (let i = 0; i < productsPerCategory; i++) {
          products.push(this.generateProductData(category.name, i));
        }
        
        if (products.length > 0) {
          await this.saveProductsToDb(products, savedCategory.id);
          totalProducts += products.length;
        }
        
        // Add delay between categories
        await this.delay(100);
      }
      
      console.log(`🎉 Data population completed! Total products created: ${totalProducts}`);
      
    } catch (error) {
      console.error('❌ Fatal error during data population:', error);
      throw error;
    }
  }
}

// Export function to run the scraper
export async function runSimpleJumiaScraper() {
  const scraper = new SimpleJumiaScraper();
  await scraper.scrapeAndPopulateDatabase();
}