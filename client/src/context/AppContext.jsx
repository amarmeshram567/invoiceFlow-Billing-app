import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "sonner";



export const AppContext = createContext()


export const AppContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [invoiceList, setInvoiceList] = useState([]);
    const [paymentList, setPaymentList] = useState([]);

    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [outstandingInvoices, setOutstandingInvoices] = useState([]);

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    const [paymentModes, setPaymentModes] = useState([]);

    const [business, setBusiness] = useState(null);


    const fetchCustomers = async () => {
        try {
            const { data } = await api.get("/api/customers");
            if (data.success) {
                setCustomerList(data.customers);
            }
            else {
                toast.error("Failed to fetch customers:", data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load customers");
        }
    }


    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/api/products");
            if (data) {
                setProductList(data.products)
            }
            else {
                toast.error("Failed to fetch products");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products");
        }
    }


    const fetchInvoices = async () => {
        try {
            const { data } = await api.get("/api/invoices");

            const formatted = data.invoices.map((inv) => {
                const subtotal = Number(inv.subtotal);
                const cgst = Number(inv.cgst);
                const sgst = Number(inv.sgst);
                const igst = Number(inv.igst);
                const discount = Number(inv.discount);
                const total = Number(inv.total_amount);

                const taxAmount = cgst + sgst + igst;

                const customer = customerList.find(
                    (c) => c.id === inv.customer_id
                );

                const formattedItems = inv.items.map((item) => {
                    const product = productList.find(
                        (p) => p.id === item.product_id
                    );

                    const price = Number(item.price);
                    const qty = Number(item.quantity);
                    const tax = Number(item.tax_percent);

                    const lineTotal = price * qty;
                    const lineTax = lineTotal * (tax / 100);

                    return {
                        productId: item.product_id,
                        productName: product?.name || "Product",
                        quantity: qty,
                        price: price,
                        taxRate: tax,
                        amount: lineTotal + lineTax,
                    };
                });

                return {
                    id: inv.id,
                    invoiceNumber: `INV-${inv.invoice_number}`,
                    customerId: inv?.customer_id,
                    customerName: customer?.name,
                    items: formattedItems,
                    subtotal,
                    taxAmount,
                    discount,
                    total,
                    amountPaid: 0, // until payments implemented
                    status: inv.status,
                    date: inv.created_at.split("T")[0],
                    dueDate: inv.created_at.split("T")[0],
                };
            });

            setInvoiceList(formatted);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch invoices");
        }
    };


    const fetchPayments = async () => {
        try {
            const { data } = await api.get("/api/payments");
            if (data.success) {
                setPaymentList(data.payments);
            }
            else {
                toast.error("Failed to fetch payments:", data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load payments");
        }
    }


    const fetchPaymentModes = async () => {
        try {
            const { data } = await api.get("/api/payments/payment-modes");
            if (data.success) {
                setPaymentModes(data.paymentMode);
            }
            else {
                toast.error("Failed to fetch payment modes:", data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load payment modes");
        }
    }

    const fetchReports = async () => {
        try {
            const [dailyRes, monthlyRes, outstandingRes] = await Promise.all([
                api.get("/api/reports/daily-sales"),
                api.get("/api/reports/monthly-sales"),
                api.get("/api/reports/outstanding"),
            ]);

            setDailySales(dailyRes?.data?.daily_sales);
            setMonthlyRevenue(monthlyRes?.data?.monthly_sales);
            setOutstandingInvoices(outstandingRes?.data?.outstanding);

            // Total revenue from monthly
            const revenue = monthlyRes?.data?.monthly_sales?.reduce(
                (sum, m) => sum + Number(m?.revenue),
                0
            );


            setTotalRevenue(revenue);

            // Total paid from outstanding
            const paid = outstandingRes.data.outstanding.reduce(
                (sum, inv) => sum + inv.amountPaid,
                0
            );

            setTotalPaid(paid);

        } catch (error) {
            console.log(error);
        }
    };


    // console.log("Payment modes:", paymentModes);

    const outstandingAmount = outstandingInvoices.reduce(
        (sum, inv) => sum + (inv.total - inv.amountPaid),
        0
    );


    const fetchBusiness = async () => {
        try {
            const { data } = await api.get("/api/business");
            if (data.success) {
                setBusiness(data.business);
            }
            else {
                toast.error("Failed to fetch business info:", data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load business info");
        }
    }

    const value = {
        user,
        setUser,
        customerList, setCustomerList,
        fetchCustomers,
        productList, setProductList,
        fetchProducts,
        invoiceList, setInvoiceList,
        fetchInvoices,
        paymentList, setPaymentList,
        fetchPayments,
        monthlyRevenue, setMonthlyRevenue,
        dailySales, setDailySales,
        outstandingInvoices, setOutstandingInvoices,
        totalRevenue, setTotalRevenue,
        totalPaid, setTotalPaid,
        paymentModes, setPaymentModes,
        fetchPaymentModes,
        fetchReports,
        outstandingAmount,
        business, setBusiness,
        fetchBusiness,
        isAuthenticated: !!user,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => {
    return useContext(AppContext)
}


