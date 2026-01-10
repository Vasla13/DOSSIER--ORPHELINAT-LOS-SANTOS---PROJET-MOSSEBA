import { escapeHtml, yearOf } from "../utils.js";
import { matchByPerson, matchByTags, matchByQuery, sortItems } from "../logic/filters.js";

function getEventIcon(evt) {
  const text = (evt.title + " " + (evt.tags||[]).join(" ")).toLowerCase();
  if (text.includes("mort") || text.includes("décès") || text.includes("meurtre")) return "💀";
  if (text.includes("police") || text.includes("lspd") || text.includes("enquête")) return "👮‍♂️";
  if (text.includes("médical") || text.includes("clinique") || text.includes("sang") || text.includes("dent")) return "⚕️";
  if (text.includes("argent") || text.includes("vente") || text.includes("compte") || text.includes("déficit")) return "💰";
  if (text.includes("naissance") || text.includes("enfant") || text.includes("rêve")) return "👶";
  if (text.includes("note") || text.includes("écrit") || text.includes("lettre")) return "📝";
  if (text.includes("mosseba") || text.includes("omega")) return "👁️";
  return "📂";
}

export function renderTimeline(root, data, state) {
  let events = data.events.filter(e => 
      matchByPerson(e, state.activePerson) && 
      matchByTags(e, state.activeTags) && 
      matchByQuery(e, state.query, data)
  );
  
  events = sortItems(events, state.sortDir);

  const byYear = new Map();
  for(const e of events){
    const y = yearOf(e.date) ?? 0;
    if(!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(e);
  }
  
  const years = [...byYear.keys()].sort((a,b)=> state.sortDir==="asc" ? a-b : b-a);

  if(years.length === 0) {
    root.innerHTML = `<div class="kpi" style="max-width:300px; margin:50px auto">Aucun événement ne correspond à la recherche.</div>`;
    return;
  }

  let html = `
    <div class="kpis">
      <div class="kpi"><strong>${events.length}</strong><span>Événements</span></div>
      <div class="kpi"><strong>${years.length}</strong><span>Périodes</span></div>
    </div>
    <div class="timeline-container">
  `;

  years.forEach(y => {
    const yearLabel = y === 0 ? "Date Inconnue" : y;
    html += `<div class="timeline-year-separator"><span>${yearLabel}</span></div>`;
    
    byYear.get(y).forEach(e => {
        const icon = getEventIcon(e);
        const dateStr = e.date ? new Date(e.date).toLocaleDateString("fr-FR", {day:"2-digit", month:"short"}) : "?";
        const approxHtml = e.approx ? `<span title="Date approximative" class="approx-indicator">~</span>` : "";
        const tagsHtml = (e.tags||[]).slice(0,3).map(t=>`<span class="mini-tag">${escapeHtml(t)}</span>`).join("");
        const proofs = e.related_docs?.length ? `<div class="proof-badge">📎 ${e.related_docs.length}</div>` : "";

        html += `
        <div class="timeline-row" data-open-event="${escapeHtml(e.id)}">
            <div class="tl-date"><span class="d-day">${dateStr}</span>${approxHtml}</div>
            <div class="tl-marker"><div class="tl-line"></div><div class="tl-icon">${icon}</div></div>
            <div class="tl-content">
                <div class="tl-card">
                    <div class="tl-header"><h4>${escapeHtml(e.title)}</h4>${proofs}</div>
                    <p>${escapeHtml(e.summary || "Aucun détail disponible.")}</p>
                    ${tagsHtml ? `<div class="tl-tags">${tagsHtml}</div>` : ""}
                </div>
            </div>
        </div>`;
    });
  });
  html += `</div>`;
  root.innerHTML = html;
}