import { Package, AlertTriangle, Folder, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // Mock data - replace with actual data later
  const stats = {
    totalProducts: 0,
    lowStockItems: 0,
    categories: 0,
    recentActivity: 0
  };

  const lowStockItems = [];
  const recentActivities = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="Active products in inventory"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          variant="warning"
          description="Items need restocking"
        />
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={Folder}
          description="Product categories"
        />
        <StatsCard
          title="Recent Activity"
          value={stats.recentActivity}
          icon={TrendingUp}
          description="Transactions today"
        />
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockItems.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No low stock items"
              description="All products are well stocked"
            />
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge variant="destructive">{item.quantity} left</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No transactions made yet"
              description="Stock movements and updates will appear here"
            />
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge>{activity.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
