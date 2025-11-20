import { useState, useEffect } from "react";
import { ArrowDownCircle, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function StockOut() {
  const [open, setOpen] = useState(false);
  const [stockOutHistory, setStockOutHistory] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockOutHistory();
    fetchProducts();
  }, []);

  const fetchStockOutHistory = async () => {
    try {
      const data = await api.getStockMovements('out');
      setStockOutHistory(data || []);
    } catch (error) {
      console.error("Error fetching stock out history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await api.createStockMovement({
        product_id: formData.get("product") as string,
        type: "out",
        quantity: parseInt(formData.get("quantity") as string),
        reason: formData.get("reason") as string,
        notes: formData.get("notes") as string,
      });
      
      toast.success("Stock removed successfully!");
      setOpen(false);
      fetchStockOutHistory();
    } catch (error) {
      console.error("Error removing stock:", error);
      toast.error("Failed to remove stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Stock Out</h2>
          <p className="text-muted-foreground mt-1">Record inventory usage or sales</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Stock Out
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Stock Out</DialogTitle>
              <DialogDescription>
                Record inventory usage or removal.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <Select name="product" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      placeholder="e.g., 10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      name="unit"
                      placeholder="e.g., sacks"
                      disabled
                      value="sacks"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select name="reason" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="used">Used/Consumed</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Additional notes (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Stock Out</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Out History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading history...</div>
          ) : stockOutHistory.length === 0 ? (
            <EmptyState
              icon={ArrowDownCircle}
              title="No stock removed yet"
              description="Track when inventory is used or sold"
              action={
                 <Button className="gap-2" onClick={() => setOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Stock Out
                    </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {stockOutHistory.map((entry: any) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{entry.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        -{entry.quantity} {entry.products?.unit}
                      </p>
                      {entry.reason && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reason: {entry.reason}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
