"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";

interface PaintingOptions {
  hairColor: string;
  skinColor: string;
  accessoryColor: string;
  fabricColor: string;
  specificDetails: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  customerEmail: string;
  productName: string;
  sku: string;
  paintingOptions: PaintingOptions;
  shippingAddress?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  timestamp: number;
  completed: boolean;
  price: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { status } = useSession();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    // Check authentication with NextAuth
    if (status === "loading") {
      return; // Still checking session
    }

    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      loadOrders();
    }
  }, [status, router]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch from orders API endpoint first
      console.log("Fetching orders from database...");
      const response = await fetch("/api/admin/orders", {
        cache: 'no-store', // Force fresh data, no caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch orders from database:", response.status);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log("Database orders received:", data.orders?.length || 0);

      if (data.orders && Array.isArray(data.orders)) {
        // Use database orders as the source of truth
        setOrders(data.orders);
        
        // Update localStorage cache
        localStorage.setItem("adminOrders", JSON.stringify(data.orders));
        console.log("Orders loaded successfully from database");
      } else {
        console.warn("No orders array in response, checking localStorage backup");
        // Fallback to localStorage only if database fails
        const savedOrders = localStorage.getItem("adminOrders");
        if (savedOrders) {
          const localOrders = JSON.parse(savedOrders);
          setOrders(localOrders);
          console.log("Loaded from localStorage backup:", localOrders.length);
        }
      }
    } catch (error) {
      console.error("Error loading orders from database:", error);
      
      // Try localStorage as fallback
      const savedOrders = localStorage.getItem("adminOrders");
      if (savedOrders) {
        try {
          const localOrders = JSON.parse(savedOrders);
          setOrders(localOrders);
          console.log("Using localStorage backup due to database error");
          alert("⚠️ Could not connect to database. Showing cached orders. Database may not be configured.");
        } catch (parseError) {
          console.error("Error parsing localStorage:", parseError);
          alert("Failed to load orders. Please check console for errors.");
        }
      } else {
        alert("⚠️ No orders found. Database connection may not be configured or no orders exist yet.");
      }
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  const toggleOrderCompletion = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newCompletedStatus = !order.completed;

    // Optimistic update
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, completed: newCompletedStatus } : o
    );
    setOrders(updatedOrders);

    // Update in database
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, completed: newCompletedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Also update localStorage as backup
      localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error updating order:", error);
      // Revert on error
      setOrders(orders);
      alert("Failed to update order. Please try again.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    // Optimistic update
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    // Delete from database
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      // Also update localStorage as backup
      localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error deleting order:", error);
      // Revert on error
      setOrders(orders);
      alert("Failed to delete order. Please try again.");
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "pending") return !order.completed;
    if (filter === "completed") return order.completed;
    return true;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const pendingCount = orders.filter(o => !o.completed).length;
  const completedCount = orders.filter(o => o.completed).length;

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
              <p className="text-gray-400">Manage painting orders</p>
              {lastRefresh && (
                <p className="text-xs text-gray-500 mt-1">
                  Last refreshed: {lastRefresh.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadOrders}
                disabled={isLoading}
                className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Orders
                  </>
                )}
              </button>
              <button
                onClick={logout}
                className="cursor-pointer px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <Separator className="mb-8 bg-white/20" />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-1">Total Orders</div>
              <div className="text-3xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <div className="text-blue-300 text-sm mb-1">Pending</div>
              <div className="text-3xl font-bold text-blue-400">{pendingCount}</div>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="text-green-300 text-sm mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">{completedCount}</div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Filter Tabs */}
          {!isLoading && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter("pending")}
                className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter("completed")}
              className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === "all" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              }`}
            >
              All ({orders.length})
            </button>
            </div>
          )}

          {/* Orders List */}
          {!isLoading && filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xl text-gray-400">
                {filter === "pending" ? "No pending orders" : 
                 filter === "completed" ? "No completed orders" : "No orders yet"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Orders will appear here automatically when customers complete payment
              </p>
            </div>
          ) : !isLoading ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white/5 border rounded-xl p-6 transition-all ${
                    order.completed 
                      ? "border-green-500/30 bg-green-500/5" 
                      : "border-white/10"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{order.productName}</h3>
                          <p className="text-sm text-gray-400">Order ID: {order.orderId}</p>
                          <p className="text-sm text-gray-400">SKU: {order.sku}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">${order.price}</div>
                          <p className="text-xs text-gray-400">{order.customerEmail}</p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="bg-black/30 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-sm text-gray-300 mb-2">
                            📦 Shipping Address:
                          </h4>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address.line1}</p>
                            {order.shippingAddress.address.line2 && (
                              <p>{order.shippingAddress.address.line2}</p>
                            )}
                            <p>
                              {order.shippingAddress.address.city}, {order.shippingAddress.address.state} {order.shippingAddress.address.postal_code}
                            </p>
                            <p>{order.shippingAddress.address.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Painting Instructions */}
                      {order.paintingOptions.hairColor !== "" ? (
                        <div className="bg-black/30 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-sm text-gray-300 mb-3">
                            🎨 Painting Colors:
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-xs text-gray-400 block mb-1">Hair:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border-2 border-white/30"
                                  style={{ backgroundColor: order.paintingOptions.hairColor }}
                                  title={order.paintingOptions.hairColor}
                                />
                                <span className="text-xs">{order.paintingOptions.hairColor}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block mb-1">Skin:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border-2 border-white/30"
                                  style={{ backgroundColor: order.paintingOptions.skinColor }}
                                  title={order.paintingOptions.skinColor}
                                />
                                <span className="text-xs">{order.paintingOptions.skinColor}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block mb-1">Accessory:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border-2 border-white/30"
                                  style={{ backgroundColor: order.paintingOptions.accessoryColor }}
                                  title={order.paintingOptions.accessoryColor}
                                />
                                <span className="text-xs">{order.paintingOptions.accessoryColor}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block mb-1">Fabric:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border-2 border-white/30"
                                  style={{ backgroundColor: order.paintingOptions.fabricColor }}
                                  title={order.paintingOptions.fabricColor}
                                />
                                <span className="text-xs">{order.paintingOptions.fabricColor}</span>
                              </div>
                            </div>
                          </div>
                          
                          {order.paintingOptions.specificDetails && 
                           order.paintingOptions.specificDetails !== "None" &&
                           order.paintingOptions.specificDetails !== "Prepainted miniature - no customization" && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <span className="text-xs text-gray-400 block mb-1">
                                Special Instructions:
                              </span>
                              <p className="text-sm text-gray-300">
                                {order.paintingOptions.specificDetails}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-800/50 border border-yellow-600/30 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-sm text-yellow-400 mb-2">
                            ⚠️ Unpainted Miniature Order
                          </h4>
                          <p className="text-sm text-gray-300">
                            Customer requested to receive this miniature unpainted. No custom painting service was selected.
                          </p>
                        </div>
                      )}

                      {/* Reaper Mini Link */}
                      <a
                        href={`https://www.reapermini.com/search/sku/${order.sku}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Order from Reaper Minis
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-40">
                      <button
                        onClick={() => toggleOrderCompletion(order.id)}
                        className={`cursor-pointer flex-1 lg:flex-none px-4 py-2 rounded-lg font-medium transition-colors ${
                          order.completed
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {order.completed ? "Mark Pending" : "Mark Complete"}
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="cursor-pointer flex-1 lg:flex-none px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
