export function escapeHtml(str=""){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function fmtDate(iso){
  if(!iso) return "Date inconnue";
  // ISO may be "YYYY-MM-DD"
  const d = new Date(iso+"T00:00:00");
  if(Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {year:"numeric", month:"short", day:"2-digit"});
}

export function yearOf(iso){
  if(!iso) return null;
  const m = String(iso).match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

export function uniq(arr){
  return [...new Set(arr)];
}

export function contains(haystack, needle){
  return String(haystack||"").toLowerCase().includes(String(needle||"").toLowerCase());
}
