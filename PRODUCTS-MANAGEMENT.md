# Prepainted Miniatures Management System

This feature allows artists to manage prepainted miniatures through the admin dashboard. Artists can add, edit, and delete products that will be displayed on the `/premade` page.

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, and Delete prepainted products
- ✅ **Database-backed**: All products stored in PostgreSQL database
- ✅ **Admin Authentication**: Only authenticated admins can manage products
- ✅ **User-friendly UI**: Intuitive interface for managing products
- ✅ **Fallback Support**: Works even if database is not configured

## Setup Instructions

### 1. Initialize Database Tables

If you haven't already initialized your database, visit:
```
https://your-app.vercel.app/api/admin/setup
```

This will create the necessary tables including the new `premade_products` table.

### 2. Access the Product Management Dashboard

1. Log in to the admin dashboard at: `/admin/login`
2. Click the **"Manage Products"** button in the dashboard header
3. You'll be redirected to: `/admin/dashboard/products`

### 3. Optional: Seed Initial Products

If you want to add some starter products, you can:
- Use the seed endpoint (requires authentication): POST to `/api/admin/seed-products`
- Or manually add products through the UI

## How to Use

### Adding a New Product

1. Go to `/admin/dashboard/products`
2. Click **"Add New Product"**
3. Fill in all required fields:
   - **Product Name**: The name of the miniature (e.g., "Human Fighter")
   - **SKU**: Unique product identifier (e.g., "PREMADE-001")
   - **Price**: Current selling price in dollars
   - **Original Price**: Original price before discount
   - **Image URL**: URL to the product image (can be relative like `/image.jpg` or absolute)
   - **Description**: Detailed description of the miniature
4. Click **"Create Product"**

### Editing a Product

1. Find the product in the grid view
2. Click the **"Edit"** button
3. Modify any fields you want to change
4. Click **"Update Product"**

### Deleting a Product

1. Find the product in the grid view
2. Click the **"Delete"** button
3. Confirm the deletion

## Database Schema

The `premade_products` table has the following structure:

```sql
CREATE TABLE premade_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Public Endpoint
- **GET** `/api/premade-products` - Get all products (public, used by the frontend)

### Admin Endpoints (Authentication Required)
- **GET** `/api/admin/premade-products` - Get all products
- **POST** `/api/admin/premade-products` - Create a new product
- **PATCH** `/api/admin/premade-products` - Update a product
- **DELETE** `/api/admin/premade-products?id={id}` - Delete a product

## File Structure

```
moxmini/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       ├── page.tsx (Main dashboard - now with "Manage Products" button)
│   │       └── products/
│   │           └── page.tsx (New: Product management UI)
│   └── api/
│       ├── admin/
│       │   ├── premade-products/
│       │   │   └── route.ts (New: Admin CRUD endpoints)
│       │   └── seed-products/
│       │       └── route.ts (New: Optional seed endpoint)
│       └── premade-products/
│           └── route.ts (Updated: Now uses database)
└── lib/
    └── db.ts (Updated: Added product management functions)
```

## Fallback Behavior

If the database is not configured or fails, the system will automatically fall back to the hardcoded products in `/api/premade-products/route.ts`. This ensures the site continues to function even during database issues.

## Security

- All admin endpoints require authentication via NextAuth
- Only authenticated users can access the product management dashboard
- All write operations (create, update, delete) are protected
- Public read-only access to products for the storefront

## Notes

- Products are displayed on the `/premade` page for customers
- Changes made in the admin dashboard are reflected immediately on the public site
- SKU must be unique for each product
- Images can be hosted locally in the `/public` folder or externally
- Price calculations (discount percentage) are automatic

## Troubleshooting

**Products not showing up?**
- Make sure you've run `/api/admin/setup` to create the database tables
- Check that your `POSTGRES_URL` environment variable is configured
- Verify you're logged in to the admin dashboard

**Can't access the product management page?**
- Make sure you're authenticated via `/admin/login`
- Check your session is valid

**Database errors?**
- The system will fall back to hardcoded products
- Check your Vercel Postgres configuration
- Review the console logs for specific error messages
