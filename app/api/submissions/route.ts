import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '@/lib/prisma';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'submissions.csv');
const DEFAULT_FORM_NAME = 'Marina Bariatrics';
const HEADERS = ['Timestamp', 'Source', 'Name', 'Phone', 'Condition', 'URL', 'TeleCRM', 'FormName'];

export const runtime = 'nodejs';

type SubmissionBody = {
  formName: string;
  source: string;
  name: string;
  phone: string;
  concern: string;
  pageUrl: string;
};

type TelecrmResponse = Record<string, unknown> & {
  synced?: boolean;
  statusCode?: number;
  leadId?: unknown;
  note?: string;
};

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSubmission(body: Record<string, unknown>): SubmissionBody {
  const source = toText(body.source) || 'Bariatric-Form';

  return {
    formName: toText(body.formName) || (source.includes('Client Feedback') ? "Marina Client Feedback" : DEFAULT_FORM_NAME),
    source,
    name: toText(body.name),
    phone: toText(body.phone),
    concern: toText(body.concern),
    pageUrl: toText(body.pageUrl),
  };
}

function csvEscape(value: string): string {
  const safeValue = value.replace(/\r?\n/g, ' ');
  if (/[",\n]/.test(safeValue)) return `"${safeValue.replace(/"/g, '""')}"`;
  return safeValue;
}

function rowToCsv(row: string[]) {
  return row.map(csvEscape).join(',');
}

function ensureCsvFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, `${rowToCsv(HEADERS)}\n`, 'utf8');
    return;
  }

  const text = fs.readFileSync(FILE_PATH, 'utf8');
  const [firstLine = '', ...rest] = text.split(/\r?\n/);
  if (!firstLine.split(',').some((header) => header.replace(/^"|"$/g, '').trim() === 'FormName')) {
    fs.writeFileSync(FILE_PATH, [rowToCsv(HEADERS), ...rest].join('\n'), 'utf8');
  }
}

function appendLocalRow(row: string[]) {
  ensureCsvFile();
  fs.appendFileSync(FILE_PATH, `${rowToCsv(row)}\n`, 'utf8');
}

async function pushToGAS(body: SubmissionBody, timestamp: string, telecrmStatus: string) {
  const url = process.env.NEXT_PUBLIC_GAS_URL;
  if (!url) return null;

  const row = [
    timestamp,
    body.source,
    body.name,
    body.phone,
    body.concern,
    body.pageUrl,
    telecrmStatus,
    body.formName,
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      timestamp,
      formName: body.formName,
      source: body.source,
      name: body.name,
      phone: body.phone,
      concern: body.concern,
      condition: body.concern,
      pageUrl: body.pageUrl,
      url: body.pageUrl,
      telecrm: telecrmStatus,
      headers: HEADERS,
      row,
    }),
  });

  if (!res.ok) throw new Error(`Google Apps Script failed with ${res.status}`);
  return res.text();
}

function normalizePhoneForTeleCRM(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function isTelecrmConfirmed(data: unknown) {
  if (!data || typeof data !== 'object') return false;

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.modifiedLeadIds) && record.modifiedLeadIds.length > 0) return true;
  if (Array.isArray(record.leadIds) && record.leadIds.length > 0) return true;
  if (record.leadId || record.id || record.LeadID) return true;

  const status = String(record.status || '').toLowerCase();
  return status === 'created' || status === 'updated' || status === 'success';
}

async function pushToTeleCRM(body: SubmissionBody): Promise<TelecrmResponse | null> {
  const url = process.env.TELECRM_API_URL;
  const key = process.env.TELECRM_API_KEY;
  if (!url || !key) return null;

  const phone = normalizePhoneForTeleCRM(body.phone);
  if (!phone) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const payload = {
    fields: {
      phone,
      name: body.name,
    },
    actions: [
      { type: 'SYSTEM_NOTE', text: `Source: ${body.source || 'Website'}` },
      { type: 'SYSTEM_NOTE', text: `URL: ${body.pageUrl || 'Not specified'}` },
      { type: 'SYSTEM_NOTE', text: `Condition: ${body.concern || 'Not specified'}` },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
        'X-Client-ID': 'nextjs-website-integration',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 204) {
      return {
        synced: false,
        statusCode: 204,
        note: 'TeleCRM returned 204, no body',
      };
    }

    const text = await res.text();
    if (!text.trim()) {
      return { synced: false, statusCode: res.status, note: 'Empty TeleCRM response' };
    }

    let data: TelecrmResponse;
    try {
      data = JSON.parse(text) as TelecrmResponse;
    } catch {
      return {
        synced: false,
        statusCode: res.status,
        note: 'Non-JSON TeleCRM response',
      };
    }

    const confirmed = res.ok && isTelecrmConfirmed(data);
    return {
      ...data,
      synced: confirmed,
      statusCode: res.status,
      leadId: data.leadId || data.id || data.LeadID || null,
      note: confirmed ? 'TeleCRM lead confirmed' : 'TeleCRM lead creation',
    };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    return { synced: false, note: 'TeleCRM fetch failed', error: message };
  }
}

function getTelecrmStatus(result: TelecrmResponse | null) {
  if (!result) return 'Not configured';
  if (result.synced) return `Synced${result.leadId ? ` (${String(result.leadId)})` : ''}`;
  return result.note || `Failed${result.statusCode ? ` (${result.statusCode})` : ''}`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body = normalizeSubmission(rawBody);

    if (!body.name || !body.phone || !body.concern) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and condition are required' },
        { status: 400 },
      );
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const telecrmResult = await pushToTeleCRM(body);
    const telecrmStatus = getTelecrmStatus(telecrmResult);
    const row = [
      timestamp,
      body.source,
      body.name,
      body.phone,
      body.concern,
      body.pageUrl,
      telecrmStatus,
      body.formName,
    ];

    try {
      appendLocalRow(row);
    } catch (csvErr) {
      console.warn('Local CSV save skipped:', (csvErr as Error).message);
    }

    try {
      await prisma.submission.create({
        data: {
          source:  body.source,
          name:    body.name,
          phone:   body.phone,
          concern: body.concern,
          pageUrl: body.pageUrl,
          telecrm: telecrmStatus,
        },
      });
    } catch (dbErr) {
      console.warn('DB save skipped:', (dbErr as Error).message);
    }

    try {
      await pushToGAS(body, timestamp, telecrmStatus);
    } catch (gasErr) {
      console.warn('Google Apps Script sync skipped:', (gasErr as Error).message);
    }

    return NextResponse.json({ success: true, telecrm: telecrmResult });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    ensureCsvFile();

    const { searchParams } = new URL(req.url);
    if (searchParams.get('format') === 'json') {
      const text = fs.readFileSync(FILE_PATH, 'utf8');
      const lines = text.trim().split('\n').filter(Boolean);
      if (lines.length <= 1) return NextResponse.json({ success: true, data: [] });

      const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
      const rows = lines.slice(1).map((line) => {
        const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) ?? [];
        const cleaned = cols.map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
        return Object.fromEntries(headers.map((h, i) => [h, cleaned[i] ?? '']));
      });
      return NextResponse.json({ success: true, data: rows });
    }

    const buffer = fs.readFileSync(FILE_PATH);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="submissions_${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
