import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from "recharts";
import {
    TrendingUp,
    DollarSign,
    FileText,
    AlertCircle,
} from "lucide-react";
// invoices, monthlyRevenue, paymentModeBreakdown, payments 
import { formatCurrency } from "../services/data";
import { StatusBadge } from "../components/StatusBadge";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { useEffect, useState } from "react";
//import api from "../services/api";
import { useAppContext } from "../context/AppContext";


const COLORS = [
    "#0f766e",
    "#f59e0b",
    "#16a34a",
    "#64748b",
];

export default function Reports() {

    const {
        invoicesList: invoices, fetchInvoices,
        monthlyRevenue,
        outstandingInvoices,
        totalRevenue,
        totalPaid,
        paymentModes,
        fetchPaymentModes,
        fetchReports,
        outstandingAmount,
    } = useAppContext()


    // const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    // const [dailySales, setDailySales] = useState([]);
    // const [outstandingInvoices, setOutstandingInvoices] = useState([]);

    // const [totalRevenue, setTotalRevenue] = useState(0);
    // const [totalPaid, setTotalPaid] = useState(0);

    // const [paymentModes, setPaymentModes] = useState([]);


    useEffect(() => {
        fetchReports();
        fetchInvoices();
        fetchPaymentModes();
    }, []);



    // const fetchPaymentModes = async () => {
    //     try {
    //         const { data } = await api.get("/api/payments/payment-modes");
    //         if (data.success) {
    //             setPaymentModes(data.paymentMode);
    //         }
    //         else {
    //             toast.error("Failed to fetch payment modes:", data.message);
    //         }

    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Failed to load payment modes");
    //     }
    // }

    // const fetchReports = async () => {
    //     try {
    //         const [dailyRes, monthlyRes, outstandingRes] = await Promise.all([
    //             api.get("/api/reports/daily-sales"),
    //             api.get("/api/reports/monthly-sales"),
    //             api.get("/api/reports/outstanding"),
    //         ]);

    //         setDailySales(dailyRes.data.daily_sales);
    //         setMonthlyRevenue(monthlyRes.data.monthly_sales);
    //         setOutstandingInvoices(outstandingRes.data.outstanding);

    //         // Total revenue from monthly
    //         const revenue = monthlyRes.data.monthly_sales.reduce(
    //             (sum, m) => sum + Number(m.revenue),
    //             0
    //         );


    //         setTotalRevenue(revenue);

    //         // Total paid from outstanding
    //         const paid = outstandingRes.data.outstanding.reduce(
    //             (sum, inv) => sum + inv.amountPaid,
    //             0
    //         );

    //         setTotalPaid(paid);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    //console.log("Payment modes:", paymentModes);

    // const outstandingAmount = outstandingInvoices.reduce(
    //     (sum, inv) => sum + (inv.total - inv.amountPaid),
    //     0
    // );

    //console.log("Outstanding invoices:", outstandingAmount);

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <PageHeader title="Reports" subtitle="Business analytics and insights" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    icon={TrendingUp}
                    variant="primary"
                    trend={{ positive: true, value: "12%" }}
                />

                <StatCard
                    title="Collected"
                    value={formatCurrency(totalPaid)}
                    icon={DollarSign}
                    variant="success"
                    trend={{ positive: true, value: "8%" }}
                />

                <StatCard
                    title="Outstanding"
                    value={formatCurrency(outstandingAmount)}
                    icon={AlertCircle}
                    variant="warning"
                    trend={{ positive: false, value: "5%" }}
                />

                <StatCard
                    title="Invoices"
                    value={String(invoices?.length || 0)}
                    subtitle={`${outstandingInvoices?.length || 0} pending`}
                    icon={FileText}
                    variant="default"
                />
            </div>


            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <div className="bg-card border rounded-xl p-6">
                    <h2 className="font-semibold mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis
                                fontSize={12}
                                tickFormatter={(v) => `₹${v / 1000}k`}
                            />
                            <Tooltip formatter={(v) => formatCurrency(v)} />
                            <Bar dataKey="revenue" fill="#0f766e" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Modes */}
                <div className="bg-card border rounded-xl p-6">
                    <h2 className="font-semibold mb-4">Payment Modes</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={paymentModes}
                                dataKey="amount"
                                nameKey="mode"
                                innerRadius={60}
                                outerRadius={100}
                                label
                            >
                                {paymentModes?.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => formatCurrency(v)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Invoice Trend */}
            <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Invoice Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0f766e"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Outstanding Invoices */}
            <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Outstanding Invoices</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs">Invoice</th>
                                <th className="px-4 py-3 text-left text-xs">Customer</th>
                                {/* <th className="px-4 py-3 text-left text-xs">Due Date</th> */}
                                <th className="px-4 py-3 text-right text-xs">Total</th>
                                <th className="px-4 py-3 text-right text-xs">Balance</th>
                                <th className="px-4 py-3 text-center text-xs">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outstandingInvoices?.map((inv) => (
                                <tr key={inv?.id} className="border-b">
                                    <td className="px-4 py-3 text-sm font-medium">
                                        {inv?.invoiceNumber}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {inv?.customerName}
                                    </td>
                                    {/* <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {inv.dueDate}
                                    </td> */}
                                    <td className="px-4 py-3 text-sm text-right font-semibold">
                                        {formatCurrency(inv?.total)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                                        {formatCurrency(inv?.total - inv?.amountPaid)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={inv?.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
