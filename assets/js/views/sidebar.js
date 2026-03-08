import { escapeHtml } from "../utils.js";

// Petit helper interne pour générer les boutons "chips"
function chip(tag, pressed=false, cls="chip"){
  const content = pressed ? `${escapeHtml(tag)} &times;` : escapeHtml(tag);
  return `<button class="${cls}" data-chip="${escapeHtml(tag)}" aria-pressed="${pressed ? "true":"false"}" type="button">${content}</button>`;
}

export function renderSidebar(root, data, state){
  const countEvents = data.events.length;
  const countDocs = data.documents.length;
  const countPeople = (data.entities?.people || []).length;

  if (state.view === "overview") {
    root.innerHTML = `
      <div class="sidebar-mobile-bar">
        <div class="sidebar-mobile-title">Synthèse</div>
        <button class="sidebar-mobile-close" id="closeSidebar" type="button" aria-label="Fermer les filtres">✕</button>
      </div>

      <div class="section">
        <h3>Vue active</h3>
        <div class="kpi" style="margin:0">
          <strong>MOSSEBA</strong>
          <span>Lecture rapide du projet</span>
        </div>
      </div>

      <div class="section">
        <h3>Ce que tu trouves ici</h3>
        <div class="value" style="line-height:1.7">
          Résumé global du projet, personnes impliquées, étapes clés et preuves à ouvrir en priorité.
        </div>
      </div>

      <div class="section">
        <h3>Navigation rapide</h3>
        <div class="filters">
          <a class="chip" href="#overview-reading">Lecture</a>
          <a class="chip" href="#overview-chronology">Chronologie</a>
          <a class="chip" href="#overview-people">Personnes</a>
          <a class="chip" href="#overview-evidence">Preuves</a>
        </div>
      </div>

      <div style="margin-top:auto; padding-top:20px; border-top:1px solid var(--border)">
        <div class="label">Base actuelle</div>
        <div class="value" style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted)">
          EVTS: ${countEvents} | DOCS: ${countDocs} | PPL: ${countPeople}
        </div>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="sidebar-mobile-bar">
      <div class="sidebar-mobile-title">Filtres</div>
      <button class="sidebar-mobile-close" id="closeSidebar" type="button" aria-label="Fermer les filtres">✕</button>
    </div>

    <div class="section">
      <h3>Recherche</h3>
      <input class="input" id="q" placeholder="Mot-clé, référence..." value="${escapeHtml(state.query)}" autocomplete="off" />
    </div>

    ${["timeline", "documents"].includes(state.view) ? `
    <div class="section">
      <h3>Tri Chronologique</h3>
      <select class="input" id="sortDir">
        <option value="asc" ${state.sortDir==="asc"?"selected":""}>▲ Ancien → Récent</option>
        <option value="desc" ${state.sortDir==="desc"?"selected":""}>▼ Récent → Ancien</option>
      </select>
    </div>` : state.view === "graph" ? `<div class="kpi" style="margin-bottom:20px; font-size:11px; border-color:var(--accent); color:#fff; background:rgba(88,166,255,0.1); padding:10px; border-radius:6px; border:1px solid var(--accent)">
        <strong>Mode Enquête :</strong><br>
        Survol : Isoler les liens<br>
        Clic : Ouvrir le dossier<br>
        Molette : Zoomer
    </div>` : `<div class="kpi" style="margin-bottom:20px; font-size:11px; border-color:var(--border); color:var(--text-main); background:rgba(255,255,255,0.03); padding:10px; border-radius:6px; border:1px solid var(--border)">
        Les tags, types et la recherche s'appliquent aux archives liées à chaque sujet.
    </div>`}

    <div class="section">
      <h3>Filtres Rapides (Types)</h3>
      <div class="filters">
        ${state.allTypes.map(t => chip(t, state.activeTypes.has(t), "chip chip-type")).join("") || "<span class='value'>Aucun type</span>"}
      </div>
    </div>

    <div class="section">
      <h3>Tags</h3>
      <div class="filters">
        ${state.allTags.map(t => chip(t, state.activeTags.has(t))).join("") || "<span class='value'>Aucun tag</span>"}
      </div>
    </div>

    <div class="section">
      <h3>Personnes</h3>
      <select class="input" id="person">
        <option value="">— Tous les dossiers —</option>
        ${state.allPeople.map(p => `<option value="${escapeHtml(p.id)}" ${state.activePerson===p.id?"selected":""}>${escapeHtml(p.name)} (${escapeHtml(p.role)})</option>`).join("")}
      </select>
    </div>

    <div style="margin-top:auto; padding-top:20px; border-top:1px solid var(--border)">
        <div class="label">Données chargées</div>
        <div class="value" style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted)">
            EVTS: ${countEvents} | DOCS: ${countDocs} | PPL: ${countPeople}
        </div>
    </div>
  `;
}
