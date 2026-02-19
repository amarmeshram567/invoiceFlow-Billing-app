export const customers = [
    { id: "c1", name: "Acme Corporation", email: "billing@acme.com", phone: "+91 98765 43210", address: "123 Business Park, Mumbai", gstin: "27AADCA1234F1ZV", createdAt: "2025-12-01" },
    { id: "c2", name: "Tech Solutions Ltd", email: "accounts@techsol.in", phone: "+91 87654 32109", address: "456 IT Hub, Bangalore", gstin: "29BBDTS5678G2ZW", createdAt: "2025-12-10" },
    { id: "c3", name: "Green Farms Pvt Ltd", email: "info@greenfarms.co", phone: "+91 76543 21098", address: "789 Agri Zone, Pune", gstin: "27CCEGF9012H3ZX", createdAt: "2026-01-05" },
    { id: "c4", name: "Star Retailers", email: "purchase@starretail.com", phone: "+91 65432 10987", address: "321 Market Rd, Delhi", createdAt: "2026-01-15" },
    { id: "c5", name: "Bright Interiors", email: "hello@brightint.in", phone: "+91 54321 09876", address: "654 Design St, Chennai", gstin: "33DDEBI3456I4ZY", createdAt: "2026-01-20" },
];

export const products = [
    { id: "p1", name: "Laptop Stand - Premium", hsnCode: "7326", price: 2499, stock: 45, taxRate: 18, unit: "pcs" },
    { id: "p2", name: "Wireless Mouse", hsnCode: "8471", price: 899, stock: 120, taxRate: 18, unit: "pcs" },
    { id: "p3", name: "USB-C Hub 7-in-1", hsnCode: "8473", price: 1799, stock: 78, taxRate: 18, unit: "pcs" },
    { id: "p4", name: "Monitor Arm - Dual", hsnCode: "7326", price: 3499, stock: 32, taxRate: 18, unit: "pcs" },
    { id: "p5", name: "Desk Organizer Set", hsnCode: "3926", price: 599, stock: 200, taxRate: 12, unit: "set" },
    { id: "p6", name: "Webcam HD 1080p", hsnCode: "8525", price: 2199, stock: 55, taxRate: 18, unit: "pcs" },
    { id: "p7", name: "Keyboard - Mechanical", hsnCode: "8471", price: 3999, stock: 40, taxRate: 18, unit: "pcs" },
    { id: "p8", name: "Cable Management Kit", hsnCode: "3926", price: 349, stock: 150, taxRate: 12, unit: "kit" },
];

export const invoices = [
    {
        id: "inv1", invoiceNumber: "INV-2026-001", customerId: "c1", customerName: "Acme Corporation",
        items: [
            { productId: "p1", productName: "Laptop Stand - Premium", quantity: 10, price: 2499, taxRate: 18, amount: 29488.2 },
            { productId: "p2", productName: "Wireless Mouse", quantity: 20, price: 899, taxRate: 18, amount: 21216.4 },
        ],
        subtotal: 42970, taxAmount: 7734.6, discount: 0, total: 50704.6, amountPaid: 50704.6, status: "PAID", date: "2026-01-15", dueDate: "2026-02-14"
    },
    {
        id: "inv2", invoiceNumber: "INV-2026-002", customerId: "c2", customerName: "Tech Solutions Ltd",
        items: [
            { productId: "p3", productName: "USB-C Hub 7-in-1", quantity: 15, price: 1799, taxRate: 18, amount: 31842.3 },
        ],
        subtotal: 26985, taxAmount: 4857.3, discount: 500, total: 31342.3, amountPaid: 15000, status: "PARTIAL", date: "2026-01-20", dueDate: "2026-02-19"
    },
    {
        id: "inv3", invoiceNumber: "INV-2026-003", customerId: "c3", customerName: "Green Farms Pvt Ltd",
        items: [
            { productId: "p5", productName: "Desk Organizer Set", quantity: 50, price: 599, taxRate: 12, amount: 33544 },
        ],
        subtotal: 29950, taxAmount: 3594, discount: 0, total: 33544, amountPaid: 0, status: "UNPAID", date: "2026-01-28", dueDate: "2026-02-27"
    },
    {
        id: "inv4", invoiceNumber: "INV-2026-004", customerId: "c4", customerName: "Star Retailers",
        items: [
            { productId: "p4", productName: "Monitor Arm - Dual", quantity: 5, price: 3499, taxRate: 18, amount: 20644.1 },
            { productId: "p6", productName: "Webcam HD 1080p", quantity: 10, price: 2199, taxRate: 18, amount: 25948.2 },
        ],
        subtotal: 39485, taxAmount: 7107.3, discount: 1000, total: 45592.3, amountPaid: 45592.3, status: "PAID", date: "2026-02-01", dueDate: "2026-03-02"
    },
    {
        id: "inv5", invoiceNumber: "INV-2026-005", customerId: "c5", customerName: "Bright Interiors",
        items: [
            { productId: "p7", productName: "Keyboard - Mechanical", quantity: 8, price: 3999, taxRate: 18, amount: 37750.56 },
            { productId: "p8", productName: "Cable Management Kit", quantity: 30, price: 349, taxRate: 12, amount: 11726.4 },
        ],
        subtotal: 42462, taxAmount: 7015, discount: 0, total: 49477, amountPaid: 20000, status: "PARTIAL", date: "2026-02-05", dueDate: "2026-03-06"
    },
];

export const payments = [
    { id: "pay1", invoiceId: "inv1", invoiceNumber: "INV-2026-001", customerName: "Acme Corporation", amount: 50704.6, mode: "BANK", date: "2026-01-20", note: "Full payment received" },
    { id: "pay2", invoiceId: "inv2", invoiceNumber: "INV-2026-002", customerName: "Tech Solutions Ltd", amount: 15000, mode: "UPI", date: "2026-01-25", note: "Partial payment" },
    { id: "pay3", invoiceId: "inv4", invoiceNumber: "INV-2026-004", customerName: "Star Retailers", amount: 45592.3, mode: "CARD", date: "2026-02-03" },
    { id: "pay4", invoiceId: "inv5", invoiceNumber: "INV-2026-005", customerName: "Bright Interiors", amount: 20000, mode: "CASH", date: "2026-02-06", note: "First installment" },
];

export const monthlyRevenue = [
    { month: "Sep", revenue: 125000, invoices: 12 },
    { month: "Oct", revenue: 198000, invoices: 18 },
    { month: "Nov", revenue: 165000, invoices: 15 },
    { month: "Dec", revenue: 210000, invoices: 22 },
    { month: "Jan", revenue: 175000, invoices: 19 },
    { month: "Feb", revenue: 95000, invoices: 8 },
];

export const paymentModeBreakdown = [
    { mode: "BANK", amount: 96296.9, count: 1 },
    { mode: "UPI", amount: 15000, count: 1 },
    { mode: "CARD", amount: 45592.3, count: 1 },
    { mode: "CASH", amount: 20000, count: 1 },
];

export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}