import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from '../db.js';
import { products, categories } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

// Category mapping from Amazon categories to our categories
const categoryMapping: Record<string, string> = {
  // Electronics & Tech
  'Electronics': 'electronics',
  'Cell Phones & Accessories': 'smartphones', 
  'Computers & Accessories': 'computing',
  'Video Games': 'gaming',
  'Camera & Photo': 'electronics',
  
  // Fashion & Clothing
  'Clothing, Shoes & Jewelry': 'fashion',
  'Men': 'fashion',
  'Women': 'fashion',
  'Clothing': 'fashion',
  'Shoes': 'fashion',
  'Jewelry': 'fashion',
  'Watches': 'fashion',
  
  // Home & Garden
  'Home & Kitchen': 'home-kitchen',
  'Kitchen & Dining': 'home-kitchen',
  'Tools & Home Improvement': 'home-kitchen',
  'Garden & Outdoor': 'home-kitchen',
  'Patio, Lawn & Garden': 'home-kitchen',
  'Home & Garden': 'home-kitchen',
  'Furniture': 'furniture',
  
  // Health & Beauty
  'Health & Household': 'health-beauty',
  'Health & Personal Care': 'health-beauty',
  'Beauty & Personal Care': 'health-beauty',
  'Health, Household & Baby Care': 'health-beauty',
  'Personal Care': 'health-beauty',
  
  // Sports & Automotive  
  'Sports & Outdoors': 'sports-fitness',
  'Exercise & Fitness': 'sports-fitness',
  'Outdoor Recreation': 'sports-fitness',
  'Automotive': 'automobiles',
  'Automotive Parts & Accessories': 'automobiles',
  
  // Grocery & Food
  'Grocery & Gourmet Food': 'supermarket',
  'Grocery': 'supermarket',
  'Pantry Staples': 'supermarket',
  'Beverages': 'supermarket',
  'Food & Beverage': 'supermarket',
  
  // Baby & Kids
  'Baby Products': 'baby-products',
  'Baby': 'baby-products',
  'Baby & Child Care': 'baby-products',
  
  // Books & Media
  'Books': 'books-media',
  'Movies & TV': 'books-media',
  'Music': 'books-media',
  'CDs & Vinyl': 'books-media',
  
  // Appliances
  'Major Appliances': 'appliances',
  'Small Appliances': 'appliances',
  'Kitchen Appliances': 'appliances',
  'Home Appliances': 'appliances',
  'Appliances': 'appliances',
};

// Category-based image mapping (using our existing system)
const categoryImages: Record<string, string[]> = {
  'smartphones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=600&fit=crop'
  ],
  'electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=600&fit=crop'
  ],
  'fashion': [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop'
  ],
  'furniture': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop'
  ],
  'computing': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop'
  ],
  'gaming': [
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop'
  ],
  'home-kitchen': [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&h=600&fit=crop'
  ],
  'health-beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&h=600&fit=crop'
  ],
  'sports-fitness': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553969420-fb915228af51?w=800&h=600&fit=crop'
  ],
  'automobiles': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop'
  ],
  'appliances': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603885015687-77c10b3e400c?w=800&h=600&fit=crop'
  ],
  'baby-products': [
    'https://images.unsplash.com/photo-1544824349-7ad70c4abb47?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop'
  ],
  'books-media': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop'
  ],
  'supermarket': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop'
  ]
};

