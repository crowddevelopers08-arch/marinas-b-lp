import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      event,
      name = "",
      phone = "",
    } = await req.json();

    if (event !== "payment.failed") {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
      }
    }

    // Fetch payment details from Razorpay and save to DB
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payment: any = await razorpay.payments.fetch(razorpay_payment_id);
      await prisma.payment.upsert({
        where: { id: razorpay_payment_id },
        update: {
          orderId: razorpay_order_id,
          amount: Number(payment.amount) / 100,
          currency: payment.currency ?? "INR",
          status: payment.status ?? "captured",
          method: payment.method ?? "",
          name: payment.notes?.name ?? name,
          phone: payment.notes?.phone ?? phone ?? payment.contact ?? "",
        },
        create: {
          id:       razorpay_payment_id,
          orderId:  razorpay_order_id,
          amount:   Number(payment.amount) / 100,
          currency: payment.currency ?? "INR",
          status:   payment.status ?? "captured",
          method:   payment.method ?? "",
          name:     payment.notes?.name ?? name,
          phone:    payment.notes?.phone ?? phone ?? payment.contact ?? "",
        },
      });
    } catch (dbErr) {
      console.error("Payment DB save failed:", dbErr);
      return NextResponse.json({
        success: false,
        error: "Payment verified, but DB save failed",
        detail: dbErr instanceof Error ? dbErr.message : String(dbErr),
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
