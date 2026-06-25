import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const count = Number(searchParams.get("count") ?? "100");
    const skip  = Number(searchParams.get("skip")  ?? "0");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await razorpay.payments.all({ count, skip });

    console.log("Razorpay payments response:", JSON.stringify(response).slice(0, 300));

    // Handle both array response and {items:[]} response
    const items: unknown[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.items)
      ? response.items
      : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = items.map((p: any) => ({
      id:        p.id ?? "—",
      orderId:   p.order_id ?? "—",
      amount:    Number(p.amount ?? 0) / 100,
      currency:  p.currency ?? "INR",
      status:    p.status ?? "—",
      method:    p.method ?? "—",
      contact:   p.contact ?? "—",
      email:     p.email ?? "—",
      name:      p.notes?.name ?? p.description ?? "—",
      phone:     p.notes?.phone ?? p.contact ?? "—",
      createdAt: p.created_at
        ? new Date(Number(p.created_at) * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : "—",
    }));

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error("Payments fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch payments", detail: String(err) }, { status: 500 });
  }
}
