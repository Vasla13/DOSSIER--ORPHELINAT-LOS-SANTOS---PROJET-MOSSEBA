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
      <div class="kpi"><strong>${docs.length}</strong><span>Documents trouvés</span></div>
    </div>
    <div class="doc-grid">
      ${docs.map(d => {
          const imgUrl = (d.images && d.images[0]) ? escapeHtml(d.images[0]) : null;
          return `
          <div class="doc-card" data-open-doc="${escapeHtml(d.id)}">
            <div style="margin-bottom:8px">
                <span class="tag" style="background:#21262d; border-color:#30363d; color:#8b949e">${escapeHtml(d.type || "Inconnu")}</span>
                <span class="value" style="font-size:12px; float:right">${yearOf(d.date) || "?"}</span>
            </div>
            <h4 style="margin:0 0 8px 0; font-size:15px; color:#fff">${escapeHtml(d.title)}</h4>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.4; flex:1">${escapeHtml(d.summary || "")}</p>
            ${imgUrl ? `<div class="doc-thumb"><img src="${imgUrl}" loading="lazy"></div>` : ""}
          </div>
          `;
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
            <div class="doc-thumb" style="height:60px; background:var(--bg); border:none; display:flex; align-items:center;">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--accent); color:#000; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:18px">
                    ${p.name.charAt(0)}
                </div>
                <div style="margin-left:12px">
                    <div style="color:#fff; font-weight:bold">${escapeHtml(p.name)}</div>
                    <div style="font-size:11px; color:var(--text-muted)">${escapeHtml(p.role)}</div>
                </div>
            </div>
            <div style="margin-top:12px; font-size:13px; line-height:1.5; color:var(--text-main)">
                ${escapeHtml(p.summary || "Aucune information.")}
            </div>
        </div>
      `).join("")}
    </div>
  `;
}