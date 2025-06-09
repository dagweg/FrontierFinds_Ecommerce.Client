"use client";

import Title from "@/components/custom/title";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrderItem {
  orderId: string;
  orderDate: string;
  total: {
    valueTotalInCents: number;
  };
  status: string;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface OrdersResponse {
  items: OrderItem[];
  totalCount: number;
}

function MyPurchasesRedesigned() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const router = useRouter();
  const apiBase = useEnvStore().apiBaseUrl;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBase}/orders`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OrdersResponse = await response.json();
        setOrders(data.items);
        setFilteredOrders(data.items);
      } catch (e: any) {
        setError("Failed to load purchases. Please try again later.");
        console.error("Error fetching orders:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [apiBase]);

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case "date-asc":
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case "amount-desc":
          return b.total.valueTotalInCents - a.total.valueTotalInCents;
        case "amount-asc":
          return a.total.valueTotalInCents - b.total.valueTotalInCents;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
      case "shipping":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
      case "canceled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "shipped":
      case "shipping":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/purchases/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Title text="My Purchases" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2" />
          <p className="text-gray-600 dark:text-gray-300">Track and manage your order history</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Amount</SelectItem>
                    <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {error ? (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== "all" ? "No matching orders found" : "No purchases yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start shopping to see your orders here"
                  }
                </p>
                <Button onClick={() => router.push("/store")}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="group"
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order.orderId}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{new Date(order.orderDate).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Amount */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Badge className={cn("flex items-center gap-1", getStatusColor(order.status))}>
                            {getStatusIcon(order.status)}
                            {order.status.toUpperCase()}
                          </Badge>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
                              <CreditCard className="w-4 h-4" />
                              ${(order.total.valueTotalInCents / 100).toFixed(2)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order.orderId)}
                            className="group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/20"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="group-hover:bg-gray-50 dark:group-hover:bg-gray-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Purchase Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {filteredOrders.length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${(filteredOrders.reduce((sum, order) => sum + order.total.valueTotalInCents, 0) / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${filteredOrders.length > 0 ? (filteredOrders.reduce((sum, order) => sum + order.total.valueTotalInCents, 0) / 100 / filteredOrders.length).toFixed(2) : '0.00'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Average Order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyPurchasesRedesigned;
