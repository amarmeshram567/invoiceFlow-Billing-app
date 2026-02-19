import { FileText, CreditCard, Users, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
//import { customers, formatCurrency, invoices, monthlyRevenue, payments } from "../services/data";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { formatCurrency } from "../services/data";

export default function Dashboard() {

    const {
        customerList: customers,
        fetchCustomers,
        invoiceList: invoices,
        fetchInvoices,
        fetchPayments,
        monthlyRevenue,
        totalRevenue,
        paymentList,
        paymentModes: payments,
        fetchPaymentModes,
        fetchReports,
    } = useAppContext()



    useEffect(() => {
        fetchCustomers()
        fetchInvoices()
        fetchPayments()
        fetchPaymentModes()
        fetchReports()
    }, [])


    const totalPaid = paymentList.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );


    // console.log("Dashboard context data:", {
    //     customers,
    //     productList,
    //     invoices,
    //     paymentList,
    //     monthlyRevenue,
    //     dailySales,
    //     outstandingInvoices,
    //     totalRevenue,
    //     totalPaid,
    //     payments,
    //     outstandingAmount,
    // })



    const outstanding = totalRevenue - totalPaid;
    const unpaidCount = invoices?.filter((i) => i.status === "UNPAID").length;



    // console.log("Invoices : ", invoices);
    // console.log("Payments List : ", paymentList);
    // console.log("Monthly Revenue : ", monthlyRevenue);


    console.log("Customers:", customers);






    return (
        <div className="p-6 lg:p-8 space-y-8">
            <PageHeader title="Dashboard" subtitle="Overview of your business" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={FileText} variant="primary" trend={{ value: "12% from last month", positive: true }} />
                <StatCard title="Payments Received" value={formatCurrency(totalPaid)} icon={CreditCard} variant="success" subtitle={`${payments?.length} transactions`} />
                <StatCard title="Outstanding" value={formatCurrency(outstanding)} icon={AlertCircle} variant="warning" subtitle={`${unpaidCount} unpaid invoices`} />
                <StatCard title="Customers" value={String(customers?.length)} icon={Users} variant="default" trend={{ value: "2 new this month", positive: true }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-xl border shadow-card p-6">
                    <h2 className="text-lg font-semibold text-card-foreground mb-4">Monthly Revenue</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }}
                                formatter={(value) => [formatCurrency(value), "Revenue"]}
                            />
                            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-xl border shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-card-foreground">Recent Invoices</h2>
                        <Link to="/invoices" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {invoices?.slice(0, 5).map((inv) => (
                            <div key={inv?.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-card-foreground">{inv?.invoiceNumber}</p>
                                    <p className="text-xs text-muted-foreground">{inv?.customerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-card-foreground">{formatCurrency(inv?.total)}</p>
                                    <StatusBadge status={inv?.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Customers", to: "/customers", icon: Users },
                    { label: "Products", to: "/products", icon: FileText },
                    { label: "Invoices", to: "/invoices", icon: FileText },
                    { label: "Reports", to: "/reports", icon: CreditCard },
                ].map((link) => (
                    <Link key={link.to} to={link.to} className="flex items-center gap-3 bg-card border rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow group">
                        <link.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">{link.label}</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
