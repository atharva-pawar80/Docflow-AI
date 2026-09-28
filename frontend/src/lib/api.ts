// ---------------------------------------------------------------------------
// DocFlow AI — Typed API client
// ---------------------------------------------------------------------------
// Central fetch wrapper for all backend calls. Every component should import
// from here instead of calling fetch directly.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL as string ?? 'http://localhost:8000';

// ── Error type ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

// ── Response types ──────────────────────────────────────────────────────────

/** Mirrors the JSON returned by `POST /documents/upload` */
export interface UploadResponse {
  doc_id: string;
  filename: string;
  status: string;
  path: string;
  document_type: string;
  confidence: number;
  /** class_name → probability (e.g. { "Invoice": 0.947, "Receipt": 0.03 }) */
  probabilities: Record<string, number>;
}

/** A single retrieved chunk surfaced by the RAG pipeline. */
export interface SourceChunk {
  id: string;
  text: string;
  page: number;
  score: number;
}

/**
 * Mirrors the JSON returned by `POST /chat/{doc_id}`.
 *
 * Currently the backend only returns `answer`. Once the backend is updated
 * (P4) to also return `sources`, the frontend is already typed for it.
 */
export interface ChatResponse {
  answer: string;
  sources?: SourceChunk[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── API functions ───────────────────────────────────────────────────────────

/**
 * Upload a document for classification + vectorstore ingestion.
 *
 * Sends the raw `File` as multipart/form-data to `POST /documents/upload`.
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: 'POST',
    body: form,
  });

  return handleResponse<UploadResponse>(res);
}

/**
 * Send a chat message about a previously uploaded document.
 *
 * Calls `POST /chat/{docId}` with `{ message }`.
 */
export async function chatWithDocument(
  docId: string,
  message: string,
): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/chat/${encodeURIComponent(docId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  return handleResponse<ChatResponse>(res);
}
