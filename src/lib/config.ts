// src/lib/config.ts
const serverOrigin = "https://api.ro-eh.com";
  //process.env.BACKEND_ORIGIN ||
  //(process.env.NODE_ENV === "production"
    //? "https://api.ro-eh.com"
    //: "http://localhost:3000");

export const API_BASE = "https://api.ro-eh.com";
export const PASTORS_URL = process.env.NEXT_PUBLIC_PASTORS_URL || "/tools/pastors.json";
export const ENDPOINTS = {
  ask: "/ask",
  askStream: "/ask/stream",
  pastors: "/tools/pastors.json",
};

export const ASK_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_ASK_TIMEOUT_MS || 180000);
export const TOP_K = Number(process.env.NEXT_PUBLIC_TOP_K || 3);

export const FALLBACK_PASTORS = [
  { id: 1, slug: "oyedepo",    name: "Bishop David Oyedepo",   era: "The Living Faith Church Worldwide", avatar: "/avatars/oyedepo.jpg" },
  { id: 2, slug: "adeboye",    name: "Pastor Enoch Adeboye",   era: "The Redeem Christian Church of God", avatar: "/avatars/adeboye.jpg" },
  { id: 3, slug: "adefarasin", name: "Pastor Paul Adefarasin", era: "The House on the Rock", avatar: "/avatars/adefarasin.jpg" },
  { id: 4, slug: "ibiyome",    name: "Pastor David Ibiyeomie", era: "Salvation Ministries", avatar: "/avatars/ibiyeomie.jpg" },
] as const;
