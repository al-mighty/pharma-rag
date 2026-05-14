export interface Source {
  chunk_id: string;
  document_id: string;
  drug_name: string;
  filename: string;
  page_number: number | null;
  content: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}