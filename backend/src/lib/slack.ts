import fetch from 'node-fetch';

export async function sendSlackNotification(webhookUrl: string, message: string) {
  const payload = { text: message };
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.ok;
}
