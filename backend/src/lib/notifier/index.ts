// Public entry point for Google Chat notifications.
//
// Call notify() from a controller after the DB write has succeeded. It never
// throws, so callers don't need a try/catch — but it does return a promise, and
// awaiting it keeps the request honest about how long it took. Use
// notifyInBackground() when the response shouldn't wait on Chat at all.

import { send, type SendResult } from "./chat";
import {
  CHANNEL_BY_EVENT,
  type NotificationEvent,
} from "./events";
import {
  applicationCard,
  candidateInquiryCard,
  companyInquiryCard,
  dailyDigestCard,
} from "./cards";

export type { NotificationEvent, ApplicationWithJob, DailyDigest } from "./events";

const buildPayload = (event: NotificationEvent): { payload: unknown; label: string } => {
  switch (event.type) {
    case "application.created":
      return {
        payload: applicationCard(event.application),
        label: `application #${event.application.id}`,
      };
    case "inquiry.candidate_created":
      return {
        payload: candidateInquiryCard(event.inquiry),
        label: `candidate inquiry #${event.inquiry.id}`,
      };
    case "inquiry.company_created":
      return {
        payload: companyInquiryCard(event.inquiry),
        label: `company inquiry #${event.inquiry.id}`,
      };
    case "digest.daily":
      return { payload: dailyDigestCard(event.digest), label: "daily digest" };
  }
};

export const notify = async (event: NotificationEvent): Promise<SendResult> => {
  try {
    const { payload, label } = buildPayload(event);
    return await send(CHANNEL_BY_EVENT[event.type], payload, label);
  } catch (err) {
    // A bug in a card builder must not propagate into a public form handler.
    console.error(`[notify] failed to build "${event.type}" notification:`, err);
    return { delivered: false, reason: "network-error" };
  }
};

/**
 * Fire-and-forget: the HTTP response goes out without waiting on Chat.
 * Safe because notify() swallows its own errors — there is no unhandled
 * rejection to leak.
 */
export const notifyInBackground = (event: NotificationEvent): void => {
  void notify(event);
};
