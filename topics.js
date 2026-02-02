import { createClient } from "https://esm.sh/@supabase/supabase-js@2?bundle";

const SUPABASE_URL = "https://kcsvbisdjzhnoupxkvwx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc3ZiaXNkanpobm91cHhrdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTM3NzcsImV4cCI6MjA4NTYyOTc3N30.PVhzECCFj_ANfLvVMHqxrCKZyKh_LD4FUr4fqKcHH2Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const statusEl = document.getElementById("status");
const topicsEl = document.getElementById("topics");
const titleEl = document.getElementById("title");
const langSelect = document.getElementById("langSelect");

const params = new URLSearchParams(location.search);
const subjectId = params.get("subjectId");
const subjectCode = params.get("subjectCode") || "";

let currentLang = "en";
langSelect?.addEventListener("change", async (e) => {
  currentLang = e.target.value;
  await loadTopics();
});

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadTopics() {
  if (!subjectId) {
    statusEl.textContent = "Missing subjectId in URL. Go back and pick a subject.";
    return;
  }

  titleEl.textContent = `Topics (${subjectCode})`;
  statusEl.textContent = "Loading topics from Supabase…";
  topicsEl.innerHTML = "";

  const { data, error } = await supabase
    .from("topics")
    .select("id, title_en, title_ro, study_year, university_scope")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    statusEl.textContent = "Error loading topics (open Console).";
    console.error(error);
    return;
  }

  statusEl.textContent = `Loaded ${data.length} topics.`;

  for (const t of data) {
    const title = currentLang === "ro" ? (t.title_ro || t.title_en) : t.title_en;

    const div = document.createElement("div");
    div.className = "subject";
    div.innerHTML = `
      <h3>${escapeHtml(title)}</h3>
      <p><small>Year ${escapeHtml(t.study_year)} • ${escapeHtml(t.university_scope)}</small></p>
      <button>Open</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      location.href = `./topic.html?topicId=${encodeURIComponent(t.id)}&lang=${encodeURIComponent(currentLang)}`;
    });

    topicsEl.appendChild(div);
  }
}

loadTopics();
