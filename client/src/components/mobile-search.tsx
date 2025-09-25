import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0" data-testid="mobile-search-dialog">
        <DialogHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-lg font-semibold">Search Products</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Find products, brands and categories
            </DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0"
            data-testid="mobile-search-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search products, brands and categories" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base"
                autoFocus
                data-testid="mobile-search-input-dialog"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="lg"
              data-testid="mobile-search-submit"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