function cleanPrice(priceStr: string | null): number {
  if (!priceStr || priceStr === 'null') return 0;
  
  // Remove quotes and parse as float
  const cleanStr = priceStr.replace(/['"]/g, '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

function parseCategories(categoryStr: string): string[] {
  if (!categoryStr || categoryStr === 'null') return [];
  
  try {
    // Handle categories like ["Electronics","Cell Phones"]
    const cleaned = categoryStr.replace(/^\[|\]$/g, '').replace(/"/g, '');
    return cleaned.split(',').map((cat: string) => cat.trim()).filter((cat: string) => cat.length > 0);
  } catch (error) {
    return [];
  }
}

function mapToOurCategory(amazonCategories: string[]): string {
  // Try to find the best match from Amazon categories to our categories
  for (const amazonCat of amazonCategories) {
    const ourCat = categoryMapping[amazonCat];
    if (ourCat) return ourCat;
  }
  
  // Default mapping based on keywords
  const allCatsStr = amazonCategories.join(' ').toLowerCase();
  
  if (allCatsStr.includes('phone') || allCatsStr.includes('mobile')) return 'smartphones';
  if (allCatsStr.includes('computer') || allCatsStr.includes('laptop')) return 'computing';
  if (allCatsStr.includes('clothing') || allCatsStr.includes('fashion')) return 'fashion';
  if (allCatsStr.includes('home') || allCatsStr.includes('kitchen')) return 'home-kitchen';
  if (allCatsStr.includes('health') || allCatsStr.includes('beauty')) return 'health-beauty';
  if (allCatsStr.includes('sports') || allCatsStr.includes('fitness')) return 'sports-fitness';
  if (allCatsStr.includes('auto') || allCatsStr.includes('car')) return 'automobiles';
  if (allCatsStr.includes('baby') || allCatsStr.includes('child')) return 'baby-products';
  if (allCatsStr.includes('book') || allCatsStr.includes('media')) return 'books-media';
  if (allCatsStr.includes('appliance')) return 'appliances';
  if (allCatsStr.includes('furniture')) return 'furniture';
  if (allCatsStr.includes('food') || allCatsStr.includes('grocery')) return 'supermarket';
  if (allCatsStr.includes('game') || allCatsStr.includes('gaming')) return 'gaming';
  
  // Default fallback
  return 'electronics';
}

function getRandomImageForCategory(categorySlug: string): string[] {
  const images = categoryImages[categorySlug] || categoryImages['electronics'];
  // Randomly select 1-3 images
  const numImages = Math.floor(Math.random() * 2) + 1; // 1-2 images
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numImages);
}

function cleanText(text: string): string {
  if (!text || text === 'null') return '';
  return text.replace(/^["']|["']$/g, '').trim();
}

function generateSpecifications(brand: string, description: string): Record<string, any> {
  const specs: Record<string, any> = {};
  
  if (brand && brand !== 'null') {
    specs.Brand = cleanText(brand);
  }
  
  // Extract specifications from description
  if (description && description !== 'null') {
    const desc = description.toLowerCase();
    
    // Common patterns
    if (desc.includes('waterproof')) specs.Waterproof = 'Yes';
    if (desc.includes('wireless') || desc.includes('bluetooth')) specs.Connectivity = 'Wireless';
    if (desc.includes('usb')) specs.Connectivity = 'USB';
    if (desc.includes('rechargeable')) specs.Power = 'Rechargeable Battery';
    if (desc.includes('solar')) specs.Power = 'Solar Powered';
    
    // Material mentions
    if (desc.includes('steel')) specs.Material = 'Steel';
    if (desc.includes('plastic')) specs.Material = 'Plastic';
    if (desc.includes('cotton')) specs.Material = 'Cotton';
    if (desc.includes('aluminum')) specs.Material = 'Aluminum';
  }
  
  return specs;
}

interface AmazonRecord {
  title: string;
  brand: string;
  description: string;
  initial_price: string;
  final_price: string;
  categories: string;
  rating: string;
  reviews_count: string;
  availability: string;
  asin: string;
  [key: string]: any;
}

async function importAmazonData(filePath: string, maxProducts?: number) {
  console.log('Starting Amazon data import...');
  
  try {
    // Read and parse CSV
    const fileContent = readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      quote: '"',
      escape: '"'
    }) as AmazonRecord[];
    
    console.log(`Found ${records.length} products in dataset`);
    
    // Get our existing categories
    const existingCategories = await db.select().from(categories);
    const categoryMap = new Map(existingCategories.map(cat => [cat.slug, cat.id]));
    
    let imported = 0;
    let skipped = 0;
    const productsToImport = maxProducts ? records.slice(0, maxProducts) : records;
    
    for (const record of productsToImport) {
      try {
        const title = cleanText(record.title);
        const brand = cleanText(record.brand);
        const description = cleanText(record.description);
        
        // Skip if no title
        if (!title) {
          skipped++;
          continue;
        }
        
        // Parse and clean prices
        const initialPrice = cleanPrice(record.initial_price);
        const finalPrice = cleanPrice(record.final_price);
        const price = finalPrice > 0 ? finalPrice : initialPrice;
        
        // Skip if no valid price
        if (price <= 0) {
          skipped++;
          continue;
        }
        
        // Parse categories and map to our system
        const amazonCategories = parseCategories(record.categories);
        const categorySlug = mapToOurCategory(amazonCategories);
        const categoryId = categoryMap.get(categorySlug);
        
        if (!categoryId) {
          console.warn(`Category not found: ${categorySlug}`);
          skipped++;
          continue;
        }
        
        // Get rating and reviews
        const rating = record.rating ? Math.max(0, Math.min(5, parseFloat(record.rating))) : 0;
        const reviewsCount = record.reviews_count ? parseInt(record.reviews_count) : 0;
        
        // Generate specifications
        const specifications = generateSpecifications(brand, description);
        
        // Get category-appropriate images
        const images = getRandomImageForCategory(categorySlug);
        
        // Insert product
        await db.insert(products).values({
          name: title,
          description: description || title,
          shortDescription: title.length > 100 ? title.substring(0, 97) + '...' : undefined,
          price: price.toString(),
          originalPrice: initialPrice > finalPrice ? initialPrice.toString() : undefined,
          images: images,
          categoryId: categoryId,
          inStock: record.availability?.includes('In Stock') !== false,
          brand: brand || undefined,
          rating: rating > 0 ? rating.toString() : '0',
          reviewCount: reviewsCount > 0 ? reviewsCount : 0,
          specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
          featured: Math.random() < 0.1, // 10% chance of being featured
          tags: amazonCategories.filter((cat: string) => cat.length > 0),
          quantity: Math.floor(Math.random() * 50) + 5 // Random quantity between 5-54
        });
        
        imported++;
        
        if (imported % 50 === 0) {
          console.log(`Imported ${imported} products...`);
        }
        
      } catch (error) {
        console.error(`Error importing product: ${record.title}`, error);
        skipped++;
      }
    }
    
    console.log(`\nImport completed!`);
    console.log(`- Imported: ${imported} products`);
    console.log(`- Skipped: ${skipped} products`);
    console.log(`- Total processed: ${imported + skipped} products`);
    
    return { imported, skipped };
    
  } catch (error) {
    console.error('Error importing Amazon data:', error);
    throw error;
  }
}

// Run if called directly
if (process.argv[2] === 'run') {
  const maxProducts = process.argv[3] ? parseInt(process.argv[3]) : undefined;
  importAmazonData('../attached_assets/timestamp,title,seller_name,brand,d_1758794442079.txt', maxProducts)
    .then(result => {
      console.log('Import successful:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

export { importAmazonData };