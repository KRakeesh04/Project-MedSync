import { useEffect, useState } from "react"
import axios from "axios"
import {type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/pages/users/data-table"

export type BillingInvoice = {
  appointment_id: number
  additional_fee: number
  total_fee: number
  claim_id: number | null
  net_amount: number
  remaining_payment_amount: number
  time_stamp: string
}

const columns: ColumnDef<BillingInvoice>[] = [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "total_fee",
    header: "Total Fee",
    cell: ({ row }) => `Rs. ${Number(row.getValue("total_fee")).toFixed(2)}`,
  },
  {
    accessorKey: "net_amount",
    header: "Net Amount",
    cell: ({ row }) => `Rs. ${Number(row.getValue("net_amount")).toFixed(2)}`,
  },
  {
    accessorKey: "remaining_payment_amount",
    header: "Remaining",
    cell: ({ row }) => {
      const value = Number(row.getValue("remaining_payment_amount"))
      return (
        <span
          className={
            value > 0
              ? "text-red-600 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          Rs. {value.toFixed(2)}
        </span>
      )
    },
  },
  {
    accessorKey: "additional_fee",
    header: "Additional Fee",
    cell: ({ row }) => {
      const fee = Number(row.getValue("additional_fee"))
      return fee ? `Rs. ${fee.toFixed(2)}` : "-"
    },
  },
  {
    accessorKey: "time_stamp",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("time_stamp")).toLocaleDateString(),
  },
]

export default function BillingInvoicesPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("/api/invoice", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Error fetching invoices:", err))
      .finally(() => setLoading(false))
  }, [])

  // Filter for outstanding balances (remaining > 0)
  const outstanding = invoices.filter(
    (inv) => inv.remaining_payment_amount > 0
  )

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Billing Management
      </h1>

      {/* 🧾 All Invoices Section */}
      <section>
        <h2 className="text-xl font-medium mb-3">All Billing Invoices</h2>
        {loading ? (
          <p className="text-gray-500">Loading invoices...</p>
        ) : (
          <DataTable columns={columns} data={invoices} />
        )}
      </section>

      {/* 💰 Outstanding Balances Section */}
      <section>
        <h2 className="text-xl font-medium mb-3 text-red-700">
          Outstanding Balances
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading balances...</p>
        ) : outstanding.length > 0 ? (
          <DataTable columns={columns} data={outstanding} />
        ) : (
          <p className="text-green-600 font-medium">
            🎉 All invoices are fully paid!
          </p>
        )}
      </section>
    </div>
  )
}
