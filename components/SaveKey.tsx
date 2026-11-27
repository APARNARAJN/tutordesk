"use client";
import { useEffect } from "react";
// Remembers the dashboard key in this browser so the navbar can link back to the dashboard from any page.
export default function SaveKey({ k }: { k: string }) {
  useEffect(() => { try { localStorage.setItem("tutordesk_key", k); } catch {} }, [k]);
  return null;
}
