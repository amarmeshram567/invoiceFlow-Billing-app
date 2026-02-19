import { useEffect, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "../components/PageHeader";
import { formatCurrency } from "../services/data";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";


const modeStyles = {
    CASH: "bg-success/10 text-success",
    UPI: "bg-primary/10 text-primary",
    CARD: "bg-accent/10 text-accent",
    BANK: "bg-secondary text-secondary-foreground",
}

export function PaymentModeBadge({ mode }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${modeStyles[mode]}`}>
            {mode}
        </span>
    )
}


export default function Payments() {

    const { paymentList, fetchPayments, fetchInvoices, invoiceList: invoices } = useAppContext();

    //const [paymentList, setPaymentList] = useState(payments);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState({
        invoiceId: "",
        amount: "",
        mode: "CASH",
        note: "",
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        const loadPayments = async () => {
            try {
                setLoading(true);
                await fetchPayments();
                await fetchInvoices();
            } finally {
                setLoading(false);
            }
        }
        loadPayments();
    }, [])


    // console.log("Invoices:", invoices);
    // console.log("Payments:", paymentList);

    const filtered = paymentList.filter(
        (p) =>
            p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            p.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const totalReceived = paymentList.reduce((sum, p) => sum + p.amount, 0);


    const handleAdd = async () => {
        if (!form.invoiceId || !form.amount) {
            toast.error("Invoice and amount required");
            return;
        }

        try {
            setSaving(true);
            const { data } = await api.post("/api/payments", {
                invoice_id: form.invoiceId,
                amount: Number(form.amount),
                mode: form.mode,
                note: form.note
            });

            if (data.success) {
                toast.success("Payment recorded");

                fetchPayments();
                fetchInvoices();

                setModalOpen(false);
                setForm({ invoiceId: "", amount: "", mode: "CASH", note: "" });
            }
        } catch (error) {
            toast.error("Failed to record payment");
        }
        finally {
            setSaving(false);
        }
    }



    return (
        <div className="p-6 lg:p-8 space-y-6">
            <PageHeader
                title="Payments"
                subtitle={`Total received: ${formatCurrency(totalReceived)}`}
                action={


                    <button
                        onClick={() => setModalOpen(true)}
                        className="relative flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold transition-transform shadow-md glow-effect-hover duration-300 hover:-translate-y-1"
                    >
                        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                        Record Payment
                    </button>


                }
            />

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    className="w-full pl-10 pr-3 py-2 border rounded-lg bg-background"
                    placeholder="Search payments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs">Invoice</th>
                                <th className="px-5 py-3 text-left text-xs">Customer</th>
                                <th className="px-5 py-3 text-left text-xs">Date</th>
                                <th className="px-5 py-3 text-right text-xs">Amount</th>
                                <th className="px-5 py-3 text-center text-xs">Mode</th>
                                <th className="px-5 py-3 text-left text-xs">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-muted-foreground">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id} className="border-b hover:bg-muted/30">
                                        <td className="px-5 py-3 text-sm font-medium">
                                            {p.invoiceNumber}
                                        </td>

                                        <td className="px-5 py-3 text-sm text-muted-foreground">
                                            {p.customerName}
                                        </td>

                                        <td className="px-5 py-3 text-sm text-muted-foreground">
                                            {p.date}
                                        </td>

                                        <td className="px-5 py-3 text-sm font-semibold text-right">
                                            {formatCurrency(p.amount)}
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <PaymentModeBadge mode={p.mode} />
                                        </td>

                                        <td className="px-5 py-3 text-sm text-muted-foreground">
                                            {p.note || "—"}
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
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="w-full max-w-md p-6 rounded-xl shadow-lg
                    bg-white dark:bg-zinc-900
                    border border-gray-200 dark:border-zinc-700">
                        <h2 className="text-lg font-semibold text-gray-800">Record Payment</h2>

                        {/* Invoices */}
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-700">Invoice *</label>
                            <select
                                className="w-full mt-1 border border-gray-200 text-gray-700 text-sm outline-primary rounded-lg px-3 py-2"
                                value={form.invoiceId}
                                onChange={(e) =>
                                    setForm({ ...form, invoiceId: e.target.value })
                                }
                            >
                                <option value="">Select invoice</option>
                                {invoices
                                    .filter((i) => i.status !== "PAID")
                                    .map((i) => (
                                        <option key={i.id} value={i.id}>
                                            {i.invoiceNumber} — {i.customerName}
                                        </option>
                                    ))}
                            </select>

                        </div>

                        {/* Amount */}
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-700">Amount *</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                                value={form.amount}
                                onChange={(e) =>
                                    setForm({ ...form, amount: e.target.value })
                                }
                            />
                        </div>

                        {/* Payment Mode */}
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-700">Payment Mode</label>
                            <select
                                className="w-full mt-1 border border-gray-200 outline-primary text-sm rounded-lg px-3 py-2 text-gray-700"
                                value={form.mode}
                                onChange={(e) =>
                                    setForm({ ...form, mode: e.target.value })
                                }
                            >
                                <option value="CASH">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="CARD">Card</option>
                                <option value="BANK">Bank Transfer</option>
                            </select>
                        </div>

                        {/* Note */}
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-700">Note</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                                value={form.note}
                                onChange={(e) =>
                                    setForm({ ...form, note: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 mt-3">
                            <button
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600
               text-gray-700 dark:text-gray-300 text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 hover:shadow-lg"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-primary text-white text-sm
               transition-transform transition-shadow duration-300 ease-out
               hover:-translate-y-1 glow-effect-hover"
                                onClick={handleAdd}
                            >
                                {saving ? "Recording..." : "Record Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
