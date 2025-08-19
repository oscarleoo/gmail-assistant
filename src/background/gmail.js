import { extractEmailContent } from "../utils/emailParser";

const REMOVE_MESSAGES_FROM = ["mailsuite.com"];

const getMessageHeaders = (message) => {
  const headers = message.payload.headers;
  const from = headers.find((header) => header.name === "From");
  const to = headers.find((header) => header.name === "To");
  const cc = headers.find((header) => header.name === "Cc");
  const date = headers.find((header) => header.name === "Date");

  return {
    from: from.value,
    to: to.value,
    cc: cc?.value,
    date: date.value,
  };
};

const flattenTextPlainParts = (payload) => {
  const results = [];

  function walk(part) {
    if (!part) return;

    if (part.mimeType === "text/plain" && part.body?.data) {
      results.push(gmailBase64UrlToText(part.body.data));
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(walk);
    }
  }

  walk(payload);
  if (results.length === 0) {
    return "";
  } else {
    return extractEmailContent(results.join("\n"));
  }
};

const gmailBase64UrlToText = (b64url) => {
  // 1) URL-safe → standard base64
  try {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");

    // 2) pad to multiple of 4
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);

    // 3) decode bytes, then UTF-8
    const binary = atob(b64); // throws if still not valid base64
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch (error) {
    // console.error("Error decoding base64 URL:", error);
    return "";
  }
};

const getAuthToken = async () => {
  try {
    const token = await chrome.identity.getAuthToken({ interactive: true });
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const getThreadFromId = async (threadId, token) => {
  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=metadata`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  const messages = data.messages.filter((message) => {
    const from = message.payload.headers.find(
      (header) => header.name === "From"
    );
    return !REMOVE_MESSAGES_FROM.some((domain) =>
      from.value.toLowerCase().includes(domain.toLowerCase())
    );
  });
  return messages.map((message) => ({
    id: message.id,
  }));
};

const getMessagesFromId = async (messageId, token) => {
  const response = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getThreadData = async (threadId) => {
  const token = await getAuthToken();
  const messageIds = await getThreadFromId(threadId, token.token);
  const messageContents = await Promise.all(
    messageIds.map((message) => getMessagesFromId(message.id, token.token))
  );
  const decodedMessages = messageContents.map((message) => ({
    id: message.id,
    ...getMessageHeaders(message),
    text: flattenTextPlainParts(message.payload),
  }));
  // const messages = await getMessagesFromId(threadId, token);
  return { messages: decodedMessages };
};
