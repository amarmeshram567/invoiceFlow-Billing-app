import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//import { customers as initialCustomers } from "../services/data";

import api from "../services/api";
import { useAppContext } from "../context/AppContext";


const fields = [
    {
        key: "name",
        label: "Name",
        placeholder: "Enter your full name",
        col: "full",
    },
    {
        key: "email",
        label: "Email",
        placeholder: "Enter your email address",
        col: "half",
    },
    {
        key: "phone",
        label: "Phone",
        placeholder: "Enter your phone number",
        col: "half",
    },
    {
        key: "gst_number",
        label: "GSTIN",
        placeholder: "Enter your GST number",
        col: "full",
    },
    {
        key: "address",
        label: "Address",
        placeholder: "Enter your address",
        col: "full",
    },
];



export default function Customers() {

    // const [customerList, setCustomerList] = useState([]);
    const { customerList, setCustomerList, fetchCustomers } = useAppContext();
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gst_number: "",
    });


    useEffect(() => {
        fetchCustomers()
    }, []);

    const filtered = customerList.filter(
        (c) => c && c.name && c.email && (
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        )
    );


    const openAdd = () => {
        setEditingCustomer(null);
        setForm({ name: "", email: "", phone: "", address: "", gst_number: "" });
        setModalOpen(true);
    };

    const openEdit = (c) => {
        setEditingCustomer(c);
        setForm({
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            gst_number: c.gst_number || "",
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.email) {
            toast.error("Name and email are required");
            return;
        }

        try {
            if (editingCustomer) {
                const { data } = await api.put(`/api/customers/${editingCustomer.id}`, form);
                setCustomerList((prev) =>
                    prev.map((c) =>
                        c.id === editingCustomer.id ? data.customer : c
                    )
                );
                toast.success("Customer updated");
            } else {
                const { data } = await api.post("/api/customers", form);

                if (data.success) {
                    setCustomerList((prev) => [data.customer, ...prev]);
                    toast.success("Customer added");
                } else {
                    toast.error("Failed to add customer: " + data.message);
                }
            }

            setModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/customers/${id}`);
            setCustomerList((prev) => prev.filter((c) => c.id !== id));
            toast.success("Customer deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete customer");
        }
    };

    console.log("CustomerList:", customerList)


    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Customers</h1>
                    <p className="text-sm text-muted-foreground">
                        {customerList.length} customers
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="relative flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold transition-transform shadow-md glow-effect-hover duration-300 hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    Add Customer
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3">Name</th>
                                <th className="text-left px-5 py-3">Email</th>
                                <th className="text-left px-5 py-3">Phone</th>
                                <th className="text-left px-5 py-3">GSTIN</th>
                                <th className="text-right px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <motion.tr
                                    key={c.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="border-b last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-5 py-3">
                                        <p className="font-medium">{c.name}</p>
                                        <p className="text-xs text-muted-foreground">{c.address}</p>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {c.email}
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {c.phone}
                                    </td>
                                    <td className="px-5 py-3 font-mono text-muted-foreground">
                                        {c.gst_number || "—"}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(c)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-12 text-muted-foreground"
                                    >
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {editingCustomer ? "Edit Customer" : "Add Customer"}
                                </h2>
                                <button onClick={() => setModalOpen(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {fields.map(({ key, label, placeholder, col }) => (
                                    <div key={key} className={`space-y-1 ${col === "full" ? "sm:col-span-2" : ""}`}>
                                        <label
                                            htmlFor={key}
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                         placeholder:text-sm
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                                        />
                                    </div>
                                ))}
                            </div>


                            {/* <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg
                     border border-gray-300 dark:border-zinc-600
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg
                     bg-primary text-white text-sm
                     hover:opacity-90"
                                >
                                    {editingCustomer ? "Update Customer" : "Add New Customer"}
                                </button>
                            </div> */}
                            <div className="flex justify-end gap-2 mt-6">
                                {/* Cancel Button */}
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600
               text-gray-700 dark:text-gray-300 text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancel
                                </button>

                                {/* Save / Add Button */}
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 glow-effect-hover"
                                >
                                    {editingCustomer ? "Update Customer" : "Add New Customer"}
                                </button>
                            </div>


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}
