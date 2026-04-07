/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type NotifyRequest =
  | { type: "chat_message"; messageId: string }
  | { type: "ticket_tag"; ticketId: string; taggedUserIds: string[] }
  | { type: "room_assignment"; roomId: string; shiftId: string; assignedUserId: string };

type SupabaseError = { message?: string };

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

function stepError(step: string, err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  return new Error(`[step:${step}] ${msg}`);
}

function corsHeaders(origin: string | null) {
  // In prod, lock this down to your app domains if you expose this publicly.
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  };
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.warn("[notify] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
}

function requireEnv() {
  if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL secret");
  if (!SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY secret");
}

async function sb<T>(path: string, init: RequestInit): Promise<{ data: T | null; error: SupabaseError | null; status: number }> {
  requireEnv();
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: SERVICE_ROLE_KEY,
        authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Supabase REST fetch failed: ${msg}`);
  }
  const status = res.status;
  if (!res.ok) {
    let err: any = null;
    try {
      err = await res.json();
    } catch {
      err = { message: await res.text() };
    }
    return { data: null, error: err, status };
  }
  // PostgREST can return 201 with an empty body when Prefer: return=minimal is used.
  // Also supports 204 for no content.
  if (status === 204) return { data: null, error: null, status };
  const raw = await res.text();
  if (!raw) return { data: null, error: null, status };
  const data = JSON.parse(raw) as T;
  return { data, error: null, status };
}

async function sbOrThrow<T>(path: string, init: RequestInit): Promise<T> {
  const { data, error, status } = await sb<T>(path, init);
  if (error) {
    const msg = error.message ?? JSON.stringify(error);
    throw new Error(`Supabase REST error (${status}) on ${path}: ${msg}`);
  }
  // Writes with Prefer: return=minimal return 201 (or sometimes 200) with an empty body.
  const method = (init.method ?? "GET").toUpperCase();
  if (data == null) {
    if (method !== "GET" && status >= 200 && status < 300) {
      return null as unknown as T;
    }
    throw new Error(`Supabase REST empty response (${status}) on ${path}`);
  }
  return data;
}

async function sendExpoPush(messages: Array<{ to: string; title: string; body: string; data?: Record<string, unknown> }>) {
  if (messages.length === 0) return { ok: true, tickets: [] as unknown[] };

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(
      messages.map((m) => ({
        to: m.to,
        title: m.title,
        body: m.body,
        data: m.data ?? {},
        sound: "default",
      })),
    ),
  });

  const payload = await res.json().catch(() => ({}));
  return { ok: res.ok, payload };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, headers: cors });
  }

  let body: NotifyRequest;
  try {
    body = (await req.json()) as NotifyRequest;
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, headers: cors });
  }

  try {
    if (body.type === "chat_message") {
      const msgRows = await sbOrThrow<Array<{ id: string; chat_id: string; sender_id: string; content: string | null; type: string; created_at: string | null; tagged_user_id: string | null }>>(
        `messages?id=eq.${encodeURIComponent(body.messageId)}&select=id,chat_id,sender_id,content,type,created_at,tagged_user_id`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("chat_message.fetch_message", e);
      });
      if (!msgRows?.length) return json({ error: "Message not found" }, { status: 404, headers: cors });
      const msg = msgRows[0];

      const senderRows = await sbOrThrow<Array<{ id: string; full_name: string | null }>>(
        `users?id=eq.${encodeURIComponent(msg.sender_id)}&select=id,full_name`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("chat_message.fetch_sender", e);
      });
      const senderName = senderRows?.[0]?.full_name ?? "Someone";

      const participantRows = await sbOrThrow<Array<{ user_id: string }>>(
        `chat_participants?chat_id=eq.${encodeURIComponent(msg.chat_id)}&select=user_id`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("chat_message.fetch_participants", e);
      });
      const recipientUserIds = (participantRows ?? []).map((p) => p.user_id).filter((uid) => uid !== msg.sender_id);
      if (recipientUserIds.length === 0) return json({ ok: true, delivered: 0 }, { headers: cors });

      const tokens = await sbOrThrow<Array<{ user_id: string; expo_push_token: string }>>(
        `user_push_tokens?user_id=in.(${recipientUserIds.map(encodeURIComponent).join(",")})&select=user_id,expo_push_token`,
        { method: "GET" },
      ).catch((e) => {
        console.warn("[notify] token lookup failed", e instanceof Error ? e.message : String(e));
        return [];
      });

      const title = senderName;
      const bodyText =
        msg.type === "image" ? "📷 Photo" : msg.type === "file" ? "📎 File" : (msg.content ?? "New message");

      // In-app inbox
      await sbOrThrow(
        `notifications`,
        {
          method: "POST",
          headers: { prefer: "return=minimal" },
          body: JSON.stringify(
            recipientUserIds.map((uid) => ({
              user_id: uid,
              type: "chat_message",
              title,
              body: bodyText,
              data: { chatId: msg.chat_id, messageId: msg.id },
            })),
          ),
        },
      ).catch((e) => {
        throw stepError("chat_message.insert_notifications", e);
      });

      const expoMessages = (tokens ?? []).map((t) => ({
        to: t.expo_push_token,
        title,
        body: bodyText,
        data: { type: "chat_message", chatId: msg.chat_id, messageId: msg.id },
      }));
      const push = await sendExpoPush(expoMessages);
      return json({ ok: true, recipients: recipientUserIds.length, push }, { headers: cors });
    }

    if (body.type === "ticket_tag") {
      const uniqueTagged = Array.from(new Set((body.taggedUserIds ?? []).filter(Boolean)));
      if (uniqueTagged.length === 0) return json({ ok: true, delivered: 0 }, { headers: cors });

      const ticketRows = await sbOrThrow<Array<{ id: string; title: string; room_id: string | null }>>(
        `tickets?id=eq.${encodeURIComponent(body.ticketId)}&select=id,title,room_id`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("ticket_tag.fetch_ticket", e);
      });
      if (!ticketRows?.length) return json({ error: "Ticket not found" }, { status: 404, headers: cors });
      const ticket = ticketRows[0];

      const { data: roomRows } = ticket.room_id
        ? await sb<Array<{ id: string; room_number: string }>>(
          `rooms?id=eq.${encodeURIComponent(ticket.room_id)}&select=id,room_number`,
          { method: "GET" },
        )
        : { data: null };
      const roomNumber = roomRows?.[0]?.room_number;

      const title = "Tagged on a ticket";
      const bodyText = roomNumber ? `Room ${roomNumber}: ${ticket.title}` : ticket.title;

      await sbOrThrow(
        `notifications`,
        {
          method: "POST",
          headers: { prefer: "return=minimal" },
          body: JSON.stringify(
            uniqueTagged.map((uid) => ({
              user_id: uid,
              type: "ticket_tag",
              title,
              body: bodyText,
              data: { ticketId: ticket.id, roomId: ticket.room_id },
            })),
          ),
        },
      ).catch((e) => {
        throw stepError("ticket_tag.insert_notifications", e);
      });

      const tokens = await sbOrThrow<Array<{ user_id: string; expo_push_token: string }>>(
        `user_push_tokens?user_id=in.(${uniqueTagged.map(encodeURIComponent).join(",")})&select=user_id,expo_push_token`,
        { method: "GET" },
      ).catch((e) => {
        console.warn("[notify] token lookup failed", e instanceof Error ? e.message : String(e));
        return [];
      });

      const expoMessages = (tokens ?? []).map((t) => ({
        to: t.expo_push_token,
        title,
        body: bodyText,
        data: { type: "ticket_tag", ticketId: ticket.id, roomId: ticket.room_id },
      }));
      const push = await sendExpoPush(expoMessages);
      return json({ ok: true, recipients: uniqueTagged.length, push }, { headers: cors });
    }

    if (body.type === "room_assignment") {
      const roomRows = await sbOrThrow<Array<{ id: string; room_number: string }>>(
        `rooms?id=eq.${encodeURIComponent(body.roomId)}&select=id,room_number`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("room_assignment.fetch_room", e);
      });
      if (!roomRows?.length) return json({ error: "Room not found" }, { status: 404, headers: cors });
      const roomNumber = roomRows[0].room_number;

      const shiftRows = await sbOrThrow<Array<{ id: string; name: string }>>(
        `shifts?id=eq.${encodeURIComponent(body.shiftId)}&select=id,name`,
        { method: "GET" },
      ).catch((e) => {
        throw stepError("room_assignment.fetch_shift", e);
      });
      const shiftLabel = shiftRows?.[0]?.name?.trim();
      const title = "Room assignment";
      const bodyText = shiftLabel
        ? `You have been assigned to Room ${roomNumber} as ${shiftLabel} shift attendant.`
        : `You have been assigned to Room ${roomNumber}.`;

      await sbOrThrow(
        `notifications`,
        {
          method: "POST",
          headers: { prefer: "return=minimal" },
          body: JSON.stringify([{
            user_id: body.assignedUserId,
            type: "room_assignment",
            title,
            body: bodyText,
            data: { roomId: body.roomId, shiftId: body.shiftId },
          }]),
        },
      ).catch((e) => {
        throw stepError("room_assignment.insert_notifications", e);
      });

      const tokens = await sbOrThrow<Array<{ user_id: string; expo_push_token: string }>>(
        `user_push_tokens?user_id=eq.${encodeURIComponent(body.assignedUserId)}&select=user_id,expo_push_token`,
        { method: "GET" },
      ).catch((e) => {
        console.warn("[notify] token lookup failed", e instanceof Error ? e.message : String(e));
        return [];
      });
      const expoMessages = (tokens ?? []).map((t) => ({
        to: t.expo_push_token,
        title,
        body: bodyText,
        data: { type: "room_assignment", roomId: body.roomId, shiftId: body.shiftId },
      }));
      const push = await sendExpoPush(expoMessages);
      return json({ ok: true, recipients: 1, push }, { headers: cors });
    }

    return json({ error: "Unknown notification type" }, { status: 400, headers: cors });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[notify] error", message);
    return json({ error: message }, { status: 500, headers: cors });
  }
});

