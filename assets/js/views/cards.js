import { escapeHtml, yearOf } from "../utils.js";
import { matchByPerson, matchByTags, matchByTypes, matchByQuery, sortItems } from "../logic/filters.js";

export function renderDocuments(root, data, state){
  let docs = data.documents.filter(d => 
    matchByPerson(d, state.activePerson) && 
    matchByTags(d, state.activeTags) && 
    matchByTypes(d, state.activeTypes) && 
    matchByQuery(d, state.query, data)
  );
  docs = sortItems(docs, state.sortDir);

  root.innerHTML = `
    <div class="kpis">
        <div class="kpi"><strong>${docs.length}</strong><span>Fichiers</span></div>
    </div>
    <div class="doc-grid">
      ${docs.map(d => {
          const imgUrl = (d.images && d.images[0]) ? escapeHtml(d.images[0]) : null;
          return `
          <div class="doc-card" data-open-doc="${escapeHtml(d.id)}">
            ${imgUrl ? `<img src="${imgUrl}" class="doc-thumb" loading="lazy">` : ""}
            
            <div class="card-header">
                <span>${escapeHtml(d.type || "CLASSIFIÉ")}</span>
                <span>${yearOf(d.date) || "????"}</span>
            </div>
            
            <div class="card-body">
                <h4>${escapeHtml(d.title)}</h4>
                <p>${escapeHtml(d.summary || "").substring(0, 80)}...</p>
                ${(d.people||[]).length ? `<div style="margin-top:10px; font-size:10px; color:var(--accent)">👥 ${(d.people||[]).length} lié(s)</div>` : ""}
            </div>
          </div>`;
      }).join("")}
    </div>
  `;
}

export function renderPeople(root, data, state){
  const people = (data.entities?.people || []).slice()
    .filter(p => matchByQuery(p, state.query, data))
    .sort((a,b)=>a.name.localeCompare(b.name,"fr"));

  root.innerHTML = `
    <div class="doc-grid">
      ${people.map(p => `
        <div class="doc-card" data-open-person="${escapeHtml(p.id)}">
            <div class="card-body">
                <div class="avatar-block">
                    <div class="avatar-circle">${p.name.charAt(0)}</div>
                    <div>
                        <div style="color:#fff; font-weight:bold; font-size:16px">${escapeHtml(p.name)}</div>
                        <div style="font-size:11px; color:var(--accent)">${escapeHtml(p.role)}</div>
                    </div>
                </div>
                <hr style="border:0; border-top:1px solid var(--border); width:100%; margin:10px 0">
                <p style="font-size:13px; color:var(--text-main)">${escapeHtml(p.summary || "Dossier vide.")}</p>
            </div>
        </div>
      `).join("")}
    </div>
  `;
}