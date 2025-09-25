import puppeteer from 'puppeteer';
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

export class JumiaScraper {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeCategories(): Promise<ScrapedCategory[]> {
    console.log('🚀 Starting category scraping from Jumia Ghana...');
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const categories: ScrapedCategory[] = [];
    
    try {
      await page.goto('https://www.jumia.com.gh/', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for page to load
      await this.delay(3000);
      
      // Define target categories with their URLs
      const targetCategories = [
        { name: 'Smartphones', slug: 'smartphones', url: 'https://www.jumia.com.gh/smartphones/' },
        { name: 'Electronics', slug: 'electronics', url: 'https://www.jumia.com.gh/electronics/' },
        { name: 'Fashion', slug: 'fashion', url: 'https://www.jumia.com.gh/fashion/' },
        { name: 'Home & Kitchen', slug: 'home-kitchen', url: 'https://www.jumia.com.gh/home-office/' },
        { name: 'Health & Beauty', slug: 'health-beauty', url: 'https://www.jumia.com.gh/health-beauty/' },
        { name: 'Appliances', slug: 'appliances', url: 'https://www.jumia.com.gh/home-office-appliances/' },
        { name: 'Supermarket', slug: 'supermarket', url: 'https://www.jumia.com.gh/groceries/' },
        { name: 'Furniture', slug: 'furniture', url: 'https://www.jumia.com.gh/home-furniture/' }
      ];
      
      categories.push(...targetCategories);
      
      console.log(`✅ Found ${categories.length} categories`);
      
    } catch (error) {
      console.error('❌ Error scraping categories:', error);
    } finally {
      await browser.close();
    }
    
    return categories;
  }

  async scrapeProducts(categoryUrl: string, categoryName: string, maxProducts: number = 50): Promise<ScrapedProduct[]> {
    console.log(`🔍 Scraping products from ${categoryName}...`);
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const products: ScrapedProduct[] = [];
    let currentPage = 1;
    
    try {
      while (products.length < maxProducts && currentPage <= 5) {
        const pageUrl = `${categoryUrl}?page=${currentPage}`;
        console.log(`📄 Scraping page ${currentPage}: ${pageUrl}`);
        
        await page.goto(pageUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        await this.delay(2000);
        
        // Extract product data from the page
        const pageProducts = await page.evaluate((categoryName) => {
          const productElements = document.querySelectorAll('article[data-catalog-id]');
          const products: any[] = [];
          
          productElements.forEach((element) => {
            try {
              const nameEl = element.querySelector('.name');
              const priceEl = element.querySelector('.prc');
              const oldPriceEl = element.querySelector('.old');
              const imageEl = element.querySelector('img');
              const ratingEl = element.querySelector('.stars');
              const discountEl = element.querySelector('.bdg._dsct');
              
              const name = nameEl?.textContent?.trim() || '';
              const price = priceEl?.textContent?.trim() || '0';
              const originalPrice = oldPriceEl?.textContent?.trim() || '';
              const imageUrl = imageEl?.getAttribute('data-src') || imageEl?.getAttribute('src') || '';
              const rating = ratingEl?.getAttribute('data-rating') || '0';
              
              if (name && price && imageUrl) {
                // Generate multiple images (we'll duplicate the main image with variations)
                const images = [
                  imageUrl,
                  imageUrl.replace('.jpg', '_2.jpg'),
                  imageUrl.replace('.jpg', '_3.jpg')
                ].filter(url => url !== imageUrl + '_2.jpg'); // Remove invalid duplicates
                
                // Extract brand from product name
                const brand = name.split(' ')[0] || 'Generic';
                
                // Generate tags based on category and product name
                const tags = [
                  categoryName.toLowerCase(),
                  brand.toLowerCase(),
                  ...(name.toLowerCase().includes('smart') ? ['smart'] : []),
                  ...(name.toLowerCase().includes('wireless') ? ['wireless'] : []),
                  ...(originalPrice ? ['sale'] : [])
                ];
                
                products.push({
                  name,
                  price: price.replace(/[^\d.]/g, ''),
                  originalPrice: originalPrice ? originalPrice.replace(/[^\d.]/g, '') : '',
                  images: images.length > 0 ? images : [imageUrl],
                  description: `${name} - High quality product from ${brand}. Perfect for your needs with excellent performance and reliability.`,
                  categoryName,
                  brand,
                  inStock: true,
                  rating: rating || '4.0',
                  specifications: {
                    brand: brand,
                    category: categoryName,
                    warranty: '1 year',
                    origin: 'International'
                  },
                  tags
                });
              }
            } catch (err) {
              console.log('Error parsing product:', err);
            }
          });
          
          return products;
        }, categoryName);
        
        products.push(...pageProducts);
        console.log(`✅ Found ${pageProducts.length} products on page ${currentPage} (Total: ${products.length})`);
        
        if (pageProducts.length === 0) {
          console.log('No more products found, stopping...');
          break;
        }
        
        currentPage++;
        await this.delay(1000); // Rate limiting
      }
      
    } catch (error) {
      console.error(`❌ Error scraping products from ${categoryName}:`, error);
    } finally {
      await browser.close();
    }
    
    return products.slice(0, maxProducts);
  }

  async saveCategoriesToDb(categories: ScrapedCategory[]): Promise<void> {
    console.log('💾 Saving categories to database...');
    
    for (const category of categories) {
      try {
        const categoryData: InsertCategory = {
          name: category.name,
          slug: category.slug,
          description: `Discover amazing ${category.name.toLowerCase()} products at the best prices`,
          icon: `https://via.placeholder.com/400x200/ff6b35/ffffff?text=${encodeURIComponent(category.name)}`
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
    console.log('🎯 Starting Jumia Ghana scraping process...');
    
    try {
      // Step 1: Scrape and save categories
      const categories = await this.scrapeCategories();
      await this.saveCategoriesToDb(categories);
      
      // Get saved categories from database
      const savedCategories = await storage.getCategories();
      
      // Step 2: Scrape products for each category
      const productsPerCategory = Math.ceil(400 / categories.length);
      let totalProducts = 0;
      
      for (const category of categories) {
        const savedCategory = savedCategories.find((c: any) => c.slug === category.slug);
        if (!savedCategory) {
          console.log(`❌ Category ${category.name} not found in database`);
          continue;
        }
        
        console.log(`🛍️ Scraping ${productsPerCategory} products for ${category.name}...`);
        const products = await this.scrapeProducts(category.url, category.name, productsPerCategory);
        
        if (products.length > 0) {
          await this.saveProductsToDb(products, savedCategory.id);
          totalProducts += products.length;
        }
        
        // Add delay between categories
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log(`🎉 Scraping completed! Total products scraped: ${totalProducts}`);
      
    } catch (error) {
      console.error('❌ Fatal error during scraping:', error);
      throw error;
    }
  }
}

// Export function to run the scraper
export async function runJumiaScraper() {
  const scraper = new JumiaScraper();
  await scraper.scrapeAndPopulateDatabase();
}