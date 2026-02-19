require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});


module.exports = pool;

// const createTables = async () => {
//     try {
//         await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

//         const queries = `

// -- Users table
// CREATE TABLE IF NOT EXISTS public.users (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   name text NOT NULL,
//   email text NOT NULL UNIQUE,
//   password text NOT NULL,
//   created_at timestamp DEFAULT CURRENT_TIMESTAMP
// );

// -- Businesses table
// CREATE TABLE IF NOT EXISTS public.businesses (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   user_id uuid UNIQUE,
//   business_name text NOT NULL,
//   address text,
//   phone text,
//   logo_url text,
//   created_at timestamp DEFAULT now(),
//   gst_number text,
//   email text,
//   CONSTRAINT businesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
// );

// -- Customers table
// CREATE TABLE IF NOT EXISTS public.customers (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   business_id uuid,
//   name text NOT NULL,
//   phone text,
//   email text,
//   gst_number text,
//   address text,
//   created_at timestamp DEFAULT now(),
//   CONSTRAINT customers_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE
// );

// -- Products table
// CREATE TABLE IF NOT EXISTS public.products (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   business_id uuid,
//   name text NOT NULL,
//   price numeric(10,2) NOT NULL,
//   tax_percent numeric(5,2) DEFAULT 0,
//   stock_quantity integer DEFAULT 0,
//   hsn_code text,
//   created_at timestamp DEFAULT now(),
//   unit text NOT NULL DEFAULT 'pcs',
//   CONSTRAINT products_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE
// );

// -- Invoices table
// CREATE TABLE IF NOT EXISTS public.invoices (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   business_id uuid,
//   customer_id uuid,
//   invoice_number integer NOT NULL,
//   is_gst boolean DEFAULT true,
//   subtotal numeric(10,2),
//   cgst numeric(10,2),
//   sgst numeric(10,2),
//   igst numeric(10,2),
//   discount numeric(10,2),
//   total_amount numeric(10,2),
//   status text NOT NULL CHECK (status IN ('PAID','UNPAID','PARTIAL')),
//   created_at timestamp DEFAULT now(),
//   due_date date,
//   CONSTRAINT invoices_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE,
//   CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL,
//   CONSTRAINT invoices_business_invoice_unique UNIQUE (business_id, invoice_number)
// );

// -- Invoice items table
// CREATE TABLE IF NOT EXISTS public.invoice_items (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   invoice_id uuid,
//   product_id uuid,
//   quantity integer NOT NULL CHECK (quantity > 0),
//   price numeric(10,2),
//   tax_percent numeric(5,2),
//   CONSTRAINT invoice_items_invoice_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE,
//   CONSTRAINT invoice_items_product_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
// );

// -- Payments table
// CREATE TABLE IF NOT EXISTS public.payments (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   invoice_id uuid,
//   amount numeric(10,2) NOT NULL CHECK (amount > 0),
//   mode text NOT NULL CHECK (mode IN ('CASH','UPI','CARD','BANK')),
//   created_at timestamp DEFAULT now(),
//   note text,
//   CONSTRAINT payments_invoice_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE
// );

//   `;

//         await pool.query(queries);
//         console.log("All tables created successfully!");
//     } catch (err) {
//         console.error("Error creating tables:", err);
//     } finally {
//         await pool.end();
//     }
// };

// // Call the function to create tables immediately
// createTables();


