import { escapeHtml, yearOf } from "../utils.js";
import { matchByPerson, matchByTags, matchByQuery, sortItems } from "../logic/filters.js";

// Fonction simplifiée : retourne une classe CSS au lieu d'un emoji
function getEventTypeClass(evt) {
  const text = (evt.title + " " + (evt.type||"")).toLowerCase();
  if (text.includes("mort") || text.includes("décès") || text.includes("meurtre")) return "type-mort";
  if (text.includes("police") || text.includes("lspd")) return "type-police";
  if (text.includes("médical") || text.includes("sang") || text.includes("coma")) return "type-medical";
  return "type-default"; // Gris par défaut
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
    root.innerHTML = `<div class="kpi" style="max-width:300px; margin:50px auto; opacity:0.5">Aucune donnée trouvée.</div>`;
    return;
  }

  let html = `
    <div class="kpis">
      <div class="kpi"><strong>${events.length}</strong><span>Entrées</span></div>
      <div class="kpi"><strong>${years.length}</strong><span>Années</span></div>
    </div>
    <div class="timeline-container">
  `;

  years.forEach(y => {
    const yearLabel = y === 0 ? "Non daté" : y;
    html += `<div class="timeline-year-separator"><span>${yearLabel}</span></div>`;
    
    byYear.get(y).forEach(e => {
        const typeClass = getEventTypeClass(e);
        const dateStr = e.date ? new Date(e.date).toLocaleDateString("fr-FR", {day:"2-digit", month:"2-digit"}) : "--/--";
        const proofCount = e.related_docs?.length || 0;

        html += `
        <div class="timeline-row ${typeClass}" data-open-event="${escapeHtml(e.id)}">
            <div class="tl-date">
                <span class="d-day">${dateStr}</span>
                ${e.approx ? "<span style='opacity:0.5'>~Approx</span>" : ""}
            </div>
            
            <div class="tl-marker">
                <div class="tl-dot"></div> 
            </div>
            
            <div class="tl-content">
                <div class="tl-card">
                    <div class="tl-header">
                        <h4>${escapeHtml(e.title)}</h4>
                    </div>
                    <p>${escapeHtml(e.summary)}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px">
                        <div class="tl-tags">
                            ${(e.tags||[]).slice(0,3).map(t=>`<span class="mini-tag">#${escapeHtml(t)}</span>`).join("")}
                        </div>
                        ${proofCount > 0 ? `<span style="font-size:10px; color:var(--success)">📎 ${proofCount} Preuve(s)</span>` : ""}
                    </div>
                </div>
            </div>
        </div>`;
    });
  });
  html += `</div>`;
  root.innerHTML = html;
}