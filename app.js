import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Your Supabase project details
const SUPABASE_URL = "https://kcsvbisdjzhnoupxkvwx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc3ZiaXNkanpobm91cHhrdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTM3NzcsImV4cCI6MjA4NTYyOTc3N30.PVhzECCFj_ANfLvVMHqxrCKZyKh_LD4FUr4fqKcHH2Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// UI elements
const statusEl = document.getElementById("status");
const subjectsEl = document.getElementById("subjects");
const langSelect = document.getElementById("langSelect");

let currentLang = "en";
langSelect?.addEventListener("change", async (e) => {
  currentLang = e.target.value;
  await loadSubjects();
});

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadSubjects() {
  statusEl.textContent = "Loading subjects from Supabase…";
  subjectsEl.innerHTML = "";

  const { data, error } = await supabase
    .from("subjects")
    .select("id, code, name_en, name_ro")
    .order("name_en", { ascending: true });

  if (error) {
    statusEl.textContent = "Error loading subjects (see console).";
    console.error(error);
    return;
  }

  statusEl.textContent = `Loaded ${data.length} subjects.`;

  for (const s of data) {
    const name = currentLang === "ro" ? (s.name_ro || s.name_en) : s.name_en;

    const div = document.createElement("div");
    div.className = "subject";
    div.innerHTML = `
      <h3>${escapeHtml(name)}</h3>
      <p><small>Code: ${escapeHtml(s.code)}</small></p>
      <button data-subject-id="${escapeHtml(s.id)}">Open</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      alert(`Next step: show topics for subject ${s.code}. (We’ll build this next.)`);
    });

    subjectsEl.appendChild(div);
  }
}

loadSubjects();
