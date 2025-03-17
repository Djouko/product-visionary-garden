
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  view: 'grid' | 'list';
}

const ProductCard = ({ product, view }: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "product-card",
          view === 'list' ? "flex items-center p-4 gap-6" : "flex flex-col p-4"
        )}
        onClick={() => setIsOpen(true)}
      >
        <div 
          className={cn(
            "relative overflow-hidden rounded-lg bg-gray-50",
            view === 'list' ? "h-20 w-20 flex-shrink-0" : "h-40 w-full mb-4"
          )}
        >
          <div className={cn("absolute inset-0 image-shimmer", imageLoaded ? "opacity-0" : "opacity-100")} />
          <img 
            src={product.image} 
            alt={product.name} 
            className={cn(
              "object-contain w-full h-full transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className={view === 'list' ? "flex-1" : ""}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
              <p className="text-gray-500 text-xs">{product.brand}</p>
            </div>
            {view === 'list' && (
              <Badge variant={
                product.status === 'Active' ? 'default' : 
                product.status === 'On Hold' ? 'outline' : 'destructive'
              }>
                {product.status}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-50">
              {product.size}
            </Badge>
            <Badge variant="outline" className="bg-gray-50">
              {product.stock} pairs
            </Badge>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div>
              {product.discount ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
                  <span className="font-semibold text-red-500">{formatPrice(discountedPrice)}</span>
                </div>
              ) : (
                <span className="font-semibold">{formatPrice(product.price)}</span>
              )}
            </div>
            
            {view === 'list' && (
              <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Details
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div className="relative h-64 bg-gray-50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
            {product.discount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full">
                {product.discount}% OFF
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{product.brand}</Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </div>
              <Badge variant={
                product.status === 'Active' ? 'default' : 
                product.status === 'On Hold' ? 'outline' : 'destructive'
              } className="ml-2">
                {product.status}
              </Badge>
            </div>
            
            <p className="mt-4 text-gray-600">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500">Size</p>
                <p className="font-medium">{product.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p className="font-medium">{product.stock} pairs</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{product.yearProduced}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Origin</p>
                <p className="font-medium">{product.origin}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <div>
                {product.discount ? (
                  <div className="flex flex-col">
                    <span className="text-gray-400 line-through">{formatPrice(product.price)}</span>
                    <span className="text-2xl font-bold text-red-500">{formatPrice(discountedPrice)}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
              
              <Button className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
