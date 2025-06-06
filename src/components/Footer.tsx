
import { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const navigate = useNavigate();
  
  const CLICK_THRESHOLD = 500; // milliseconds between clicks
  
  // Reset click count if time passes without clicks
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, CLICK_THRESHOLD + 100);
      
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  
  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    
    // Check if this click is within the threshold of the last click
    if (lastClickTime && currentTime - lastClickTime <= CLICK_THRESHOLD) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount === 3) {
        setClickCount(0);
        navigate('/auth');
      }
    } else {
      // First click or clicks too slow, reset counter
      setClickCount(1);
    }
    
    setLastClickTime(currentTime);
  };
  
  return (
    <footer className="bg-luxury-black text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <button 
              onClick={handleLogoClick}
              className="mb-4"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'default' }}
            >
              <img 
                src="/lovable-uploads/f2bea096-edde-4d0e-bd7d-0bd81ed4ef48.png" 
                alt="Josh Rader" 
                className="h-20 w-auto drop-shadow-md"
              />
            </button>
            <p className="text-white mb-6">
              Licensed commercial real estate agent serving Abilene, TX and surrounding areas with expertise in all types of commercial properties.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/brotivater" className="text-white hover:text-luxury-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-luxury-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-luxury-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-luxury-gold transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Services</a></li>
              <li><a href="#properties" className="text-white hover:text-luxury-gold transition-colors">Properties</a></li>
              <li><a href="#about" className="text-white hover:text-luxury-gold transition-colors">About Josh</a></li>
              <li><a href="#contact" className="text-white hover:text-luxury-gold transition-colors">Contact</a></li>
              <li><Link to="/privacy-policy" className="text-white hover:text-luxury-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Retail Leasing</a></li>
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Office Leasing</a></li>
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Industrial Properties</a></li>
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Property Investment</a></li>
              <li><a href="#services" className="text-white hover:text-luxury-gold transition-colors">Market Analysis</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contact Info</h4>
            <address className="not-italic text-white space-y-2">
              <p>1500 Industrial Blvd, Suite 300</p>
              <p>Abilene, TX 79601</p>
              <p>Phone: (325) 665-9244</p>
              <p>Email: Josh@McCullarProperties.com</p>
            </address>
          </div>
        </div>
        
        <hr className="border-white/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm mb-4 md:mb-0">
            &copy; {currentYear} Josh Rader Commercial Real Estate. All rights reserved.
          </p>
          <p className="text-white text-sm">
            Licensed Texas Real Estate Agent | TREC License #0661281
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
