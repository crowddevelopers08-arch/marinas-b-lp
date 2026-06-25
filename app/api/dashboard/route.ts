import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DashboardSubmission = {
  id: string;
  createdAt: Date;
  formName: string;
  source: string;
  name: string;
  phone: string;
  concern: string;
  pageUrl: string;
  telecrm: string;
};

type DashboardPayment = {
  id: string;
  createdAt: Date;
  formName: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  name: string;
  phone: string;
};

type RazorpayPayment = {
  id?: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  method?: string;
  notes?: {
    name?: string;
    phone?: string;
    formName?: string;
  };
  contact?: string;
  created_at?: number;
};

const CSV_PATH = path.join(process.cwd(), "data", "submissions.csv");
const DASHBOARD_FORM_NAME = process.env.DASHBOARD_FORM_NAME ?? "Marina Bariatrics";

function inferFormName(source: string, formName?: string) {
  if (formName?.trim()) return formName.trim();
  if (source.includes("Client Feedback")) return "Marina Client Feedback";
  return "Marina Bariatrics";
}

function isDashboardForm(record: { formName: string }) {
  return record.formName.trim().toLowerCase() === DASHBOARD_FORM_NAME.trim().toLowerCase();
}

function getPersonKey(record: { name: string; phone: string }) {
  return `${record.name.trim().toLowerCase()}|${record.phone.replace(/\D/g, "")}`;
}

function filterFormPayments(payments: DashboardPayment[], submissions: DashboardSubmission[]) {
  const submissionKeys = new Set(submissions.map(getPersonKey));

  return payments.filter((payment) => {
    if (isDashboardForm(payment)) return true;
    if (payment.formName.trim()) return false;
    return submissionKeys.has(getPersonKey(payment));
  });
}

function filterPaymentAttemptSubmissions(submissions: DashboardSubmission[], payments: DashboardPayment[]) {
  const paymentWindowMs = 10 * 60 * 1000;
  const paymentAttemptSources = new Set(["Consultation Modal", "Payment-Exited"]);

  return submissions.filter((submission) => {
    if (!paymentAttemptSources.has(submission.source)) return true;

    const submissionTime = new Date(submission.createdAt).getTime();
    const hasMatchingPayment = payments.some((payment) => (
      getPersonKey(payment) === getPersonKey(submission) &&
      Math.abs(new Date(payment.createdAt).getTime() - submissionTime) <= paymentWindowMs
    ));

    return !hasMatchingPayment;
  });
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells.map((value) => value.trim());
}

function parseIndianTimestamp(value: string) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return new Date(value);

  const [, day, month, year, hourText, minute, second, meridiem] = match;
  let hour = Number(hourText);
  if (meridiem.toLowerCase() === "pm" && hour < 12) hour += 12;
  if (meridiem.toLowerCase() === "am" && hour === 12) hour = 0;

  return new Date(Number(year), Number(month) - 1, Number(day), hour, Number(minute), Number(second));
}

function getSubmissionKey(submission: Pick<DashboardSubmission, "formName" | "source" | "name" | "phone" | "concern" | "pageUrl">) {
  return [
    submission.formName,
    submission.source,
    submission.name,
    submission.phone,
    submission.concern,
    submission.pageUrl,
  ].map((value) => value.trim().toLowerCase()).join("|");
}

function readCsvSubmissions(): DashboardSubmission[] {
  if (!fs.existsSync(CSV_PATH)) return [];

  const text = fs.readFileSync(CSV_PATH, "utf8").trim();
  if (!text) return [];

  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];

  return lines.slice(1).map((line, index) => {
    const [timestamp, source, name, phone, concern, pageUrl, telecrm, formName] = parseCsvLine(line);

    return {
      id: `csv-${index}`,
      createdAt: parseIndianTimestamp(timestamp),
      formName: inferFormName(source || "", formName),
      source: source || "",
      name: name || "",
      phone: phone || "",
      concern: concern || "",
      pageUrl: pageUrl || "",
      telecrm: telecrm || "",
    };
  });
}

async function fetchRazorpayPayments(): Promise<DashboardPayment[]> {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return [];

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const response = await razorpay.payments.all({ count: 100 });
    const items = Array.isArray(response) ? response : response.items ?? [];

    return (items as RazorpayPayment[]).map((payment) => ({
      id: payment.id ?? "",
      createdAt: payment.created_at ? new Date(payment.created_at * 1000) : new Date(),
      formName: payment.notes?.formName?.trim() || "",
      orderId: payment.order_id ?? "",
      amount: Number(payment.amount ?? 0) / 100,
      currency: payment.currency ?? "INR",
      status: payment.status ?? "",
      method: payment.method ?? "",
      name: payment.notes?.name ?? "",
      phone: payment.notes?.phone ?? payment.contact ?? "",
    })).filter((payment) => payment.id);
  } catch (err) {
    console.warn("Razorpay dashboard fetch skipped:", err);
    return [];
  }
}

async function syncRazorpayPaymentsToDb(payments: DashboardPayment[]) {
  await Promise.all(payments.map((payment) => prisma.payment.upsert({
    where: { id: payment.id },
    update: {
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      name: payment.name,
      phone: payment.phone,
    },
    create: {
      id: payment.id,
      createdAt: payment.createdAt,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      name: payment.name,
      phone: payment.phone,
    },
  })));
}

export async function GET() {
  const csvSubmissions = readCsvSubmissions();
  const razorpayPayments = await fetchRazorpayPayments();

  try {
    await syncRazorpayPaymentsToDb(razorpayPayments);

    const [payments, submissions] = await Promise.all([
      prisma.payment.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.submission.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const dbSubmissions = submissions.map((submission) => ({
      ...submission,
      formName: inferFormName(submission.source),
    }));
    const seenSubmissions = new Set(dbSubmissions.map(getSubmissionKey));
    const mergedSubmissions = [
      ...dbSubmissions,
      ...csvSubmissions.filter((submission) => !seenSubmissions.has(getSubmissionKey(submission))),
    ].filter(isDashboardForm).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const seenPayments = new Set(payments.map((payment) => payment.id));
    const mergedPayments = filterFormPayments([
      ...payments.map((payment) => ({ ...payment, formName: "" })),
      ...razorpayPayments.filter((payment) => !seenPayments.has(payment.id)),
    ], mergedSubmissions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const visibleSubmissions = filterPaymentAttemptSubmissions(mergedSubmissions, mergedPayments);

    return NextResponse.json({ success: true, payments: mergedPayments, submissions: visibleSubmissions });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    const formSubmissions = csvSubmissions.filter(isDashboardForm);
    const formPayments = filterFormPayments(razorpayPayments, formSubmissions);

    return NextResponse.json({
      success: true,
      payments: formPayments,
      submissions: filterPaymentAttemptSubmissions(formSubmissions, formPayments),
      warning: "Database unavailable. Showing local CSV submissions.",
    });
  }
}
