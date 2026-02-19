
const statusStyles = {
    PAID: "bg-success/10 text-success border-success/20",
    PARTIAL: "bg-accent/10 text-accent border-accent/20",
    UNPAID: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
            {status}
        </span>
    );
}
