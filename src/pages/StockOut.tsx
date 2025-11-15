import { ArrowDownCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StockOut() {
  const stockOutHistory = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Stock Out</h2>
          <p className="text-muted-foreground mt-1">Record inventory usage or sales</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Stock Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Out History</CardTitle>
        </CardHeader>
        <CardContent>
          {stockOutHistory.length === 0 ? (
            <EmptyState
              icon={ArrowDownCircle}
              title="No stock removed yet"
              description="Track when inventory is used or sold"
              action={
                <Button className="gap-2">
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
                      <p className="font-medium">{entry.product}</p>
                      <p className="text-sm text-muted-foreground">
                        -{entry.quantity} {entry.unit}
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
