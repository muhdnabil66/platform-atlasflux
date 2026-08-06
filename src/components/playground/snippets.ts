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
  payload.web_search = {
    mode: config.searchMode,
    depth: config.searchDepth,
    max_results: config.maxResults,
    max_searches: config.maxSearches,
  };
  payload.content_extraction = {
    enabled: config.contentExtraction,
    max_pages: config.maxContentPages,
  };
  if (config.maxTotalCost > 0) {
    payload.max_total_cost = config.maxTotalCost;
  }
  return payload;
}

export function buildCurlSnippet(config: PlaygroundConfig): string {
  const payload = buildPayload(config);
  const body = JSON.stringify(payload, null, 2)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  return `curl https://api.atlasflux.my/v1/responses \\
  -H "Authorization: Bearer $ATLASFLUX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${body.trimStart()}'
`;
}

export function buildJavaScriptSnippet(config: PlaygroundConfig): string {
  const payload = JSON.stringify(buildPayload(config), null, 2);
  return `const res = await fetch("https://api.atlasflux.my/v1/responses", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.ATLASFLUX_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${payload}),
});

const data = await res.json();
console.log(data.output);`;
}

export function buildPythonSnippet(config: PlaygroundConfig): string {
  const payload = JSON.stringify(buildPayload(config), null, 2);
  return `import requests

payload = ${payload}

resp = requests.post(
    "https://api.atlasflux.my/v1/responses",
    headers={"Authorization": f"Bearer {ATLASFLUX_API_KEY}"},
    json=payload,
)
data = resp.json()
print(data["output"])`;
}

export function snippetForTab(
  tab: "curl" | "javascript" | "python",
  config: PlaygroundConfig
): string {
  if (tab === "curl") return buildCurlSnippet(config);
  if (tab === "javascript") return buildJavaScriptSnippet(config);
  return buildPythonSnippet(config);
}
