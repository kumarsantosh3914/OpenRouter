// No input validation needed — all endpoints are GET only.
// Types below document the response shapes for reference.

export interface ProviderResponse {
  id: number;
  name: string;
  website: string;
}

export interface ModelResponse {
  id: number;
  name: string;
  slug: string;
  company: {
    id: number;
    name: string;
    website: string;
  };
}

export interface ModelProviderMappingResponse {
  id: number;
  inputTokenCost: number;
  outputTokenCost: number;
  model: {
    id: number;
    name: string;
    slug: string;
  };
  provider: {
    id: number;
    name: string;
    website: string;
  };
}
