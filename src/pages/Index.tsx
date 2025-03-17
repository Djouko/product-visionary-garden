import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsData, statistics, categories, brands, statuses, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductTable from '@/components/ProductTable';
import ProductStatCard from '@/components/ProductStatCard';
import StatGraph from '@/components/StatGraph';
import UpgradeCard from '@/components/UpgradeCard';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { 
  Search, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let results = productsData;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.id.toLowerCase().includes(term)
      );
    }
    
    if (selectedStatus !== 'All') {
      results = results.filter(product => product.status === selectedStatus);
    }
    
    if (selectedCategories.length > 0) {
      results = results.filter(product => selectedCategories.includes(product.category));
    }
    
    if (selectedBrands.length > 0) {
      results = results.filter(product => selectedBrands.includes(product.brand));
    }
    
    results = results.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedCategories, selectedBrands, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (selectedStatus !== 'All') count++;
    if (selectedCategories.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++;
    return count;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div 
            className="md:col-span-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Statistics</h2>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <ProductStatCard 
                    title="Purchased" 
                    value={statistics.purchased} 
                    unit="Pairs" 
                  />
                  <ProductStatCard 
                    title="Available" 
                    value={statistics.available} 
                    unit="Pairs" 
                  />
                </div>
                
                <ProductStatCard 
                  title="Product Income" 
                  value={`$${statistics.income}`} 
                  change={statistics.incomeChange} 
                  graph={<StatGraph type="income" />} 
                />
                
                <ProductStatCard 
                  title="Product Spending" 
                  value={`$${statistics.spending}`} 
                  change={statistics.spendingChange} 
                  graph={<StatGraph type="spending" />} 
                />
              </div>
              
              <UpgradeCard />
              
              <div className="md:hidden">
                <Button 
                  onClick={() => setFilterOpen(!filterOpen)} 
                  variant="outline" 
                  className="w-full flex justify-between items-center"
                >
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {getAppliedFiltersCount() > 0 && (
                      <Badge className="ml-2">{getAppliedFiltersCount()}</Badge>
                    )}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {filterOpen && (
                  <div className="mt-4 space-y-6 border rounded-lg p-4 bg-card text-card-foreground">
                    <div>
                      <h3 className="font-medium mb-2">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map(status => (
                          <Badge 
                            key={status} 
                            variant={selectedStatus === status ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedStatus(status)}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Brands</h3>
                      <div className="space-y-2">
                        {brands.map(brand => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrand(brand)}
                            />
                            <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Price Range</h3>
                        <span className="text-sm text-muted-foreground">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider 
                        defaultValue={[0, 5000]} 
                        max={5000} 
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-2">
                      <Button variant="outline" size="sm" onClick={clearFilters} className="flex-1">
                        Clear All
                      </Button>
                      <Button size="sm" onClick={() => setFilterOpen(false)} className="flex-1">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for items..."
                    className="search-input pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 items-center">
                  <ThemeToggle />
                  
                  <Button className="whitespace-nowrap">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Item
                  </Button>
                  
                  <div className="flex rounded-md overflow-hidden border">
                    <Button
                      variant={view === 'grid' ? 'default' : 'outline'}
                      className={cn(
                        "rounded-none border-0",
                        view === 'grid' ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                      onClick={() => setView('grid')}
                      size="icon"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={view === 'list' ? 'default' : 'outline'}
                      className={cn(
                        "rounded-none border-0 border-l",
                        view === 'list' ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                      onClick={() => setView('list')}
                      size="icon"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <span>Category</span>
                      <ChevronDown className="h-4 w-4" />
                      {selectedCategories.length > 0 && (
                        <Badge className="ml-1">{selectedCategories.length}</Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`desktop-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label htmlFor={`desktop-category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <span>Brand</span>
                      <ChevronDown className="h-4 w-4" />
                      {selectedBrands.length > 0 && (
                        <Badge className="ml-1">{selectedBrands.length}</Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`desktop-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <Label htmlFor={`desktop-brand-${brand}`}>{brand}</Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <span>Price</span>
                      <ChevronDown className="h-4 w-4" />
                      {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                        <Badge className="ml-1">1</Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Price Range</h4>
                        <span className="text-sm text-muted-foreground">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                      </div>
                      <Slider 
                        defaultValue={[0, 5000]} 
                        max={5000} 
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" className="ml-auto gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced Filter
                </Button>
                
                {getAppliedFiltersCount() > 0 && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="mt-6"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {view === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            view={view} 
                          />
                        ))}
                      </div>
                    ) : (
                      <ProductTable products={currentProducts} />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} items
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Select 
                    value={String(currentPage)} 
                    onValueChange={(value) => changePage(Number(value))}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Page" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
