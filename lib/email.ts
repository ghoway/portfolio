import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  smtp_to: string;
}

async function getEmailSettings(): Promise<EmailSettings | null> {
  const keys = ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from", "smtp_to"];
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });

  if (!map.smtp_host || !map.smtp_user || !map.smtp_pass) return null;
  return map as unknown as EmailSettings;
}

export async function sendContactEmail({
  senderName,
  senderEmail,
  subject,
  message,
}: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  const cfg = await getEmailSettings();
  if (!cfg) return; // SMTP not configured, silently skip

  const transporter = nodemailer.createTransport({
    host: cfg.smtp_host,
    port: parseInt(cfg.smtp_port || "587"),
    secure: parseInt(cfg.smtp_port || "587") === 465,
    auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
  });

  await transporter.sendMail({
    from: `"${senderName}" <${cfg.smtp_from}>`,
    replyTo: senderEmail,
    to: cfg.smtp_to,
    subject: `[Portfolio Contact] ${subject}`,
    text: `From: ${senderName} <${senderEmail}>\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#7c3aed">New Contact Message</h2>
        <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="white-space:pre-wrap">${message}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="color:#9ca3af;font-size:12px">Sent via your portfolio contact form</p>
      </div>
    `,
  });
}
