import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">WH</span>
              </div>
              <div>
                <h4 className="text-xl font-bold">Woodinn Home</h4>
                <p className="text-xs opacity-80">Quality Home & Electrical</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Your trusted partner for quality home and electrical goods in Nsawam and Eastern Region.
            </p>
            <div className="flex space-x-4">
              <button 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={() => window.open('https://facebook.com', '_blank')}
                data-testid="facebook-link"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={() => window.open('https://wa.me/233000000000', '_blank')}
                data-testid="whatsapp-link"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-all-products">All Products</Link></li>
              <li><Link href="/products/furniture" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-furniture">Furniture</Link></li>
              <li><Link href="/products/electronics" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-electronics">Electronics</Link></li>
              <li><Link href="/products/home-decor" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-home-decor">Home Decor</Link></li>
              <li><Link href="/products?featured=true" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-special-offers">Special Offers</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Customer Care</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-contact">Contact Us</a></li>
              <li><a href="#faq" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-faq">FAQ</a></li>
              <li><a href="#delivery" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-delivery">Delivery Info</a></li>
              <li><a href="#returns" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-returns">Returns</a></li>
              <li><a href="#warranty" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-warranty">Warranty</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 opacity-80" />
                <span className="opacity-80">
                  Opposite the Police Station<br />
                  Nsawam, Eastern Region, Ghana
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 opacity-80" />
                <span className="opacity-80" data-testid="contact-phone">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="opacity-80" data-testid="contact-email">info@woodinnhome.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-80 mb-4 md:mb-0">&copy; 2024 Woodinn Home. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-privacy">Privacy Policy</a>
              <a href="#terms" className="opacity-80 hover:opacity-100 transition-opacity" data-testid="footer-terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
