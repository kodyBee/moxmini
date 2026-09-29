import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export interface OrderItem {
  id: string;
  orderId: string;
  customerEmail: string;
  productName: string;
  sku: string;
  paintingOptions: {
    hairColor: string;
    skinColor: string;
    accessoryColor: string;
    fabricColor: string;
    specificDetails: string;
  };
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

export interface PremadeProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  sku: string;
}

// Vercel's Neon integration provides both; POSTGRES_URL is what older
// Vercel Postgres projects were set up with.
function connectionString() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL;
}

export function isDatabaseConfigured() {
  return Boolean(connectionString());
}

let client: NeonQueryFunction<false, false> | null = null;

function sql() {
  if (!client) {
    const url = connectionString();
    if (!url) {
      throw new Error(
        "Database not configured. Please set the POSTGRES_URL environment variable."
      );
    }
    client = neon(url);
  }
  return client;
}

// Create tables once per server instance before the first query that needs them
let databaseReady: Promise<void> | null = null;
export function ensureDatabase() {
  databaseReady ??= initDatabase().catch((error) => {
    databaseReady = null;
    throw error;
  });
  return databaseReady;
}

// Create the tables, and add any columns older databases are missing
export async function initDatabase() {
  const db = sql();

  await db`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      product_name TEXT NOT NULL,
      sku TEXT NOT NULL,
      hair_color TEXT,
      skin_color TEXT,
      accessory_color TEXT,
      fabric_color TEXT,
      specific_details TEXT,
      shipping_name TEXT,
      shipping_line1 TEXT,
      shipping_line2 TEXT,
      shipping_city TEXT,
      shipping_state TEXT,
      shipping_postal_code TEXT,
      shipping_country TEXT,
      timestamp BIGINT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      price TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Shipping columns were added after launch
  await db`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS shipping_name TEXT,
    ADD COLUMN IF NOT EXISTS shipping_line1 TEXT,
    ADD COLUMN IF NOT EXISTS shipping_line2 TEXT,
    ADD COLUMN IF NOT EXISTS shipping_city TEXT,
    ADD COLUMN IF NOT EXISTS shipping_state TEXT,
    ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
    ADD COLUMN IF NOT EXISTS shipping_country TEXT
  `;

  await db`
    CREATE TABLE IF NOT EXISTS premade_products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      original_price NUMERIC(10, 2) NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Orders

export async function getOrders(): Promise<OrderItem[]> {
  const rows = await sql()`
    SELECT * FROM orders ORDER BY timestamp DESC
  `;

  return rows.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    customerEmail: row.customer_email,
    productName: row.product_name,
    sku: row.sku,
    paintingOptions: {
      hairColor: row.hair_color || "N/A",
      skinColor: row.skin_color || "N/A",
      accessoryColor: row.accessory_color || "N/A",
      fabricColor: row.fabric_color || "N/A",
      specificDetails: row.specific_details || "None",
    },
    shippingAddress: row.shipping_name
      ? {
          name: row.shipping_name,
          address: {
            line1: row.shipping_line1 || "",
            line2: row.shipping_line2 || undefined,
            city: row.shipping_city || "",
            state: row.shipping_state || "",
            postal_code: row.shipping_postal_code || "",
            country: row.shipping_country || "",
          },
        }
      : undefined,
    timestamp: Number(row.timestamp),
    completed: row.completed || false,
    price: row.price,
  }));
}

// Safe to call again for the same order: existing rows are left alone
export async function storeOrders(orders: OrderItem[]): Promise<void> {
  const db = sql();
  for (const order of orders) {
    await db`
      INSERT INTO orders (
        id, order_id, customer_email, product_name, sku,
        hair_color, skin_color, accessory_color, fabric_color, specific_details,
        shipping_name, shipping_line1, shipping_line2, shipping_city,
        shipping_state, shipping_postal_code, shipping_country,
        timestamp, completed, price
      )
      VALUES (
        ${order.id}, ${order.orderId}, ${order.customerEmail}, ${order.productName}, ${order.sku},
        ${order.paintingOptions.hairColor}, ${order.paintingOptions.skinColor},
        ${order.paintingOptions.accessoryColor}, ${order.paintingOptions.fabricColor},
        ${order.paintingOptions.specificDetails},
        ${order.shippingAddress?.name || null}, ${order.shippingAddress?.address.line1 || null},
        ${order.shippingAddress?.address.line2 || null}, ${order.shippingAddress?.address.city || null},
        ${order.shippingAddress?.address.state || null}, ${order.shippingAddress?.address.postal_code || null},
        ${order.shippingAddress?.address.country || null},
        ${order.timestamp}, ${order.completed}, ${order.price}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function updateOrderCompletion(
  orderId: string,
  completed: boolean
): Promise<void> {
  await sql()`
    UPDATE orders SET completed = ${completed} WHERE id = ${orderId}
  `;
}

export async function deleteOrder(orderId: string): Promise<void> {
  await sql()`
    DELETE FROM orders WHERE id = ${orderId}
  `;
}

// Premade products

function toPremadeProduct(row: Record<string, unknown>): PremadeProduct {
  return {
    id: Number(row.id),
    name: String(row.name),
    price: Number.parseFloat(String(row.price)),
    originalPrice: Number.parseFloat(String(row.original_price)),
    image: String(row.image),
    description: String(row.description),
    sku: String(row.sku),
  };
}

export async function getPremadeProducts(): Promise<PremadeProduct[]> {
  const rows = await sql()`
    SELECT id, name, price, original_price, image, description, sku
    FROM premade_products
    ORDER BY created_at DESC
  `;
  return rows.map(toPremadeProduct);
}

export async function createPremadeProduct(
  product: Omit<PremadeProduct, "id">
): Promise<PremadeProduct> {
  const rows = await sql()`
    INSERT INTO premade_products (name, price, original_price, image, description, sku)
    VALUES (${product.name}, ${product.price}, ${product.originalPrice}, ${product.image}, ${product.description}, ${product.sku})
    RETURNING id, name, price, original_price, image, description, sku
  `;
  return toPremadeProduct(rows[0]);
}

const PREMADE_COLUMNS = {
  name: "name",
  price: "price",
  originalPrice: "original_price",
  image: "image",
  description: "description",
  sku: "sku",
} as const;

export async function updatePremadeProduct(
  id: number,
  product: Partial<Omit<PremadeProduct, "id">>
): Promise<void> {
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const [field, column] of Object.entries(PREMADE_COLUMNS)) {
    const value = product[field as keyof typeof PREMADE_COLUMNS];
    if (value !== undefined) {
      values.push(value);
      updates.push(`${column} = $${values.length}`);
    }
  }

  if (updates.length === 0) return;

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await sql().query(
    `UPDATE premade_products SET ${updates.join(", ")} WHERE id = $${values.length}`,
    values
  );
}

export async function deletePremadeProduct(id: number): Promise<void> {
  await sql()`
    DELETE FROM premade_products WHERE id = ${id}
  `;
}

export async function deletePremadeProductBySku(sku: string): Promise<boolean> {
  const rows = await sql()`
    DELETE FROM premade_products WHERE sku = ${sku} RETURNING id
  `;
  return rows.length > 0;
}
