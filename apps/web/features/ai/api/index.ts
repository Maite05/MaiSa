import type { ChatMessage } from "../types";

const LATENCY_MS = 600;
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg-${idCounter}`;
}

/**
 * MOCK — no real LLM call happens here. packages/ai is an empty stub
 * (no provider client, and OPENAI_API_KEY may not even be configured in
 * this environment). This returns a canned response so the chat UI is
 * genuinely interactive; replace the body with a real packages/ai call
 * once that package has an implementation.
 */
export async function sendMessage(content: string): Promise<ChatMessage> {
  const response = buildCannedResponse(content);
  return delay({ id: nextId(), role: "assistant", content: response, createdAt: new Date().toISOString() });
}

function buildCannedResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("timeline")) {
    return "Here's a starting timeline: guest arrival 90 minutes before the ceremony, ceremony at golden hour, cocktail hour on the terrace, then dinner service. Fine-tune it from the event's Timeline tab.";
  }
  if (lower.includes("budget")) {
    return "A common allocation is roughly 45% venue & catering, 15% florals & decor, 10% photography, with the remainder split across entertainment, attire, and contingency. Add line items from the event's Budget tab to compare against your actuals.";
  }
  if (lower.includes("vendor")) {
    return "For this kind of event I'd shortlist 2-3 vendors per category and compare availability before contracts go out — check the Vendors directory for ones you've already worked with.";
  }
  return "Got it — I can help draft a timeline, suggest a budget split, or shortlist vendors. Ask me about any of those for this event.";
}
