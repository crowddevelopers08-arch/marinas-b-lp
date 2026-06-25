import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, formName } = body;

    const order = await razorpay.orders.create({
      amount: 100, // minimum 100 paise = ₹1 for test; change to 150000 for production
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { name: name ?? "", phone: phone ?? "", formName: formName ?? "Marina Bariatrics" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
