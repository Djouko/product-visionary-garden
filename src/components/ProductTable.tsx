
import React, { useState, useRef, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ShoppingCart,
  GripVertical,
  Tag,
  ExternalLink,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type SortDirection = 'asc' | 'desc' | null;

interface Column {
  id: string;
  label: React.ReactNode;
  accessor: (product: Product) => React.ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
}

interface ProductTableProps {
  products: Product[];
}

// Constante pour le type d'élément à glisser-déposer
const ItemTypes = {
  COLUMN: 'column'
};

// Composant pour l'en-tête de colonne déplaçable
const DraggableColumnHeader = ({ 
  column, 
  index, 
  moveColumn, 
  onSort, 
  sortField, 
  sortDirection 
}: { 
  column: Column; 
  index: number; 
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onSort: (columnId: string) => void;
  sortField: string | null;
  sortDirection: SortDirection;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COLUMN,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COLUMN,
    hover: (draggedItem: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      
      // Ne pas remplacer les éléments par eux-mêmes
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Calculer les coordonnées de la souris
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Obtenir le centre horizontal
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Obtenir la position horizontale de la souris
      const clientOffset = monitor.getClientOffset();
      
      // Position du curseur par rapport à l'élément
      const hoverClientX = (clientOffset as { x: number }).x - hoverBoundingRect.left;
      
      // Seulement effectuer le déplacement lorsqu'on dépasse la moitié
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // Effectuer le déplacement
      moveColumn(dragIndex, hoverIndex);
      
      // Mettre à jour l'index de l'élément glissé
      draggedItem.index = hoverIndex;
    }
  }));
  
  // Combine les refs pour glisser et déposer
  drag(drop(ref));
  
  return (
    <TableHead 
      ref={ref}
      key={column.id}
      className={cn(
        "h-12 px-4 text-left whitespace-nowrap", 
        column.sortable && "cursor-pointer select-none",
        isDragging && "opacity-50 bg-primary/10"
      )}
      style={{ 
        width: column.width, 
        minWidth: column.minWidth
      }}
      onClick={() => column.sortable && onSort(column.id)}
    >
      <div className="flex items-center gap-2">
        {column.label}
        {column.sortable && sortField === column.id && (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );
};

const ProductTable = ({ products }: ProductTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Initial columns configuration
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: 'name', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Product Name</span>
        </div>
      ), 
      accessor: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded overflow-hidden bg-muted/50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-contain" 
            />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <Badge variant="outline" className="mt-1 bg-muted/50 text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      ),
      sortable: true,
      width: 350,
      minWidth: 250
    },
    { 
      id: 'brand', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Brand</span>
        </div>
      ),
      accessor: (product) => (
        <div className="font-medium">{product.brand}</div>
      ),
      sortable: true,
      width: 180,
      minWidth: 120
    },
    { 
      id: 'yearProduced', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Year</span>
        </div>
      ),
      accessor: (product) => (
        <div className="font-medium">{product.yearProduced || "N/A"}</div>
      ),
      sortable: true,
      width: 120,
      minWidth: 80
    },
    { 
      id: 'status', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Status</span>
        </div>
      ),
      accessor: (product) => (
        <div>
          <Badge variant={
            product.status === 'Active' ? 'default' : 
            product.status === 'On Hold' ? 'outline' : 'destructive'
          } className="rounded-full px-2 py-0.5">
            {product.status}
          </Badge>
        </div>
      ),
      sortable: true,
      width: 120,
      minWidth: 100
    },
    { 
      id: 'inventory', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Inventory</span>
        </div>
      ),
      accessor: (product) => (
        <div>
          <div className="font-medium">{product.stock} units / {product.size || "S"}</div>
        </div>
      ),
      sortable: true,
      width: 150,
      minWidth: 120
    },
    { 
      id: 'incoming', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Incoming</span>
        </div>
      ),
      accessor: (product) => (
        <div className="font-medium">
          {Math.floor(Math.random() * 50)}
        </div>
      ),
      sortable: true,
      width: 120,
      minWidth: 80
    },
    { 
      id: 'price', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Price</span>
        </div>
      ),
      accessor: (product) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(product.price);
        
        const increasePercent = Math.floor(Math.random() * 20) + 5;
        
        return (
          <div>
            <div className="font-medium">{formattedPrice}</div>
            <div className="text-xs text-green-500">{increasePercent}% increase</div>
          </div>
        );
      },
      sortable: true,
      width: 150,
      minWidth: 120
    },
    { 
      id: 'sold', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Sold</span>
        </div>
      ),
      accessor: (product) => (
        <div className="font-medium">
          {Math.floor(Math.random() * 30) + 1}
        </div>
      ),
      sortable: true,
      width: 120,
      minWidth: 80
    },
    { 
      id: 'retail', 
      label: (
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <span>Retail</span>
        </div>
      ),
      accessor: (product) => {
        const retailPrice = product.price * 1.5;
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(retailPrice);
        
        return (
          <div className="font-medium">{formattedPrice}</div>
        );
      },
      sortable: true,
      width: 150,
      minWidth: 120
    },
    { 
      id: 'actions', 
      label: (
        <div className="flex items-center gap-2">
          <span>Actions</span>
        </div>
      ),
      accessor: (product) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs font-medium">
            Hold Selling
          </Button>
          <Button size="sm" variant="ghost">
            <Package className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: 200,
      minWidth: 160
    }
  ]);

  // Fonction pour déplacer une colonne
  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const draggedColumn = newColumns[dragIndex];
      
      // Supprimer la colonne de l'index d'origine
      newColumns.splice(dragIndex, 1);
      
      // Insérer la colonne à son nouvel index
      newColumns.splice(hoverIndex, 0, draggedColumn);
      
      return newColumns;
    });
  }, []);

  // Toggle row expansion
  const toggleRowExpansion = (productId: string) => {
    setExpandedRow(expandedRow === productId ? null : productId);
  };

  // Sort products
  const handleSort = (columnId: string) => {
    const isAsc = sortField === columnId && sortDirection === 'asc';
    const newDirection: SortDirection = !isAsc ? 'asc' : 'desc';
    
    setSortField(columnId);
    setSortDirection(newDirection);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    
    let aValue: any;
    let bValue: any;
    
    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'brand':
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
        break;
      case 'yearProduced':
        aValue = a.yearProduced || 0;
        bValue = b.yearProduced || 0;
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'inventory':
        aValue = a.stock;
        bValue = b.stock;
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle checkbox selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Select all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full border rounded-lg border-border bg-background dark:bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 dark:bg-slate-900">
              <TableRow className="border-b border-border">
                <TableHead className="w-10 text-center">
                  <Checkbox 
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {columns.map((column, index) => (
                  <DraggableColumnHeader 
                    key={column.id}
                    column={column}
                    index={index}
                    moveColumn={moveColumn}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow 
                    className={cn(
                      "hover:bg-muted/40 dark:hover:bg-slate-900/80",
                      expandedRow === product.id && "bg-muted/40 dark:bg-slate-900/80",
                      "transition-colors cursor-pointer"
                    )}
                    onClick={() => toggleRowExpansion(product.id)}
                  >
                    <TableCell className="h-12 p-0 text-center">
                      <div onClick={(e) => {
                        e.stopPropagation();
                        toggleProductSelection(product.id);
                      }}>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                        />
                      </div>
                    </TableCell>
                    {columns.map((column, index) => (
                      <TableCell key={`${product.id}-${column.id}`} className="p-4">
                        {index === 0 ? (
                          <div className="flex items-center gap-2">
                            {expandedRow === product.id ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            {column.accessor(product)}
                          </div>
                        ) : (
                          column.accessor(product)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {expandedRow === product.id && (
                    <TableRow className="bg-muted/20 dark:bg-slate-900/40 border-0">
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                              <h3 className="font-semibold text-foreground">Product Details</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">SKU</p>
                                  <p className="font-medium">{product.id}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Category</p>
                                  <p className="font-medium">{product.category}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Year</p>
                                  <p className="font-medium">{product.yearProduced || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  <Badge variant={
                                    product.status === 'Active' ? 'default' : 
                                    product.status === 'On Hold' ? 'outline' : 'destructive'
                                  }>{product.status}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-semibold text-foreground">Description</h3>
                              <p className="text-sm text-muted-foreground">
                                {product.description || "No description available for this product."}
                              </p>
                              <div className="pt-2">
                                <Button variant="outline" size="sm" className="text-xs">
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  View Full Details
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h3 className="font-semibold text-foreground">Inventory & Pricing</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">In Stock</p>
                                  <p className="font-medium">{product.stock} units</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Size</p>
                                  <p className="font-medium">{product.size || "Standard"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Wholesale Price</p>
                                  <p className="font-medium">${product.price}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Retail Price</p>
                                  <p className="font-medium">${Math.round(product.price * 1.5)}</p>
                                </div>
                              </div>
                              <div className="pt-2 flex gap-2">
                                <Button size="sm" className="text-xs">
                                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                  Add to Cart
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                  <Tag className="h-3.5 w-3.5 mr-1" />
                                  Set Price
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
          <div>
            {selectedProducts.length > 0 ? (
              <span>{selectedProducts.length} items selected</span>
            ) : (
              <span>0 items selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Page Size:</span>
            <select className="bg-background border border-border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="ml-4">1 to 10 of {products.length}</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ProductTable;
