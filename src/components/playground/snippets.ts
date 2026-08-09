import type { PlaygroundConfig } from "@/types/api";

export function buildPayload(config: PlaygroundConfig) {
  const payload: Record<string, unknown> = {
    model: config.model,
    input: config.input,
  };
  if (config.systemInstruction.trim()) {
    payload.instructions = config.systemInstruction;
  }
  payload.temperature = config.temperature;
  payload.max_output_tokens = config.maxOutputTokens;
  payload.stream = config.stream;
  payload.reasoning = { effort: config.reasoning };
  if (config.searchMode !== "off") {
    payload.web_search = {
      mode: config.searchMode,
      search_depth: config.searchDepth,
      max_results: config.maxResults,
      max_searches: config.maxSearches,
      content: {
        enabled: config.contentExtraction,
        max_pages: config.maxContentPages,
      },
    };
  }
  if (config.maxTotalCost > 0) {
    payload.max_total_cost_myr = config.maxTotalCost;
  }
  return payload;
}

export function buildCurlSnippet(config: PlaygroundConfig): string {
  const payload = buildPayload(config);
  const body = JSON.stringify(payload, null, 2)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  const shellSafeBody = body.trimStart().replaceAll("'", `'"'"'`);
  return `curl https://api.atlasflux.my/v1/responses \\
  -H "Authorization: Bearer $ATLASFLUX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${shellSafeBody}'
`;
}

export function buildJavaScriptSnippet(config: PlaygroundConfig): string {
  const payload = JSON.stringify(buildPayload(config), null, 2);
  const request = `const res = await fetch("https://api.atlasflux.my/v1/responses", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.ATLASFLUX_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${payload}),
});

if (!res.ok) throw new Error(await res.text());`;

  if (config.stream) {
    return `${request}

const reader = res.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  process.stdout.write(decoder.decode(value, { stream: true }));
}`;
  }

  return `${request}
const data = await res.json();
console.log(data.output_text);`;
}

export function buildPythonSnippet(config: PlaygroundConfig): string {
  const payload = JSON.stringify(buildPayload(config), null, 2);
  const encodedPayload = JSON.stringify(payload);
  const request = `import json
import os
import requests

payload = json.loads(${encodedPayload})

resp = requests.post(
    "https://api.atlasflux.my/v1/responses",
    headers={"Authorization": f"Bearer {os.environ['ATLASFLUX_API_KEY']}"},
    json=payload,
    stream=${config.stream ? "True" : "False"},
)
resp.raise_for_status()`;

  if (config.stream) {
    return `${request}
for line in resp.iter_lines(decode_unicode=True):
    if line:
        print(line)`;
  }

  return `${request}
data = resp.json()
print(data["output_text"])`;
}

export function snippetForTab(
  tab: "curl" | "javascript" | "python",
  config: PlaygroundConfig
): string {
  if (tab === "curl") return buildCurlSnippet(config);
  if (tab === "javascript") return buildJavaScriptSnippet(config);
  return buildPythonSnippet(config);
}
