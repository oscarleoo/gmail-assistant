const splitOnReplyMarker = (text) => {
  const re =
    /^On\s+[A-Z][a-z]{2},\s+\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}\s+at\s+\d{2}:\d{2}.*$/m;
  const parts = text.split(re);
  return parts[0].trim();
};

const splitOnOutlookReplyHeader = (text) => {
  const re = /^\s*From:\s.+$/m;
  const parts = text.split(re);
  return parts[0].trim();
};

const extractEmailContent = (text) => {
  const emailContent1 = splitOnReplyMarker(text);
  const emailContent2 = splitOnOutlookReplyHeader(emailContent1);
  return emailContent2;
};

export { extractEmailContent };
