import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "../services/data";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";


const fields = [
    {
        key: "name",
        label: "Product Name",
        col: "full",
        placeholder: "Enter product name",
    },
    {
        key: "hsn_code",
        label: "HSN Code",
        col: "half",
        placeholder: "Enter HSN code",
    },
    {
        key: "price",
        label: "Price",
        col: "half",
        placeholder: "Enter price",
    },
    {
        key: "stock_quantity",
        label: "Stock",
        col: "half",
        placeholder: "Enter stock quantity",
    },
    {
        key: "tax_percent",
        label: "Tax Rate (%)",
        col: "half",
        placeholder: "Enter tax rate",
    },
    {
        key: "unit",
        label: "Unit",
        col: "half",
        placeholder: "e.g. pcs, kg, box",
    },
];


const Products = () => {

    const { productList, setProductList, fetchProducts } = useAppContext();

    //const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    const [form, setForm] = useState({
        name: "",
        hsn_code: "",
        price: "",
        stock_quantity: "",
        tax_percent: "18",
        unit: "pcs",
    });



    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                await fetchProducts();
            } finally {
                setLoading(false);
            }
        }
        loadProducts()
    }, []);


    //console.log("Products:", productList);

    const filtered = productList.filter((p) =>
        (p?.name || "").toLowerCase().includes(search.toLowerCase())
    );


    const openAdd = () => {
        setEditing(null);
        setForm({
            name: "",
            hsn_code: "",
            price: "",
            stock_quantity: "",
            tax_percent: "18",
            unit: "pcs",
        });
        setModalOpen(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name,
            hsn_code: p.hsn_code,
            price: String(p.price),
            stock_quantity: String(p.stock_quantity),
            tax_percent: String(p.tax_percent),
            unit: p.unit,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price) {
            toast.error("Name and price are required");
            return;
        }

        try {
            setSaving(true);

            if (editing) {
                const { data } = await api.put(`/api/products/${editing.id}`, form);
                setProductList((prev) =>
                    prev.map((p) =>
                        p.id === editing.id
                            ? data.product : p
                    )
                );
                toast.success("Product updated");
            } else {

                const { data } = await api.post("/api/products", form);
                if (data.success) {
                    setProductList((prev) => [data.product, ...prev]);
                    toast.success("Product added");
                }
                else {
                    toast.error("Failed to add product:", data.message);
                }
            }

            setModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save product");
        }
        finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setSaving(true);
            await api.delete(`/api/products/${id}`);
            setProductList((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        {productList?.length} products
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="relative flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold transition-transform shadow-md glow-effect-hover duration-300 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    className="w-full pl-10 pr-3 py-2 rounded-lg border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted">
                            <tr className="text-muted-foreground">
                                <th className="text-left px-5 py-3">Product</th>
                                <th className="text-left px-5 py-3">HSN</th>
                                <th className="text-right px-5 py-3">Price</th>
                                <th className="text-right px-5 py-3">Stock</th>
                                <th className="text-right px-5 py-3">Tax %</th>
                                <th className="text-right px-5 py-3">Actions</th>
                            </tr>
                        </thead>

                        {/* <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-muted-foreground">
                                        No products found
                                    </td>
                                </tr>
                            ) :(
                                filtered.map((p) => (
                            <tr
                                key={p?.id}
                                className="border-b border-border hover:bg-muted/50"
                            >
                                <td className="px-5 py-3">
                                    <p className="font-medium text-foreground">{p?.name}</p>
                                    <p className="text-xs text-muted-foreground">{p?.unit}</p>
                                </td>

                                <td className="px-5 py-3 font-mono text-muted-foreground">
                                    {p.hsn_code}
                                </td>

                                <td className="px-5 py-3 text-right font-semibold">
                                    {formatCurrency(p?.price)}
                                </td>

                                <td className="px-5 py-3 text-right">
                                    <span
                                        className={`font-medium ${p?.stock < 40 ? "text-destructive" : "text-foreground"
                                            }`}
                                    >
                                        {p?.stock_quantity}
                                    </span>
                                </td>

                                <td className="px-5 py-3 text-right">{p?.tax_percent}%</td>

                                <td className="px-5 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(p)}
                                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p?.id)}
                                            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))
                            )}
                        </tbody> */}

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-muted-foreground">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr
                                        key={p?.id}
                                        className="border-b border-border hover:bg-muted/50"
                                    >
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-foreground">{p?.name}</p>
                                            <p className="text-xs text-muted-foreground">{p?.unit}</p>
                                        </td>

                                        <td className="px-5 py-3 font-mono text-muted-foreground">
                                            {p?.hsn_code}
                                        </td>

                                        <td className="px-5 py-3 text-right font-semibold">
                                            {formatCurrency(p?.price)}
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <span
                                                className={`font-medium ${p?.stock_quantity < 40
                                                    ? "text-destructive"
                                                    : "text-foreground"
                                                    }`}
                                            >
                                                {p?.stock_quantity}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            {p?.tax_percent}%
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(p?.id)}
                                                    className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50">
                    <div className="w-full max-w-md p-6 rounded-xl shadow-lg
                    bg-white dark:bg-zinc-900
                    border border-gray-200 dark:border-zinc-700">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold
                       text-gray-800 dark:text-gray-100">
                                {editing ? "Edit Product" : "Add Product"}
                            </h2>

                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fields.map(({ key, label, placeholder, col }) => (
                                <div
                                    key={key}
                                    className={`space-y-1 ${col === "full" ? "sm:col-span-2" : ""}`}
                                >
                                    <label
                                        htmlFor={key}
                                        className="text-sm font-medium
                         text-gray-700 dark:text-gray-300"
                                    >
                                        {label}
                                    </label>

                                    <input
                                        id={key}
                                        placeholder={placeholder}
                                        value={form[key]}
                                        onChange={(e) =>
                                            setForm({ ...form, [key]: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         placeholder: text-sm
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600
               text-gray-700 dark:text-gray-300 text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 hover:shadow-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-primary text-white text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 glow-effect-hover"
                            >
                                {saving
                                    ? (editing ? "Updating Product..." : "Adding Product...")
                                    : (editing ? "Update Product" : "Add Product")
                                }

                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Products;
