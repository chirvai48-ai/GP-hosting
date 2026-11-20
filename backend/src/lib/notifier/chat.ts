// Google Chat transport: posts a card payload to an incoming-webhook URL.
//
// Deliberately best-effort. Every public form in this app (applications,
// contact inquiries) writes to the DB and then announces it here, so a Chat
// outage must never turn a candidate's submission into a 500 — send() resolves
// with a result object and never throws or rejects.
//
// Incoming webhooks need no OAuth, service account or Workspace-admin step: the
// URL itself is the credential. That also means the URL is a secret — it lives
// in env, never in the repo.

import type { Channel } from "./events";

/** Chat's hard cap on a single message is 32KB; stay well clear of it. */
export const MAX_MESSAGE_BYTES = 28_000;

const REQUEST_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 1_000;

export interface SendResult {
  delivered: boolean;
  /** "disabled" and "unconfigured" are normal in dev/CI, not failures. */
  reason?: "disabled" | "unconfigured" | "too-large" | "http-error" | "network-error";
  status?: number;
}

// Read env lazily rather than at module load: dotenv runs in index.ts, and the
// tests set these vars after importing the module.
const webhookFor = (channel: Channel): string | undefined => {
  const byChannel: Record<Channel, string | undefined> = {
    applications: process.env.GOOGLE_CHAT_WEBHOOK_APPLICATIONS,
    inquiries: process.env.GOOGLE_CHAT_WEBHOOK_INQUIRIES,
    digest: process.env.GOOGLE_CHAT_WEBHOOK_DIGEST,
  };
  // A single catch-all webhook is a valid setup — fall back to it so a
  // one-space deployment doesn't have to set three identical vars.
  return byChannel[channel] || process.env.GOOGLE_CHAT_WEBHOOK_URL;
};

const notificationsEnabled = () => process.env.NOTIFY_ENABLED !== "false";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 429 and 5xx are transient (Chat rate-limits at ~1 msg/sec per space); 4xx is our bug. */
const isRetryable = (status: number) => status === 429 || status >= 500;

const postOnce = async (
  url: string,
  body: string
): Promise<{ ok: boolean; status: number; text?: string }> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  return {
    ok: res.ok,
    status: res.status,
    text: res.ok ? undefined : await res.text().catch(() => undefined),
  };
};

export const send = async (
  channel: Channel,
  payload: unknown,
  label: string
): Promise<SendResult> => {
  if (!notificationsEnabled()) return { delivered: false, reason: "disabled" };

  const url = webhookFor(channel);
  if (!url) {
    console.warn(`[notify] no webhook configured for "${channel}" channel; skipping ${label}`);
    return { delivered: false, reason: "unconfigured" };
  }

  const body = JSON.stringify(payload);
  if (Buffer.byteLength(body, "utf8") > MAX_MESSAGE_BYTES) {
    console.error(`[notify] ${label} exceeds Chat's message size cap; skipping`);
    return { delivered: false, reason: "too-large" };
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { ok, status, text } = await postOnce(url, body);
      if (ok) return { delivered: true, status };

      if (attempt === 1 && isRetryable(status)) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      console.error(`[notify] ${label} rejected by Chat: ${status} ${text ?? ""}`.trim());
      return { delivered: false, reason: "http-error", status };
    } catch (err) {
      if (attempt === 1) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      console.error(`[notify] ${label} failed to reach Chat:`, err);
      return { delivered: false, reason: "network-error" };
    }
  }

  return { delivered: false, reason: "network-error" };
};
