// src/lib/types.ts
export type Pastor = {
  id: number;
  slug: string;
  name: string;
  era?: string;
  avatar?: string;
};

export type Source = {
  chunk_id: string;
  title: string | null;
  date: string | null;
  source_url: string | null;
  score?: number | null;
};

export type Msg = {
  id: string;
  text: string;
  isUser: boolean;
  pastorName?: string;
  sources?: Source[];
};

export type AskResponse = {
  answer?: string;
  sources?: Source[];
  model?: string;
  cached?: boolean;
};
