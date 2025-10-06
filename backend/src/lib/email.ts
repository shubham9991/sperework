import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to,
    subject,
    html,
  });
}

export function renderTemplate(name: string, params: Record<string, string>) {
  // Simple template rendering (replace {{key}} with value)
  let templates: Record<string, string> = {
    'welcome': '<h1>Welcome, {{name}}!</h1>',
    'reset': '<p>Reset link: {{link}}</p>'
  };
  let html = templates[name] || '';
  Object.entries(params).forEach(([k, v]) => {
    html = html.replace(new RegExp(`{{${k}}}`, 'g'), v);
  });
  return html;
}
