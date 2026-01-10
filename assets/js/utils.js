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
  // ISO format YYYY-MM-DD
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

/* --- FONCTION AJOUTÉE POUR CORRIGER L'ERREUR --- */
export function parseData(source) {
    // Si aucune source n'est passée, on renvoie une structure vide pour éviter les crashs
    if(!source) {
        return { 
            meta: {}, 
            entities: { people:[], orgs:[], places:[] }, 
            documents: [], 
            events: [] 
        };
    }

    // On s'assure que la structure est complète
    return {
        meta: source.meta || {},
        entities: {
            people: source.entities?.people || [],
            orgs: source.entities?.orgs || [],
            places: source.entities?.places || []
        },
        documents: source.documents || [],
        events: source.events || []
    };
}