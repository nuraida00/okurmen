/**
 * Telegram notification utility.
 * Credentials are stored only in ENV — never exposed to frontend.
 * If tokens are empty, notifications are silently skipped.
 */

interface BookingNotification {
  studentName: string;
  phone: string;
  course: string;
  format: string;
  amount?: string;
  status: string;
  date: string;
}

async function sendTelegramMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping notification');
    return { ok: true };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Telegram] Send failed:', err);
      return { ok: false, error: err };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Telegram] Network error:', msg);
    return { ok: false, error: msg };
  }
}

export async function sendBookingNotification(data: BookingNotification): Promise<void> {
  const text = [
    '🔔 <b>ЖАҢЫ БРОНЬ / НОВАЯ БРОНЬ</b>',
    '',
    `👤 <b>Аты-жөнү / ФИО:</b> ${data.studentName}`,
    `📞 <b>Телефон:</b> ${data.phone}`,
    `📚 <b>Курс:</b> ${data.course}`,
    `📍 <b>Формат:</b> ${data.format}`,
    data.amount ? `💰 <b>Сумма:</b> ${data.amount}` : '',
    `📊 <b>Статус:</b> ${data.status}`,
    `📅 <b>Дата:</b> ${data.date}`,
  ].filter(Boolean).join('\n');

  await sendTelegramMessage(text);
}

export async function sendPaymentNotification(data: {
  studentName: string;
  phone: string;
  course: string;
  amount: string;
  transactionId?: string;
  date: string;
}): Promise<void> {
  const text = [
    '✅ <b>ТӨЛӨМ ИЙГИЛИКТҮҮ / ОПЛАТА УСПЕШНА</b>',
    '',
    `👤 <b>ФИО:</b> ${data.studentName}`,
    `📞 <b>Телефон:</b> ${data.phone}`,
    `📚 <b>Курс:</b> ${data.course}`,
    `💰 <b>Сумма:</b> ${data.amount}`,
    data.transactionId ? `🔑 <b>ID транзакции:</b> ${data.transactionId}` : '',
    `📅 <b>Дата:</b> ${data.date}`,
  ].filter(Boolean).join('\n');

  await sendTelegramMessage(text);
}
