import { ArrowUpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockIn() {
  const stockInHistory = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Stock In</h2>
          <p className="text-muted-foreground mt-1">Add new stock to inventory</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Stock In
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock In History</CardTitle>
        </CardHeader>
        <CardContent>
          {stockInHistory.length === 0 ? (
            <EmptyState
              icon={ArrowUpCircle}
              title="No stock added yet"
              description="Record when you receive new inventory"
              action={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stock In
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {stockInHistory.map((entry: any) => (
                <div key={entry.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{entry.product}</p>
                      <p className="text-sm text-muted-foreground">
                        +{entry.quantity} {entry.unit}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        By {entry.user} • {entry.timestamp}
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
