export interface ClassificationResult {
  label: string;
  confidence: number;
  topClasses: { name: string; score: number; color: string }[];
  model: string;
  features: string[];
  latencyMs: number;
}

export interface LatencyMetric {
  label: string;
  value: string;
  unit: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface SourceChunk {
  id: string;
  text: string;
  page: number;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceChunk[];
  timestamp: string;
}

export const MOCK_CLASSIFICATION: ClassificationResult = {
  label: 'Invoice',
  confidence: 0.947,
  model: 'TF-IDF + Logistic Regression',
  features: ['total_amount', 'due_date', 'vendor_name', 'invoice_no', 'tax_rate'],
  latencyMs: 34,
  topClasses: [
    { name: 'Invoice', score: 0.947, color: 'blue' },
    { name: 'Purchase Order', score: 0.031, color: 'violet' },
    { name: 'Receipt', score: 0.014, color: 'emerald' },
    { name: 'Contract', score: 0.008, color: 'amber' },
  ],
};

export const MOCK_LATENCY: LatencyMetric[] = [
  { label: 'Classification', value: '34', unit: 'ms', icon: 'Zap', trend: 'down', trendValue: '12%' },
  { label: 'Embedding', value: '128', unit: 'ms', icon: 'Cpu', trend: 'neutral', trendValue: '0%' },
  { label: 'RAG Retrieval', value: '67', unit: 'ms', icon: 'Database', trend: 'down', trendValue: '8%' },
  { label: 'LLM Generation', value: '1.2', unit: 's', icon: 'Brain', trend: 'up', trendValue: '5%' },
  { label: 'Total Pipeline', value: '1.4', unit: 's', icon: 'Activity', trend: 'down', trendValue: '3%' },
  { label: 'Tokens Used', value: '2,048', unit: 'tok', icon: 'Hash', trend: 'neutral', trendValue: '0%' },
];

export const MOCK_CHUNKS: SourceChunk[] = [
  {
    id: 'chunk-1',
    text: 'Total amount due: $12,450.00. Payment terms: Net 30 days from invoice date. Late fees of 1.5% per month apply after due date.',
    page: 1,
    score: 0.94,
  },
  {
    id: 'chunk-2',
    text: 'Vendor: Acme Corp Solutions LLC. Invoice #: INV-2024-00847. Invoice Date: September 1, 2026. Due Date: October 1, 2026.',
    page: 1,
    score: 0.89,
  },
  {
    id: 'chunk-3',
    text: 'Line items: Software License (x3) - $9,000.00, Professional Services (8hrs) - $2,400.00, Support Plan (Annual) - $1,050.00.',
    page: 2,
    score: 0.76,
  },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What is the total amount due on this invoice?',
    timestamp: '17:05',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      'The total amount due on this invoice is **$12,450.00**. The payment terms are Net 30 days from the invoice date (September 1, 2026), making the due date **October 1, 2026**. Note that late fees of 1.5% per month apply after the due date.',
    sources: [MOCK_CHUNKS[0], MOCK_CHUNKS[1]],
    timestamp: '17:05',
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Can you break down the line items?',
    timestamp: '17:06',
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content:
      'Here is the breakdown of line items:\n\n• **Software License (×3)** — $9,000.00\n• **Professional Services (8 hrs)** — $2,400.00\n• **Support Plan (Annual)** — $1,050.00\n\nTotal: **$12,450.00** before any applicable taxes.',
    sources: [MOCK_CHUNKS[2]],
    timestamp: '17:06',
  },
];

export const MOCK_DOCUMENT = {
  name: 'INV-2024-00847.pdf',
  type: 'PDF',
  size: '284 KB',
  pages: 2,
  uploadedAt: '17:04',
};

export const MOCK_BOT_RESPONSES: { content: string; sources: SourceChunk[] }[] = [
  {
    content:
      'Based on the document, the vendor is **Acme Corp Solutions LLC** with invoice number **INV-2024-00847**. The document was issued on September 1, 2026.',
    sources: [
      {
        id: 'chunk-q1',
        text: 'Vendor: Acme Corp Solutions LLC. Invoice #: INV-2024-00847. Invoice Date: September 1, 2026.',
        page: 1,
        score: 0.92,
      },
    ],
  },
  {
    content:
      'The tax rate applied is **8.5%** on the subtotal of $12,450.00, resulting in a tax amount of $1,058.25. The grand total including tax would be **$13,508.25**.',
    sources: [
      {
        id: 'chunk-q2',
        text: 'Tax Rate: 8.5% on subtotal. Tax Amount: $1,058.25. Grand Total: $13,508.25.',
        page: 2,
        score: 0.88,
      },
    ],
  },
  {
    content:
      'Payment can be made via bank transfer (ACH/Wire), credit card, or company check. Bank details are provided on page 2 of the document.',
    sources: [
      {
        id: 'chunk-q3',
        text: 'Payment Methods: ACH/Wire Transfer, Credit Card, Company Check. See page 2 for bank details.',
        page: 2,
        score: 0.79,
      },
    ],
  },
];
