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

// Initialize database table
export async function initDatabase() {
  // Check if database URL is configured
  if (!process.env.POSTGRES_URL) {
    console.warn("⚠️ POSTGRES_URL not configured. Database features will not work.");
    throw new Error("Database not configured. Please set POSTGRES_URL environment variable.");
  }

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
    
    await sql`
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
      shippingAddress: row.shipping_name ? {
        name: row.shipping_name,
        address: {
          line1: row.shipping_line1 || "",
          line2: row.shipping_line2 || undefined,
          city: row.shipping_city || "",
          state: row.shipping_state || "",
          postal_code: row.shipping_postal_code || "",
          country: row.shipping_country || "",
        },
      } : undefined,
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

// Premade Products Functions

export interface PremadeProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  sku: string;
}

// Get all premade products
export async function getPremadeProducts(): Promise<PremadeProduct[]> {
  try {
    const { rows } = await sql`
      SELECT id, name, price, original_price, image, description, sku
      FROM premade_products
      ORDER BY created_at DESC
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      originalPrice: parseFloat(row.original_price),
      image: row.image,
      description: row.description,
      sku: row.sku,
    }));
  } catch (error) {
    console.error("Error fetching premade products:", error);
    return [];
  }
}

// Create a new premade product
export async function createPremadeProduct(product: Omit<PremadeProduct, "id">): Promise<PremadeProduct> {
  try {
    const { rows } = await sql`
      INSERT INTO premade_products (name, price, original_price, image, description, sku)
      VALUES (${product.name}, ${product.price}, ${product.originalPrice}, ${product.image}, ${product.description}, ${product.sku})
      RETURNING id, name, price, original_price, image, description, sku
    `;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      originalPrice: parseFloat(row.original_price),
      image: row.image,
      description: row.description,
      sku: row.sku,
    };
  } catch (error) {
    console.error("Error creating premade product:", error);
    throw error;
  }
}

// Update a premade product
export async function updatePremadeProduct(id: number, product: Partial<Omit<PremadeProduct, "id">>): Promise<void> {
  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (product.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(product.name);
    }
    if (product.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(product.price);
    }
    if (product.originalPrice !== undefined) {
      updates.push(`original_price = $${paramIndex++}`);
      values.push(product.originalPrice);
    }
    if (product.image !== undefined) {
      updates.push(`image = $${paramIndex++}`);
      values.push(product.image);
    }
    if (product.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(product.description);
    }
    if (product.sku !== undefined) {
      updates.push(`sku = $${paramIndex++}`);
      values.push(product.sku);
    }

    if (updates.length === 0) return;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await sql.query(
      `UPDATE premade_products SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    );
  } catch (error) {
    console.error("Error updating premade product:", error);
    throw error;
  }
}

// Delete a premade product
export async function deletePremadeProduct(id: number): Promise<void> {
  try {
    await sql`
      DELETE FROM premade_products WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error deleting premade product:", error);
    throw error;
  }
}
