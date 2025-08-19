const createPrompt = (settings, mailList, instruction) => {
  return `Generate a sales email (only the body of the email) based on the following information:

# Here's the current conversation:
${mailList
  .map((message, index) => {
    return `
Email ${index + 1}:

From: ${message.from}
To: ${message.to}
CC: ${message.cc}
Date: ${message.date}

${message.text}`;
  })
  .join("\n\n")}

# User settings:
${settings}

${
  instruction
    ? `# Email instructions:
${instruction}`
    : ""
}
  `;
};

const generateEmail = async (settings, mailList, instruction) => {
  const prompt = createPrompt(settings, mailList, instruction);
  const result = await chrome.storage.sync.get([
    "openaiApiKey",
    "selectedModel",
  ]);
  const apiKey = result.openaiApiKey;
  const model = result.selectedModel || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are an email assistant. Generate email responses based on the conversation context and user instructions. The email should be in the same language as the conversation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return { success: false, error: "Failed to generate email" };
  }

  const data = await response.json();
  const generatedEmail = data.choices[0].message.content.trim();
  return { success: true, email: generatedEmail };
};

export default generateEmail;
