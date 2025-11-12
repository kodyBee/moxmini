import { sql } from "@vercel/postgres";

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
  timestamp: number;
  completed: boolean;
  price: string;
}

// Initialize database table
export async function initDatabase() {
  try {
    await sql`
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
        timestamp BIGINT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        price TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

// Get all orders
export async function getOrders(): Promise<OrderItem[]> {
  try {
    const { rows } = await sql`
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
      timestamp: Number(row.timestamp),
      completed: row.completed || false,
      price: row.price,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Store new orders
export async function storeOrders(orders: OrderItem[]): Promise<void> {
  try {
    for (const order of orders) {
      await sql`
        INSERT INTO orders (
          id, order_id, customer_email, product_name, sku,
          hair_color, skin_color, accessory_color, fabric_color, specific_details,
          timestamp, completed, price
        )
        VALUES (
          ${order.id}, ${order.orderId}, ${order.customerEmail}, ${order.productName}, ${order.sku},
          ${order.paintingOptions.hairColor}, ${order.paintingOptions.skinColor},
          ${order.paintingOptions.accessoryColor}, ${order.paintingOptions.fabricColor},
          ${order.paintingOptions.specificDetails}, ${order.timestamp}, ${order.completed}, ${order.price}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log(`Stored ${orders.length} orders in database`);
  } catch (error) {
    console.error("Error storing orders:", error);
    throw error;
  }
}

// Update order completion status
export async function updateOrderCompletion(
  orderId: string,
  completed: boolean
): Promise<void> {
  try {
    await sql`
      UPDATE orders SET completed = ${completed} WHERE id = ${orderId}
    `;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// Delete an order
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM orders WHERE id = ${orderId}
    `;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}
