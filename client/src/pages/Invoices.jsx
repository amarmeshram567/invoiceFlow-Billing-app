import { useEffect, useState } from "react";
import { Plus, Eye, Search, X } from "lucide-react";
import { formatCurrency, invoices } from "../services/data";
import { StatusBadge } from "../components/StatusBadge";
import { toast } from "sonner"
import { useAppContext } from "../context/AppContext";
import api from "../services/api";


export default function Invoices() {

    const {
        customerList: customers,
        productList: products,
        fetchCustomers,
        fetchProducts,
        invoiceList,
        fetchInvoices
    } = useAppContext();


    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [createOpen, setCreateOpen] = useState(false);
    const [viewInvoice, setViewInvoice] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [lineItems, setLineItems] = useState([]);
    const [discount, setDiscount] = useState(0);


    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (customers.length && products.length) {
            fetchInvoices();
        }
    }, [customers, products]);





    const filtered = invoiceList.filter((inv) => {
        const matchSearch =
            inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            inv.customerName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || inv.status === statusFilter;
        return matchSearch && matchStatus;
    });


    console.log("Customers:", customers);
    console.log("Products:", products);
    console.log("Invoices:", invoiceList);
    console.log("Filtered:", filtered);

    const addLineItem = () => setLineItems([...lineItems, { productId: "", quantity: 1 }]);
    const removeLineItem = (idx) => setLineItems(lineItems.filter((_, i) => i !== idx));
    const updateLineItem = (idx, field, value) =>
        setLineItems(lineItems.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

    const computeTotals = () => {
        let subtotal = 0;
        let taxAmount = 0;
        const items = [];
        lineItems.forEach((li) => {
            const prod = products.find((p) => p.id === li.productId);
            if (!prod) return;
            const lineTotal = prod.price * li.quantity;
            const lineTax = lineTotal * (prod.taxRate / 100);
            subtotal += lineTotal;
            taxAmount += lineTax;
            items.push({
                productId: prod.id,
                productName: prod.name,
                quantity: li.quantity,
                price: prod.price,
                taxRate: prod.tax_percent,
                amount: lineTotal + lineTax,
            });
        });
        return { items, subtotal, taxAmount, total: subtotal + taxAmount - discount };
    };


    const handleCreate = async () => {
        if (!selectedCustomer || lineItems.length === 0) {
            toast.error("Select a customer and add items");
            return;
        }

        const itemsPayload = lineItems.map((li) => {
            const prod = products.find((p) => p.id === li.productId);
            return {
                product_id: prod.id,
                qty: li.quantity,
                price: prod.price,
                tax: prod.tax_percent,
            }
        });

        try {

            await api.post("/api/invoices", {
                customer_id: selectedCustomer,
                items: itemsPayload,
                discount,
            });
            toast.success("Invoice created");
            setCreateOpen(false);
            setSelectedCustomer("");
            setLineItems([]);
            setDiscount(0);

            fetchInvoices();
        } catch (error) {
            console.log("Create Invoice Error:", error);
            console.log("Response:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to create invoice");
        }
    }

    const { subtotal, taxAmount, total } = computeTotals();

    console.log("Invoices filtered: ", filtered)

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Invoices</h1>
                    <p className="text-sm text-muted-foreground">{invoiceList.length} invoices</p>
                </div>
                <button
                    className="relative flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold transition-transform shadow-md glow-effect-hover duration-300 hover:-translate-y-1"
                    onClick={() => {
                        setCreateOpen(true);
                        setLineItems([{ productId: "", quantity: 1 }]);
                    }}
                >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    Create Invoice
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-3 py-2 border rounded-lg w-full bg-card text-card-foreground"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="
                        px-5 py-2 rounded-lg border transition
                        bg-background text-foreground
                        border-border
                        focus:outline-none
                        focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)]
                    "
                >
                    <option value="ALL">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="UNPAID">Unpaid</option>
                </select>

            </div>

            {/* Invoice Table */}
            <div className="bg-card rounded-xl border shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-5 py-3 text-left">Invoice</th>
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-right">Total</th>
                                <th className="px-5 py-3 text-right">Paid</th>
                                <th className="px-5 py-3 text-center">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((inv) => (
                                <tr
                                    key={inv.id}
                                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-5 py-3">{inv.invoiceNumber}</td>
                                    <td className="px-5 py-3">{inv.customerName}</td>
                                    <td className="px-5 py-3">{inv.date}</td>
                                    <td className="px-5 py-3 text-right font-semibold">{formatCurrency(inv.total)}</td>
                                    <td className="px-5 py-3 text-right">{formatCurrency(inv.amountPaid)}</td>
                                    <td className="px-5 py-3 text-center">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex justify-center">
                                            <button onClick={() => setViewInvoice(inv)}>
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {createOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

                        {/* Customer */}
                        <div className="mb-4">
                            <label className="block mb-1">Customer *</label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg bg-card text-card-foreground"
                            >
                                <option value="">Select customer</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Line Items */}
                        <div className="mb-4">
                            <label className="block mb-1">Line Items</label>
                            {lineItems.map((li, idx) => (
                                <div key={idx} className="flex gap-2 items-end mb-2">
                                    <select
                                        value={li.productId}
                                        onChange={(e) => updateLineItem(idx, "productId", e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-lg bg-card text-card-foreground"
                                    >
                                        <option value="">Select product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — {formatCurrency(p.price)}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        value={li.quantity}
                                        onChange={(e) => updateLineItem(idx, "quantity", Number(e.target.value))}
                                        className="w-24 px-3 py-2 border rounded-lg text-right bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Qty"
                                    />
                                    <button
                                        className="text-destructive px-2 py-1 rounded-lg border"
                                        onClick={() => removeLineItem(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                className="flex items-center gap-1 px-3 py-1 border rounded-lg text-primary"
                                onClick={addLineItem}
                            >
                                <Plus className="w-3 h-3" /> Add Item
                            </button>
                        </div>

                        {/* Discount */}
                        <div className="mb-4 max-w-xs">
                            <label className="block mb-1">Discount (₹)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                            />
                        </div>

                        {/* Totals */}
                        <div className="bg-muted rounded-lg p-4 space-y-1 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{formatCurrency(taxAmount)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-destructive">-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600
               text-gray-700 dark:text-gray-300 text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 hover:shadow-lg"
                                onClick={() => setCreateOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 glow-effect-hover" onClick={handleCreate}>
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {viewInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto print-area">
                        <h2 className="text-xl font-bold mb-4">{viewInvoice.invoiceNumber}</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-medium">{viewInvoice.customerName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date</p>
                                <p className="font-medium">{viewInvoice.date}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Due Date</p>
                                <p className="font-medium">{viewInvoice.dueDate}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                {/* <p className="font-medium">{viewInvoice.status}</p> */}
                                <StatusBadge status={viewInvoice.status} />
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden mb-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="text-left px-3 py-2">Item</th>
                                        <th className="text-right px-3 py-2">Qty</th>
                                        <th className="text-right px-3 py-2">Price</th>
                                        <th className="text-right px-3 py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewInvoice.items.map((item, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="px-3 py-2">{item.productName}</td>
                                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(viewInvoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{formatCurrency(viewInvoice.taxAmount)}</span>
                            </div>
                            {viewInvoice.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-destructive">-{formatCurrency(viewInvoice.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(viewInvoice.total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Paid</span>
                                <span className="text-success">{formatCurrency(viewInvoice.amountPaid)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Balance</span>
                                <span className="text-destructive">
                                    {formatCurrency(viewInvoice.total - viewInvoice.amountPaid)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-3 gap-2 print:hidden">
                            <button
                                className="px-4 py-2 border rounded-lg"
                                onClick={() => window.print()}
                            >
                                Print
                            </button>

                            <button
                                className="px-4 py-2 border rounded-lg"
                                onClick={() => setViewInvoice(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
