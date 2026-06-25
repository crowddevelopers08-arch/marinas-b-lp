"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

type Payment = {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  method: string;
  name: string;
  phone: string;
  createdAt: string;
};

type Submission = {
  id: string;
  source: string;
  name: string;
  phone: string;
  concern: string;
  pageUrl: string;
  createdAt: string;
};

type Row =
  | { kind: "payment";    data: Payment }
  | { kind: "submission"; data: Submission };

type Filter = "all" | "captured" | "failed" | "leads";

const STATUS_STYLE: Record<string, string> = {
  captured:   "bg-emerald-100 text-emerald-700",
  failed:     "bg-red-100 text-red-700",
  authorized: "bg-blue-100 text-blue-700",
  refunded:   "bg-yellow-100 text-yellow-700",
};

function FilterBtn({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
        active
          ? "bg-[var(--vk-green)] text-white shadow-[0_4px_14px_rgba(18,110,110,0.24)]"
          : "border border-[var(--vk-green)]/25 text-[var(--vk-green)] hover:bg-[var(--vk-green)]/10"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${active ? "bg-white/20 text-white" : "bg-[var(--vk-green)]/10 text-[var(--vk-green)]"}`}>
        {count}
      </span>
    </button>
  );
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function downloadCSV(rows: Row[]) {
  if (!rows.length) return;
  const headers = ["Date", "Name", "Phone", "Type", "Amount / Concern", "Status / Source", "Method"];
  const data = rows.map((r) => {
    if (r.kind === "payment") {
      const p = r.data;
      return [fmt(p.createdAt), p.name, p.phone, "Payment", `₹${p.amount}`, p.status, p.method || "—"];
    }
    const s = r.data;
    return [fmt(s.createdAt), s.name, s.phone, "Lead", s.concern, s.source, "—"];
  });
  const csv = [headers, ...data].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `dashboard_${Date.now()}.csv`,
  });
  a.click();
}

export default function DashboardPage() {
  const [payments, setPayments]     = useState<Payment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState<Filter>("all");

  const fetchAll = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setPayments(json.payments ?? []);
      setSubmissions(json.submissions ?? []);
    } catch (err) {
      setError(`Failed to load: ${err instanceof Error ? err.message : err}`);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const captured = payments.filter((p) => p.status === "captured");
  const failed   = payments.filter((p) => p.status === "failed");
  const total    = captured.reduce((s, p) => s + p.amount, 0);
  const exited   = submissions.filter((s) => s.source === "Payment-Exited");

  const filteredRows: Row[] =
    filter === "captured" ? captured.map((d)    => ({ kind: "payment",    data: d })) :
    filter === "failed"   ? failed.map((d)      => ({ kind: "payment",    data: d })) :
    filter === "leads"    ? submissions.map((d) => ({ kind: "submission", data: d })) :
    [
      ...payments.map((d): Row    => ({ kind: "payment",    data: d })),
      ...submissions.map((d): Row => ({ kind: "submission", data: d })),
    ].sort((a, b) =>
      new Date(b.kind === "payment" ? b.data.createdAt : b.data.createdAt).getTime() -
      new Date(a.kind === "payment" ? a.data.createdAt : a.data.createdAt).getTime()
    );

  return (
    <div className="min-h-screen bg-[var(--vk-lime-soft)] text-[var(--vk-green-dark)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[var(--vk-green)]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/Marina-logo.png" alt="Marina's Clinic" width={120} height={40} className="h-9 w-auto" />
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-[var(--vk-green)] sm:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCSV(filteredRows)}
              disabled={filteredRows.length === 0}
              className="rounded-full bg-[var(--vk-green)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_14px_rgba(18,110,110,0.24)] transition hover:bg-[var(--vk-pink-dark)] disabled:opacity-40"
            >↓ CSV</button>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="rounded-full border border-[var(--vk-green)]/30 px-4 py-2 text-xs font-semibold text-[var(--vk-green)] transition hover:bg-[var(--vk-green)] hover:text-white disabled:opacity-50"
            >{loading ? "Refreshing…" : "↺ Refresh"}</button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Collected",    value: `₹${total.toLocaleString("en-IN")}` },
            { label: "Captured",           value: captured.length },
            { label: "Failed",             value: failed.length },
            { label: "Exited Without Pay", value: exited.length },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-[var(--vk-green)]/10 bg-white p-5 shadow-[0_4px_18px_rgba(18,110,110,0.07)]">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{c.label}</div>
              <div className="font-serif text-3xl font-black text-[var(--vk-green-dark)]">{c.value}</div>
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {/* Filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterBtn label="All"       count={payments.length + submissions.length} active={filter === "all"}      onClick={() => setFilter("all")} />
          <FilterBtn label="Captured"  count={captured.length}                      active={filter === "captured"} onClick={() => setFilter("captured")} />
          <FilterBtn label="Failed"    count={failed.length}                        active={filter === "failed"}   onClick={() => setFilter("failed")} />
          <FilterBtn label="All Leads" count={submissions.length}                   active={filter === "leads"}    onClick={() => setFilter("leads")} />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--vk-green)]/10 bg-white shadow-[0_4px_18px_rgba(18,110,110,0.07)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--vk-green)]/10 bg-[var(--vk-lime-soft)]">
                  {["Date", "Name", "Phone", "Type", "Amount / Concern", "Status / Source", "Method"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--vk-green)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">Loading…</td></tr>
                ) : filteredRows.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">No records found.</td></tr>
                ) : filteredRows.map((r, i) => {
                  if (r.kind === "payment") {
                    const p = r.data;
                    return (
                      <tr key={p.id} className={`border-b border-[var(--vk-green)]/5 transition hover:bg-[var(--vk-lime-soft)]/50 ${i % 2 ? "bg-gray-50/40" : ""}`}>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{fmt(p.createdAt)}</td>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-[var(--vk-green)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--vk-green)]">Payment</span></td>
                        <td className="px-4 py-3 font-semibold">₹{p.amount.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[p.status] ?? "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                        <td className="px-4 py-3 capitalize text-gray-600">{p.method || "—"}</td>
                      </tr>
                    );
                  }
                  const s = r.data;
                  return (
                    <tr key={s.id} className={`border-b border-[var(--vk-green)]/5 transition hover:bg-[var(--vk-lime-soft)]/50 ${i % 2 ? "bg-gray-50/40" : ""}`}>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">{fmt(s.createdAt)}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">Lead</span></td>
                      <td className="px-4 py-3 text-gray-600">{s.concern}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.source === "Payment-Exited" ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>{s.source}</span></td>
                      <td className="px-4 py-3 text-gray-400">—</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          {filteredRows.length} records · <a href="/" className="text-[var(--vk-green)] hover:underline">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
