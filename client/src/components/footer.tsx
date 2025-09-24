import { Link } from "wouter";
import { MapPin, Phone, Mail, CreditCard, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content - Compact Horizontal Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-sm">
          
          {/* Need Help Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">NEED HELP?</h5>
            <ul className="space-y-1">
              <li><a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors" data-testid="footer-contact">Chat with us</a></li>
              <li><a href="#help" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* About Woodinn Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">ABOUT WOODINN GHANA</h5>
            <ul className="space-y-1">
              <li><a href="#about" className="text-gray-300 hover:text-orange-400 transition-colors">About us</a></li>
              <li><a href="#careers" className="text-gray-300 hover:text-orange-400 transition-colors">Woodinn careers</a></li>
              <li><a href="#terms" className="text-gray-300 hover:text-orange-400 transition-colors" data-testid="footer-terms">Terms and Conditions</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-orange-400 transition-colors" data-testid="footer-privacy">Privacy Notice</a></li>
              <li><a href="#cookies" className="text-gray-300 hover:text-orange-400 transition-colors">Cookie Notice</a></li>
              <li><a href="#flash-sales" className="text-gray-300 hover:text-orange-400 transition-colors">Flash Sales</a></li>
            </ul>
          </div>

          {/* Make Money Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">MAKE MONEY WITH WOODINN</h5>
            <ul className="space-y-1">
              <li><a href="#sell" className="text-gray-300 hover:text-orange-400 transition-colors">Sell on Woodinn</a></li>
              <li><a href="#vendor" className="text-gray-300 hover:text-orange-400 transition-colors">Vendor Hub</a></li>
              <li><a href="#delivery" className="text-gray-300 hover:text-orange-400 transition-colors" data-testid="footer-delivery">Delivery Service</a></li>
              <li><a href="#consultant" className="text-gray-300 hover:text-orange-400 transition-colors">Become a Sales Consultant</a></li>
            </ul>
          </div>

          {/* Woodinn International Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">WOODINN INTERNATIONAL</h5>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="space-y-1">
                <div><a href="#algeria" className="text-gray-300 hover:text-orange-400 transition-colors">Algeria</a></div>
                <div><a href="#cote-divoire" className="text-gray-300 hover:text-orange-400 transition-colors">Côte d'Ivoire</a></div>
                <div><a href="#egypt" className="text-gray-300 hover:text-orange-400 transition-colors">Egypt</a></div>
                <div><a href="#kenya" className="text-gray-300 hover:text-orange-400 transition-colors">Kenya</a></div>
              </div>
              <div className="space-y-1">
                <div><a href="#morocco" className="text-gray-300 hover:text-orange-400 transition-colors">Morocco</a></div>
                <div><a href="#nigeria" className="text-gray-300 hover:text-orange-400 transition-colors">Nigeria</a></div>
                <div><a href="#senegal" className="text-gray-300 hover:text-orange-400 transition-colors">Senegal</a></div>
                <div><a href="#uganda" className="text-gray-300 hover:text-orange-400 transition-colors">Uganda</a></div>
              </div>
            </div>
          </div>

          {/* Join Our Community Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">JOIN US ON</h5>
            <div className="space-y-2">
              <button 
                className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors"
                onClick={() => window.open('https://facebook.com', '_blank')}
                data-testid="facebook-link"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs">Facebook</span>
              </button>
              <button 
                className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors"
                onClick={() => window.open('https://wa.me/233000000000', '_blank')}
                data-testid="whatsapp-link"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="text-xs">WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Payment Methods Column */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm">PAYMENT METHODS</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-300">Mobile Money</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-300">Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-300">Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300">Opposite Police Station, Nsawam, Eastern Region</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300" data-testid="contact-phone">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-gray-300" data-testid="contact-email">info@woodinnhome.com</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              &copy; 2024 Woodinn Home. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}