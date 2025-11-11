# Database Schema Reference - Zaxis Studio

## Overview

Your Zaxis Studio application requires 4 main tables in Supabase:

| Table | Purpose | Status |
|-------|---------|--------|
| `categories` | Product categories | ❌ MISSING |
| `products` | Product information | ✅ May exist |
| `carousel_slides` | Homepage carousel | ✅ May exist |
| `orders` | Customer orders | ✅ May exist |

---

## 1. CATEGORIES Table

**Purpose:** Store product categories for filtering and organization

**Schema:**
```
Column Name    | Data Type                    | Constraints
---------------|------------------------------|------------------
id             | BIGSERIAL                   | PRIMARY KEY
name           | VARCHAR(255)                | NOT NULL, UNIQUE
description    | TEXT                        | NULL
created_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
updated_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
```

**Example Data:**
```json
{
  "id": 1,
  "name": "Keychains",
  "description": "Custom keychains and accessories",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Used By:**
- Admin panel: Product management (category dropdown)
- API: `/api/admin/categories` (GET, POST)
- Component: `ProductFormSection.jsx`

---

## 2. PRODUCTS Table

**Purpose:** Store all product information

**Schema:**
```
Column Name      | Data Type                    | Constraints
-----------------|------------------------------|------------------
id               | BIGSERIAL                   | PRIMARY KEY
title            | VARCHAR(255)                | NOT NULL
description      | TEXT                        | NULL
price            | DECIMAL(10, 2)              | NOT NULL
sku              | VARCHAR(100)                | NULL
inventory        | INTEGER                     | DEFAULT 0
image_url        | TEXT                        | NULL
category         | VARCHAR(255)                | NULL
tags             | TEXT                        | NULL
seo_title        | VARCHAR(255)                | NULL
seo_description  | TEXT                        | NULL
created_at       | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
updated_at       | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
```

**Example Data:**
```json
{
  "id": 1,
  "title": "Custom Keychain",
  "description": "Personalized 3D printed keychain",
  "price": 199.00,
  "sku": "KEY-001",
  "inventory": 50,
  "image_url": "https://example.com/keychain.jpg",
  "category": "Keychains",
  "tags": "3d-print,custom,gift",
  "seo_title": "Custom 3D Printed Keychain",
  "seo_description": "Get your personalized 3D printed keychain",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Used By:**
- Homepage: Product grid display
- Products page: Product listing
- Product detail page: Individual product info
- Admin panel: Product management
- API: `/api/products` (GET, POST, PATCH, DELETE)

---

## 3. CAROUSEL_SLIDES Table

**Purpose:** Store homepage carousel slide information

**Schema:**
```
Column Name    | Data Type                    | Constraints
---------------|------------------------------|------------------
id             | BIGSERIAL                   | PRIMARY KEY
title          | VARCHAR(255)                | NOT NULL
price          | VARCHAR(50)                 | NULL
image_url      | TEXT                        | NOT NULL
button_link    | VARCHAR(500)                | NULL
display_order  | INTEGER                     | DEFAULT 0
created_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
updated_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
```

**Example Data:**
```json
{
  "id": 1,
  "title": "Custom Keychains",
  "price": "₹199",
  "image_url": "https://example.com/carousel-keychain.jpg",
  "button_link": "/products?category=keychains",
  "display_order": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Used By:**
- Homepage: Hero carousel display
- Admin panel: Carousel management
- API: `/api/admin/carousel` (GET, POST, DELETE, PATCH)
- Component: `Hero.jsx`, `CarouselFormSection.jsx`

---

## 4. ORDERS Table

**Purpose:** Store customer orders with flexible JSON structure

**Schema:**
```
Column Name    | Data Type                    | Constraints
---------------|------------------------------|------------------
id             | BIGSERIAL                   | PRIMARY KEY
customer       | JSONB                       | NULL
items          | JSONB                       | NULL
status         | VARCHAR(50)                 | DEFAULT 'pending'
payment        | JSONB                       | NULL
created_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
updated_at     | TIMESTAMP WITH TIME ZONE    | DEFAULT NOW()
```

**Example Data:**
```json
{
  "id": 1,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City, State 12345",
    "pincode": "123456",
    "city": "City",
    "state": "State",
    "address_type": "home",
    "gst_invoice": false
  },
  "items": [
    {
      "id": 1,
      "title": "Custom Keychain",
      "price": 199
    }
  ],
  "status": "pending",
  "payment": {
    "method": "upi"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Status Values:**
- `pending` - Order received, awaiting confirmation
- `confirmed` - Order confirmed by admin
- `shipped` - Order shipped to customer
- `completed` - Order delivered

**Used By:**
- Admin panel: Order management
- Checkout page: Order creation
- API: `/api/orders` (GET, POST, PATCH)
- Component: `OrderManagementSection.jsx`

---

## Row Level Security (RLS) Policies

All tables have RLS enabled with these policies:

### Categories
- **SELECT:** Public (anyone can read)
- **INSERT/UPDATE/DELETE:** Authenticated users only

### Products
- **SELECT:** Public (anyone can read)
- **INSERT/UPDATE/DELETE:** Authenticated users only

### Carousel Slides
- **SELECT:** Public (anyone can read)
- **INSERT/UPDATE/DELETE:** Authenticated users only

### Orders
- **SELECT:** Authenticated users only
- **INSERT:** Authenticated users only
- **UPDATE:** Authenticated users only

---

## Indexes for Performance

Created indexes on frequently queried columns:

```sql
CREATE INDEX idx_categories_name ON public.categories(name);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_carousel_slides_order ON public.carousel_slides(display_order);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
```

---

## Data Type Reference

| Type | Description | Example |
|------|-------------|---------|
| BIGSERIAL | Auto-incrementing integer | 1, 2, 3... |
| VARCHAR(n) | Text with max length | "Product Name" |
| TEXT | Unlimited text | Long descriptions |
| DECIMAL(10,2) | Decimal number | 199.99 |
| INTEGER | Whole number | 50 |
| JSONB | JSON data | {"key": "value"} |
| TIMESTAMP WITH TIME ZONE | Date and time | 2024-01-15T10:30:00Z |

---

## Relationships

```
Categories
    ↓
Products (category field references categories.name)
    ↓
Orders (items array contains product references)
    
Carousel_Slides (independent, for homepage display)
```

---

## Common Queries

### Get all categories
```sql
SELECT * FROM public.categories ORDER BY name;
```

### Get products by category
```sql
SELECT * FROM public.products WHERE category = 'Keychains';
```

### Get carousel slides in order
```sql
SELECT * FROM public.carousel_slides ORDER BY display_order;
```

### Get pending orders
```sql
SELECT * FROM public.orders WHERE status = 'pending' ORDER BY created_at DESC;
```

### Count products by category
```sql
SELECT category, COUNT(*) as count FROM public.products GROUP BY category;
```

---

## Troubleshooting

### Table not found error
- Run the SQL setup script
- Restart development server
- Clear browser cache

### Permission denied error
- Check RLS policies are enabled
- Verify user is authenticated
- Check Supabase auth configuration

### Data not appearing
- Verify data was inserted correctly
- Check RLS policies allow read access
- Verify table has data: `SELECT COUNT(*) FROM table_name;`

---

## Files Reference

- `database-setup.sql` - Complete setup script
- `database-setup-individual.sql` - Individual table scripts
- `DATABASE_SETUP_GUIDE.md` - Detailed setup guide
- `QUICK_FIX_GUIDE.md` - Quick reference
- `DATABASE_SCHEMA_REFERENCE.md` - This file

