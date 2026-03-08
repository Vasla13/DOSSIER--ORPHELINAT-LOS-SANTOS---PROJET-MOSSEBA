import { escapeHtml, getDocumentsForPerson, getEventsForPerson, getThumbnailSrc, yearOf } from "../utils.js";
import { matchByPerson, matchByTags, matchByTypes, matchByQuery, sortItems } from "../logic/filters.js";

export function renderDocuments(root, data, state){
  let docs = data.documents.filter(d => 
    matchByPerson(d, state.activePerson, data) && 
    matchByTags(d, state.activeTags, data) && 
    matchByTypes(d, state.activeTypes, data) && 
    matchByQuery(d, state.query, data)
  );
  docs = sortItems(docs, state.sortDir);

  if (docs.length === 0) {
    root.innerHTML = `
      <div class="kpis">
        <div class="kpi"><strong>0</strong><span>Fichiers</span></div>
      </div>
      <div class="kpi" style="max-width:320px; margin:40px auto; opacity:0.7">Aucun document ne correspond aux filtres.</div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="kpis">
        <div class="kpi"><strong>${docs.length}</strong><span>Fichiers</span></div>
    </div>
    <div class="doc-grid">
      ${docs.map(d => {
          const thumbUrl = (d.images && d.images[0]) ? escapeHtml(getThumbnailSrc(d.images[0])) : null;
          const previewText = d.summary && d.summary.length > 80
            ? `${escapeHtml(d.summary.substring(0, 80))}...`
            : escapeHtml(d.summary || "Aucun résumé.");

          return `
          <div class="doc-card" data-open-doc="${escapeHtml(d.id)}">
            ${thumbUrl ? `<img src="${thumbUrl}" class="doc-thumb" loading="lazy" decoding="async" alt="${escapeHtml(d.title)}">` : ""}
            
            <div class="card-header">
                <span>${escapeHtml(d.type || "CLASSIFIE")}</span>
                <span>${yearOf(d.date) || "????"}</span>
            </div>
            
            <div class="card-body">
                <h4>${escapeHtml(d.title)}</h4>
                <p>${previewText}</p>
                ${(d.people||[]).length ? `<div style="margin-top:10px; font-size:10px; color:var(--accent)">${(d.people||[]).length} lie(s)</div>` : ""}
            </div>
          </div>`;
      }).join("")}
    </div>
  `;
}

export function renderPeople(root, data, state){
  const people = (data.entities?.people || []).slice()
    .filter(p => {
      const personDocs = getDocumentsForPerson(p.id, data);
      const personEvents = getEventsForPerson(p.id, data);
      const linkedItems = [...personDocs, ...personEvents];

      const matchesSelectedPerson = !state.activePerson || p.id === state.activePerson;
      const matchesQuery = matchByQuery(p, state.query, data) || linkedItems.some(item => matchByQuery(item, state.query, data));
      const matchesTags = state.activeTags.size === 0 || linkedItems.some(item => matchByTags(item, state.activeTags, data));
      const matchesTypes = state.activeTypes.size === 0 || personDocs.some(doc => matchByTypes(doc, state.activeTypes, data));

      return matchesSelectedPerson && matchesQuery && matchesTags && matchesTypes;
    })
    .sort((a,b)=>a.name.localeCompare(b.name,"fr"));

  if (people.length === 0) {
    root.innerHTML = `<div class="kpi" style="max-width:320px; margin:50px auto; opacity:0.7">Aucun sujet ne correspond aux filtres.</div>`;
    return;
  }

  root.innerHTML = `
    <div class="kpis">
      <div class="kpi"><strong>${people.length}</strong><span>Sujets</span></div>
    </div>
    <div class="doc-grid">
      ${people.map(p => {
        const relatedDocs = getDocumentsForPerson(p.id, data);
        const relatedEvents = getEventsForPerson(p.id, data);

        return `
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
                <div style="margin-top:12px; font-size:10px; color:var(--accent)">
                  DOCS ${relatedDocs.length} · EVTS ${relatedEvents.length}
                </div>
            </div>
        </div>
      `;
      }).join("")}
    </div>
  `;
}
