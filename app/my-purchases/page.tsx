"use client";
import Title from "@/components/custom/title";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { useRouter } from "next/navigation"; // For navigation
import { useEnvStore } from "@/lib/zustand/useEnvStore";

// Updated Order interface to match your API response
interface Order {
  orderId: string;
  userId: string;
  total: {
    valueTotalInCents: number;
    currency: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  status: string; // Status is now a string from your response
  orderDate: string;
}

interface OrdersResponse {
  totalItems: number;
  totalItemsFetched: number;
  items: Order[];
}

function MyPurchases() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const apiBase = useEnvStore().apiBaseUrl;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Updated API endpoint to /orders
        const response = await fetch(`${apiBase}/orders`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OrdersResponse = await response.json();
        setOrders(data.items); // Access the 'items' array from the response
      } catch (e: any) {
        setError("Failed to load purchases. Please try again later.");
        console.error("Error fetching orders:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusBadgeColor = (status: string) => {
    // Status is now a string
    const lowerCaseStatus = status.toLowerCase(); // Convert to lowercase for case-insensitive matching
    switch (lowerCaseStatus) {
      case "processing": // Use lowercase for comparison
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/purchases/${orderId}`);
  };

  return (
    <section className="h-full">
      <div className="max-w-6xl mx-auto p-4 bg-white">
        <Title text="My Purchases" className="text-3xl mb-4" />

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : orders && orders.length > 0 ? (
          <Table>
            <TableCaption>A list of your recent purchases.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Time</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>{" "}
                {/* Changed to Total Amount */}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  {" "}
                  {/* Use orderId as key */}
                  <TableCell className="font-medium">
                    {order.orderId}
                  </TableCell>{" "}
                  {/* Display orderId */}
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}{" "}
                    {/* Format orderDate */}
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toTimeString().split("+")[0]}{" "}
                    {/* Format orderDate */}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Format total amount in USD */}$
                    {(order.total.valueTotalInCents / 100).toFixed(2)} USD
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadgeColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrderDetails(order.orderId)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-gray-500">
            You haven't made any purchases yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default MyPurchases;
