import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const recipient = process.env.CONTACT_TO_EMAIL || "fabian.andres82@gmail.com";
const allowedInterests = ["general", "volunteer", "partnership", "donation", "other"] as const;
const allowedLocales = ["en", "es"] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaximum = 5;
const attemptsByAddress = new Map<string, number[]>();

type ContactRequest = {
  email?: unknown;
  interest?: unknown;
  locale?: unknown;
  message?: unknown;
  name?: unknown;
  phone?: unknown;
  website?: unknown;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function exceedsRateLimit(address: string) {
  const now = Date.now();
  const currentAttempts = (attemptsByAddress.get(address) ?? []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs,
  );

  if (currentAttempts.length >= rateLimitMaximum) {
    attemptsByAddress.set(address, currentAttempts);
    return true;
  }

  currentAttempts.push(now);
  attemptsByAddress.set(address, currentAttempts);
  return false;
}

export async function POST(request: Request) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (exceedsRateLimit(address)) {
    return NextResponse.json({ code: "RATE_LIMITED", ok: false }, { status: 429 });
  }

  const rawBody = await request.text();

  if (rawBody.length > 20_000) {
    return NextResponse.json({ code: "INVALID_REQUEST", ok: false }, { status: 413 });
  }

  let payload: ContactRequest;

  try {
    payload = JSON.parse(rawBody) as ContactRequest;
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST", ok: false }, { status: 400 });
  }

  if (cleanText(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(payload.name);
  const phone = cleanText(payload.phone);
  const email = cleanText(payload.email).toLowerCase();
  const interest = cleanText(payload.interest);
  const message = cleanText(payload.message);
  const locale = cleanText(payload.locale);

  const isValid =
    name.length >= 2 &&
    name.length <= 120 &&
    phone.length >= 6 &&
    phone.length <= 40 &&
    email.length <= 254 &&
    emailPattern.test(email) &&
    message.length >= 10 &&
    message.length <= 3000 &&
    allowedInterests.includes(interest as (typeof allowedInterests)[number]) &&
    allowedLocales.includes(locale as (typeof allowedLocales)[number]);

  if (!isValid) {
    return NextResponse.json({ code: "VALIDATION_ERROR", ok: false }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    return NextResponse.json({ code: "MAIL_NOT_CONFIGURED", ok: false }, { status: 503 });
  }

  const smtpPort = Number.parseInt(process.env.SMTP_PORT || "465", 10);
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
  const interestLabels: Record<(typeof allowedInterests)[number], string> = {
    donation: "Donation / Donación",
    general: "General inquiry / Consulta general",
    other: "Other / Otro",
    partnership: "Partnership / Alianza",
    volunteer: "Volunteering / Voluntariado",
  };
  const interestLabel = interestLabels[interest as (typeof allowedInterests)[number]];

  try {
    const transporter = nodemailer.createTransport({
      auth: { pass: smtpPass, user: smtpUser },
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
    });

    await transporter.sendMail({
      from: `Moca Colombia <${fromEmail}>`,
      html: `
        <h1>New contact request</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Interest:</strong> ${escapeHtml(interestLabel)}</p>
        <p><strong>Language:</strong> ${escapeHtml(locale.toUpperCase())}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
      subject: `[Moca Colombia] Contact - ${interestLabel} - ${name}`,
      text: [
        "New contact request",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Interest: ${interestLabel}`,
        `Language: ${locale.toUpperCase()}`,
        "",
        message,
      ].join("\n"),
      to: recipient,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ code: "DELIVERY_FAILED", ok: false }, { status: 502 });
  }
}
