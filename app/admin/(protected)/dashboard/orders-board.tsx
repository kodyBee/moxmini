"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Palette,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderItem } from "@/lib/db";
import { cn } from "@/lib/utils";

type Filter = "pending" | "completed" | "all";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const COLORS: Array<[keyof OrderItem["paintingOptions"], string]> = [
  ["hairColor", "Hair"],
  ["skinColor", "Skin"],
  ["accessoryColor", "Accessory"],
  ["fabricColor", "Fabric"],
];

function orderKind(order: OrderItem) {
  if (order.paintingOptions.specificDetails === "Premade - Already Painted")
    return "prepainted";
  return HEX_COLOR.test(order.paintingOptions.hairColor)
    ? "custom"
    : "unpainted";
}

// Dates are formatted in the browser so they show in the artist's time zone
const subscribeNoop = () => () => {};
function LocalDateTime({ timestamp }: { timestamp: number }) {
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  return (
    <time dateTime={new Date(timestamp).toISOString()}>
      {isClient ? new Date(timestamp).toLocaleString() : ""}
    </time>
  );
}

function OrderCard({
  order,
  onToggle,
  onDelete,
}: {
  order: OrderItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const kind = orderKind(order);
  const details = order.paintingOptions.specificDetails;
  const address = order.shippingAddress?.address;

  return (
    <li
      className={cn(
        "surface p-5 sm:p-6",
        order.completed && "border-success/30 bg-[oklch(0.2_0.03_160/0.35)]"
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-tight font-semibold">
                {order.productName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                SKU {order.sku} · <LocalDateTime timestamp={order.timestamp} />
              </p>
              <p className="mt-0.5 text-xs break-all text-muted-foreground/80">
                Order {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-primary">
                ${order.price}
              </p>
              <a
                href={`mailto:${order.customerEmail}`}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {order.customerEmail}
              </a>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {order.shippingAddress && address && (
              <div className="rounded-xl bg-background/50 p-4 text-sm">
                <h3 className="mb-2 flex items-center gap-1.5 font-medium">
                  <MapPin className="size-4 text-primary" aria-hidden />
                  Ship to
                </h3>
                <address className="leading-relaxed text-foreground/85 not-italic">
                  {order.shippingAddress.name}
                  <br />
                  {address.line1}
                  {address.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                </address>
              </div>
            )}

            {kind === "custom" && (
              <div className="rounded-xl bg-background/50 p-4 text-sm">
                <h3 className="mb-3 flex items-center gap-1.5 font-medium">
                  <Palette className="size-4 text-primary" aria-hidden />
                  Paint colors
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {COLORS.map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span
                        className="size-7 shrink-0 rounded-full ring-1 ring-foreground/25"
                        style={{ backgroundColor: order.paintingOptions[key] }}
                      />
                      <span className="text-xs">
                        <span className="block text-muted-foreground">
                          {label}
                        </span>
                        <span className="font-mono uppercase">
                          {order.paintingOptions[key]}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                {details && details !== "None" && (
                  <p className="mt-3 border-t border-border pt-3 text-foreground/85">
                    <span className="block text-xs text-muted-foreground">
                      Notes
                    </span>
                    {details}
                  </p>
                )}
              </div>
            )}

            {kind === "unpainted" && (
              <p className="rounded-xl border border-dashed border-[oklch(0.8_0.12_85/0.4)] p-4 text-sm text-foreground/85">
                <span className="mb-1 flex items-center gap-1.5 font-medium text-primary">
                  <TriangleAlert className="size-4" aria-hidden />
                  Unpainted order
                </span>
                The customer asked for this miniature unpainted. No painting
                service was purchased.
              </p>
            )}

            {kind === "prepainted" && (
              <p className="rounded-xl border border-dashed border-accent/60 p-4 text-sm text-foreground/85">
                <span className="mb-1 flex items-center gap-1.5 font-medium text-[oklch(0.85_0.08_305)]">
                  <Sparkles className="size-4" aria-hidden />
                  Prepainted piece
                </span>
                Ship the finished miniature from your prepainted stock.
              </p>
            )}
          </div>

          {kind !== "prepainted" && (
            <a
              href={`https://www.reapermini.com/search/sku/${order.sku}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden />
              Order from Reaper Minis
            </a>
          )}
        </div>

        <div className="flex gap-2 lg:w-44 lg:flex-col">
          <Button
            variant={order.completed ? "outline" : "default"}
            className="flex-1 lg:flex-none"
            onClick={onToggle}
          >
            {order.completed ? (
              <RotateCcw aria-hidden />
            ) : (
              <Check aria-hidden />
            )}
            {order.completed ? "Mark pending" : "Mark complete"}
          </Button>
          <Button
            variant="destructive"
            className="flex-1 lg:flex-none"
            onClick={onDelete}
          >
            <Trash2 aria-hidden />
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export function OrdersBoard({
  orders: serverOrders,
  problem,
}: {
  orders: OrderItem[];
  problem: string | null;
}) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const [filter, setFilter] = useState<Filter>("pending");
  const [error, setError] = useState<string | null>(null);

  // Local copy for instant updates; replaced whenever the server sends fresh data
  const [orders, setOrders] = useState(serverOrders);
  const [lastServerOrders, setLastServerOrders] = useState(serverOrders);
  if (serverOrders !== lastServerOrders) {
    setLastServerOrders(serverOrders);
    setOrders(serverOrders);
  }

  const toggle = async (order: OrderItem) => {
    const previous = orders;
    setError(null);
    setOrders(
      orders.map((o) =>
        o.id === order.id ? { ...o, completed: !o.completed } : o
      )
    );
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, completed: !order.completed }),
    }).catch(() => null);
    if (!response?.ok) {
      setOrders(previous);
      setError("Couldn't update that order. Please try again.");
    }
  };

  const remove = async (order: OrderItem) => {
    if (
      !window.confirm(
        `Delete the order for "${order.productName}"? This can't be undone.`
      )
    )
      return;
    const previous = orders;
    setError(null);
    setOrders(orders.filter((o) => o.id !== order.id));
    const response = await fetch(
      `/api/admin/orders?id=${encodeURIComponent(order.id)}`,
      {
        method: "DELETE",
      }
    ).catch(() => null);
    if (!response?.ok) {
      setOrders(previous);
      setError("Couldn't delete that order. Please try again.");
    }
  };

  const pendingCount = orders.filter((o) => !o.completed).length;
  const completedCount = orders.length - pendingCount;
  const visible = orders
    .filter((o) =>
      filter === "all"
        ? true
        : filter === "completed"
          ? o.completed
          : !o.completed
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  const tabs: Array<{ value: Filter; label: string; count: number }> = [
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "completed", label: "Completed", count: completedCount },
    { value: "all", label: "All", count: orders.length },
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Orders
          </h1>
          <p className="mt-1 text-muted-foreground">
            Painting orders arrive here after payment.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => startRefresh(() => router.refresh())}
          disabled={isRefreshing}
          className="self-start sm:self-auto"
        >
          {isRefreshing ? (
            <LoaderCircle className="animate-spin" aria-hidden />
          ) : (
            <RefreshCw aria-hidden />
          )}
          Refresh
        </Button>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total orders", value: orders.length, className: "" },
          { label: "Pending", value: pendingCount, className: "text-primary" },
          {
            label: "Completed",
            value: completedCount,
            className: "text-success",
          },
        ].map((stat) => (
          <div key={stat.label} className="surface p-5">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd
              className={cn(
                "mt-1 text-3xl font-semibold tabular-nums",
                stat.className
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {(problem || error) && (
        <p
          role="alert"
          className="mt-6 flex gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-[oklch(0.85_0.08_25)]"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error ?? problem}
        </p>
      )}

      <div
        role="tablist"
        aria-label="Filter orders"
        className="mt-8 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-selected:border-primary aria-selected:bg-primary/10 aria-selected:text-primary"
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="surface mt-6 px-6 py-14 text-center">
          <p className="font-display text-2xl font-semibold">
            {filter === "pending"
              ? "No pending orders"
              : filter === "completed"
                ? "No completed orders"
                : "No orders yet"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Orders appear here automatically when customers complete payment.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onToggle={() => toggle(order)}
              onDelete={() => remove(order)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
