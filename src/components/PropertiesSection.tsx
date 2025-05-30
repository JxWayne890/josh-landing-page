
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import PropertyDetailsDialog from '@/components/PropertyDetailsDialog';

type Property = {
  id: string;
  title: string;
  address: string;
  type: string;
  size: string;
  price: string;
  image_url: string;
  description: string;
  featured: boolean;
  mls?: string;
};

const PropertiesSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('featured', true)
          .order('received_at', { ascending: false })
          .limit(6);
        
        if (error) {
          console.error('Error fetching properties:', error);
          setProperties([]);
        } else {
          setProperties(data || []);
        }
      } catch (error) {
        console.error('Error in properties fetch:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
    
    const channel = supabase
      .channel('public:properties')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'properties' }, 
        (payload) => {
          if (payload.new && payload.new.featured) {
            setProperties(current => {
              const updated = [payload.new as Property, ...current];
              return updated.slice(0, 6);
            });
          }
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPropertyId(null);
  };
  
  return (
    <section id="properties" ref={sectionRef} className="section bg-black relative overflow-hidden py-[45px]">
      <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-[#1E5799]/5 -translate-x-1/2 parallax-layer" style={{
      transform: `translateX(${scrollY * 0.03}px) translateY(${scrollY * 0.02}px)`
      }}>
      </div>
      <div className="absolute bottom-20 right-0 w-40 h-40 rounded-full bg-[#1E5799]/10 translate-x-1/2 parallax-layer" style={{
      transform: `translateX(${-scrollY * 0.04}px) translateY(${-scrollY * 0.01}px)`
      }}>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-white font-sans text-4xl font-bold mb-6">Featured <span className="font-serif text-[#1E5799]">Properties</span></h2>
          <p className="text-white font-sans text-xl md:text-2xl font-medium mb-8">
            Explore our selection of premium commercial properties available in Abilene, TX
          </p>
        </div>
        
        <div className="w-full rounded-lg overflow-hidden">
          {loading ? (
            <div className="bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-[#1E5799]/10 min-h-[200px] flex items-center justify-center">
              <div className="text-[#1E5799] animate-pulse">Loading properties...</div>
            </div>
          ) : properties.length > 0 ? (
            <>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {properties.map((property) => (
                    <CarouselItem key={property.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3">
                      <Card 
                        className="bg-luxury-dark border-[#1E5799]/10 hover:border-[#1E5799]/20 transition-all duration-300 hover:shadow-lg group h-[400px] overflow-hidden cursor-pointer"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          {property.image_url ? (
                            <img 
                              src={property.image_url} 
                              alt={property.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-luxury-dark flex items-center justify-center">
                              <Building className="h-12 w-12 text-[#1E5799]/20" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-[#1E5799] text-white py-1 px-2 rounded-sm text-xs font-medium">
                            {property.type}
                          </div>
                        </div>
                        <CardContent className="p-4 flex flex-col justify-between h-[calc(400px-256px)]">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              {property.price && (
                                <p className="font-serif font-bold text-[#1E5799] text-3xl mb-1 leading-tight tracking-tight">
                                  {property.price.startsWith('$') ? property.price : `$${property.price}`}
                                </p>
                              )}
                              
                              {property.mls && (
                                <div>
                                  <p className="text-xs text-white/70">MLS</p>
                                  <p className="font-medium text-white text-sm">{property.mls}</p>
                                </div>
                              )}
                            </div>
                            
                            {property.address && (
                              <p className="text-base md:text-lg font-medium text-white mb-1 font-serif tracking-wide">
                                {property.address}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-6 gap-4">
                  <CarouselPrevious className="static translate-y-0 border-[#1E5799] text-[#1E5799] hover:text-white hover:bg-[#1E5799] h-8 w-8" />
                  <CarouselNext className="static translate-y-0 border-[#1E5799] text-[#1E5799] hover:text-white hover:bg-[#1E5799] h-8 w-8" />
                </div>
              </Carousel>
              
              <div className="mt-8 text-center">
                <Link to="/properties">
                  <Button 
                    variant="outlineWhite" 
                    className="border-[#1E5799] text-white hover:bg-[#1E5799] hover:border-[#1E5799] transition-all duration-300 group"
                  >
                    <span>View All Properties</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-luxury-dark/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-[#1E5799]/10 min-h-[200px] flex flex-col items-center justify-center p-6 text-center">
              <Building className="h-12 w-12 text-[#1E5799]/30 mb-4" />
              <h3 className="text-lg font-bold text-[#1E5799] mb-2">No Properties Found</h3>
              <p className="text-white mb-4">
                Use the Webhook Tester to send property data to populate this section.
              </p>
              <Button 
                variant="outlineWhite" 
                className="border-[#1E5799] text-white hover:bg-[#1E5799] hover:border-[#1E5799]"
                onClick={() => window.location.href = '/webhooks'}
              >
                Go to Webhook Tester
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Property Details Dialog */}
      <PropertyDetailsDialog 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
        propertyId={selectedPropertyId} 
      />
    </section>
  );
};

export default PropertiesSection;
