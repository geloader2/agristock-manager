import { useEffect, useState } from "react";
import { Package, AlertTriangle, Folder, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/StatsCard";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    categories: 0,
    recentActivity: 0
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch low stock items (quantity < 10)
      const { data: lowStock, count: lowStockCount } = await supabase
        .from("products")
        .select(`
          *,
          categories(name)
        `, { count: "exact" })
        .lt("quantity", 10)
        .order("quantity", { ascending: true })
        .limit(5);

      // Fetch categories count
      const { count: categoriesCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      // Fetch recent stock movements
      const { data: movements, count: movementsCount } = await supabase
        .from("stock_movements")
        .select(`
          *,
          products(name)
        `, { count: "exact" })
        .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalProducts: productsCount || 0,
        lowStockItems: lowStockCount || 0,
        categories: categoriesCount || 0,
        recentActivity: movementsCount || 0,
      });

      setLowStockItems(lowStock || []);
      setRecentActivities(movements || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your inventory</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">Loading dashboard...</div>
      ) : (
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
      )}

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
                    <p className="text-sm text-muted-foreground">{item.categories?.name || "Uncategorized"}</p>
                  </div>
                  <Badge variant="destructive">{item.quantity} {item.unit} left</Badge>
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
                    <p className="font-medium">
                      {activity.type === "in" ? "Stock In" : "Stock Out"}: {activity.products?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === "in" ? "+" : "-"}{activity.quantity} units
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={activity.type === "in" ? "default" : "secondary"}>
                    {activity.type === "in" ? "In" : "Out"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
