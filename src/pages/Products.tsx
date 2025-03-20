import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { deleteProduct, getProducts } from '@/lib/data';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Product, ProductCategory } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';

const productCategories: { value: ProductCategory; label: string }[] = [
  { value: 'fans', label: 'Fans' },
  { value: 'lights', label: 'Lights' },
  { value: 'switches', label: 'Switches' },
  { value: 'sockets', label: 'Sockets' },
  { value: 'wires', label: 'Wires' },
  { value: 'conduits', label: 'Conduits' },
  { value: 'mcbs', label: 'MCBs' },
  { value: 'panels', label: 'Panels' },
  { value: 'tools', label: 'Tools' },
  { value: 'accessories', label: 'Accessories' },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [products, setProducts] = useState(getProducts());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('fans');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductCategory('fans');
    setProductStock('');
    setProductImage('');
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleOpenProductForm = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price.toString());
      setProductCategory(product.category);
      setProductStock(product.stock.toString());
      setProductImage(product.image || '');
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      setIsDeleteDialogOpen(false);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // This would connect to our data.ts functions for adding/updating products
      // For now, we'll just update the local state
      if (isEditing && selectedProduct) {
        // Update existing product
        const updatedProduct = {
          ...selectedProduct,
          name: productName,
          description: productDescription,
          price: parseFloat(productPrice),
          category: productCategory,
          stock: parseInt(productStock),
          image: productImage || selectedProduct.image,
          updatedAt: new Date(),
        };
        
        setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct: Product = {
          id: Math.random().toString(36).substring(2, 11),
          name: productName,
          description: productDescription,
          price: parseFloat(productPrice),
          category: productCategory,
          stock: parseInt(productStock),
          image: productImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setProducts([newProduct, ...products]);
        toast.success('Product added successfully');
      }
      
      setIsProductFormOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return activeCategory === 'all' ? matchesSearch : product.category === activeCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Products</h1>
          <p className="text-muted-foreground animate-slide-in-bottom">
            Manage your product inventory and categories
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 md:w-[300px] lg:w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => handleOpenProductForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle>
              <Tabs 
                defaultValue="all" 
                className="w-full"
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as ProductCategory | 'all')}
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="fans">Fans</TabsTrigger>
                  <TabsTrigger value="lights">Lights</TabsTrigger>
                  <TabsTrigger value="switches">Switches</TabsTrigger>
                  <TabsTrigger value="sockets">Sockets</TabsTrigger>
                  <TabsTrigger value="panels">Panels</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium text-center">No products found</p>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm ? "Try adjusting your search." : "Add your first product to get started."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleOpenProductForm()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <PaginationWrapper
                data={filteredProducts}
                itemsPerPage={10}
              >
                {(paginatedProducts) => (
                  <div className="rounded-md border-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProducts.map((product) => (
                          <TableRow key={product.id} className="transition-all hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {product.image && (
                                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span>{product.name}</span>
                                  <span className="text-xs text-muted-foreground">{product.description.slice(0, 50)}{product.description.length > 50 ? '...' : ''}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={product.stock < 10 ? 'text-red-500' : ''}>
                                  {product.stock}
                                </span>
                                {product.stock < 10 && (
                                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-600 border-red-200 text-xs">
                                    Low Stock
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(product.updatedAt), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleOpenProductForm(product)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </PaginationWrapper>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isProductFormOpen} onOpenChange={(open) => {
        setIsProductFormOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Make changes to the product details below.' 
                : 'Fill in the details to add a new product to your inventory.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProduct} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={productCategory}
                  onValueChange={(value) => setProductCategory(value as ProductCategory)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                />
                {productImage && (
                  <div className="mt-2 w-20 h-20 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={productImage} 
                      alt="Product preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProduct && handleDeleteProduct(selectedProduct.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
