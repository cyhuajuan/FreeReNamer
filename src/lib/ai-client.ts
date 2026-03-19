import type { ApiConfig } from './settings/ai-config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream: false;
  format: {
    type: 'object';
    properties: {
      code: { type: 'string' };
    };
    required: ['code'];
  };
}

interface OllamaResponse {
  message: { role: string; content: string };
  code?: string;
}

interface OpenAIRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}

interface OpenAIResponse {
  choices: { message: { role: string; content: string } }[];
}

export async function chat(
  config: ApiConfig,
  messages: ChatMessage[],
): Promise<ChatMessage> {
  if (config.type === 'ollama') {
    return chatOllama(config, messages);
  }
  return chatOpenAI(config, messages);
}

async function chatOllama(
  config: ApiConfig,
  messages: ChatMessage[],
): Promise<ChatMessage> {
  const request: OllamaRequest = {
    model: config.model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: false,
    format: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
      required: ['code'],
    },
  };

  const response = await fetch(`${config.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data: OllamaResponse = await response.json();
  // message.content 是 JSON 字符串，需要解析后提取 code 字段
  const content = data.message.content;
  try {
    const parsed = JSON.parse(content);
    return {
      role: data.message.role as 'user' | 'assistant',
      content: parsed.code ?? content,
    };
  } catch {
    return {
      role: data.message.role as 'user' | 'assistant',
      content: content,
    };
  }
}

async function chatOpenAI(
  config: ApiConfig,
  messages: ChatMessage[],
): Promise<ChatMessage> {
  const request: OpenAIRequest = {
    model: config.model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data: OpenAIResponse = await response.json();
  return {
    role: data.choices[0]?.message.role as 'user' | 'assistant',
    content: data.choices[0]?.message.content ?? '',
  };
}
