CREATE EXTENSION IF NOT EXISTS "uuid-ossp"


-- USER 
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- BUSINESS (1 USER - 1 BUSINESS)
CREATE TABLE businesses(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    address TEXT,
    phone TEXT, 
    logo_url TEXT, 
    created_at TIMESTAMP DEFAULT NOW()
);


-- CUSTOMERS 
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone  TEXT,
    email TEXT,
    gst_number TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


-- PRODUCTS 
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    hsn_code TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


-- INVOICES 
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number INT NOT NULL,
    is_gst BOOLEAN DEFAULT true,
    subtotal NUMERIC(10, 2),
    cgst NUMERIC(10, 2),
    sgst NUMERIC(10, 2),
    igst NUMERIC(10, 2),
    discount NUMERIC(10, 2),
    total_amount NUMERIC(10, 2),
    status TEXT CHECK (status in ('PAID', 'UNPAID', 'PARTIAL')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (business_id, invoice_number)
);


-- INVOICES ITEMS 
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2),
    tax_percent NUMERIC(5, 2)
);


-- PAYMENTS 
CREATE TABLE payments(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    mode TEXT CHECK (mode IN ('CASH', 'UPI', 'CARD', 'BANK')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
