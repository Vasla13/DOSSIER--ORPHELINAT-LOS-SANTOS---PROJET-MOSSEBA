import { escapeHtml, fmtDate, yearOf, contains } from "./utils.js";

function chip(tag, pressed=false, cls="chip"){
  return `<button class="${cls}" data-chip="${escapeHtml(tag)}" aria-pressed="${pressed ? "true":"false"}">${escapeHtml(tag)}</button>`;
}

export function renderSidebar(root, data, state){
  const countEvents = data.events.length;
  const countDocs = data.documents.length;
  const countPeople = (data.entities?.people || []).length;

  root.innerHTML = `
    <div class="section">
      <h3>Recherche</h3>
      <input class="input" id="q" placeholder="mot-clé, nom, tag…" value="${escapeHtml(state.query)}" />
    </div>

    <div class="section">
      <h3>Tri</h3>
      <div class="row">
        <select class="input" id="sortDir">
          <option value="asc" ${state.sortDir==="asc"?"selected":""}>Ancien → récent</option>
          <option value="desc" ${state.sortDir==="desc"?"selected":""}>Récent → ancien</option>
        </select>
      </div>
    </div>

    <div class="section">
      <h3>Tags (filtre)</h3>
      <div class="filters">
        ${state.allTags.map(t => chip(t, state.activeTags.has(t))).join("") || "<span class='small'>Aucun tag</span>"}
      </div>
    </div>

    <div class="section">
      <h3>Types de documents</h3>
      <div class="filters">
        ${state.allTypes.map(t => chip(t, state.activeTypes.has(t), "chip chip-type")).join("") || "<span class='small'>Aucun type</span>"}
      </div>
    </div>

    <div class="section">
      <h3>Personnes</h3>
      <select class="input" id="person">
        <option value="">— Toutes —</option>
        ${state.allPeople.map(p => `<option value="${escapeHtml(p.id)}" ${state.activePerson===p.id?"selected":""}>${escapeHtml(p.name)}</option>`).join("")}
      </select>
    </div>

    <hr class="sep"/>

    <div class="section">
      <h3>Statistiques</h3>
      <div class="small">
        <div>Événements: <b>${countEvents}</b></div>
        <div>Documents: <b>${countDocs}</b></div>
        <div>Personnes: <b>${countPeople}</b></div>
        <div style="margin-top:8px; opacity:.9">Généré: ${escapeHtml(data.meta?.generated_at || "")}</div>
      </div>
    </div>

    <div class="section">
      <h3>Note</h3>
      <div class="small">
        ${(data.meta?.notes || []).map(n => `• ${escapeHtml(n)}`).join("<br>")}
      </div>
    </div>
  `;
}

function matchByPerson(item, personId){
  if(!personId) return true;
  const ppl = item.people || [];
  return ppl.includes(personId);
}
function matchByTags(item, activeTags){
  if(activeTags.size === 0) return true;
  const tags = item.tags || [];
  for(const t of activeTags) if(tags.includes(t)) return true;
  return false;
}
function matchByTypes(doc, activeTypes){
  if(activeTypes.size === 0) return true;
  return activeTypes.has(doc.type);
}
function matchByQuery(item, q, data){
  if(!q) return true;
  const ql = q.toLowerCase();
  const parts = [
    item.title, item.summary, item.type,
    ...(item.tags||[])
  ].filter(Boolean);

  // include people names if referenced
  const peopleNames = (item.people || [])
    .map(id => (data.entities?.people || []).find(p => p.id === id)?.name)
    .filter(Boolean);
  parts.push(...peopleNames);

  // include light transcription if any
  if(item.transcription) parts.push(item.transcription);

  return parts.some(p => String(p).toLowerCase().includes(ql));
}

function docMiniCard(doc, data){
  const y = yearOf(doc.date) ?? "—";
  const approx = doc.approx ? `<span class="badge approx">approx.</span>` : "";
  const img = (doc.images && doc.images[0]) ? `<img src="${escapeHtml(doc.images[0])}" alt="">` : "";
  return `
    <div class="card" data-open-doc="${escapeHtml(doc.id)}">
      <div class="meta">
        <span>${escapeHtml(doc.type || "Document")}</span>
        <span>•</span>
        <span>${escapeHtml(String(y))}</span>
        ${approx}
      </div>
      <h4>${escapeHtml(doc.title)}</h4>
      <p>${escapeHtml(doc.summary || "")}</p>
      ${doc.tags?.length ? `<div class="tags">${doc.tags.slice(0,8).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`:""}
      ${img ? `<div class="tags" style="margin-top:10px"><span class="tag">aperçu</span></div><div class="thumb" style="width:220px; margin-top:10px">${img}</div>` : ""}
    </div>
  `;
}

export function renderContent(root, data, state){
  if(state.view === "documents") return renderDocuments(root, data, state);
  if(state.view === "people") return renderPeople(root, data, state);
  return renderTimeline(root, data, state);
}

function renderTimeline(root, data, state){
  let events = data.events.slice();

  // filters
  events = events.filter(e => matchByPerson(e, state.activePerson));
  events = events.filter(e => matchByTags(e, state.activeTags));
  events = events.filter(e => matchByQuery(e, state.query, data));

  // sort
  events.sort((a,b)=>{
    const ad = a.date || "0000-01-01";
    const bd = b.date || "0000-01-01";
    return state.sortDir==="asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });

  const byYear = new Map();
  for(const e of events){
    const y = yearOf(e.date) ?? 0;
    if(!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(e);
  }

  const years = [...byYear.keys()].sort((a,b)=> state.sortDir==="asc" ? a-b : b-a);

  root.innerHTML = `
    <div class="kpis">
      <div class="kpi"><strong>${events.length}</strong><span>événements affichés</span></div>
      <div class="kpi"><strong>${data.documents.length}</strong><span>documents totaux</span></div>
      <div class="kpi"><strong>${(data.entities?.people||[]).length}</strong><span>personnes</span></div>
    </div>

    <div class="list">
      ${years.map(y=>{
        const title = y===0 ? "Date inconnue" : y;
        return `
          <div style="padding:6px 2px 0">
            <div class="small" style="letter-spacing:.14em; text-transform:uppercase; color:#9fb0c0">${escapeHtml(String(title))}</div>
          </div>
          ${byYear.get(y).map(e => eventCard(e)).join("")}
        `;
      }).join("") || `<div class="small">Aucun résultat.</div>`}
    </div>
  `;
}

function eventCard(e){
  const approx = e.approx ? `<span class="badge approx">approx.</span>` : "";
  return `
    <div class="card" data-open-event="${escapeHtml(e.id)}">
      <div class="meta">
        <span>${escapeHtml(fmtDate(e.date))}</span>
        ${approx}
      </div>
      <h4>${escapeHtml(e.title)}</h4>
      <p>${escapeHtml(e.summary || "")}</p>
      ${e.tags?.length ? `<div class="tags">${e.tags.slice(0,8).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`:""}
    </div>
  `;
}

function renderDocuments(root, data, state){
  let docs = data.documents.slice();

  docs = docs.filter(d => matchByPerson(d, state.activePerson));
  docs = docs.filter(d => matchByTags(d, state.activeTags));
  docs = docs.filter(d => matchByTypes(d, state.activeTypes));
  docs = docs.filter(d => matchByQuery(d, state.query, data));

  docs.sort((a,b)=>{
    const ad = a.date || "0000-01-01";
    const bd = b.date || "0000-01-01";
    return state.sortDir==="asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });

  root.innerHTML = `
    <div class="kpis">
      <div class="kpi"><strong>${docs.length}</strong><span>documents affichés</span></div>
      <div class="kpi"><strong>${data.documents.length}</strong><span>documents totaux</span></div>
      <div class="kpi"><strong>${state.activeTypes.size}</strong><span>types filtrés</span></div>
    </div>
    <div class="list">
      ${docs.map(d => docMiniCard(d, data)).join("") || `<div class="small">Aucun résultat.</div>`}
    </div>
  `;
}

function renderPeople(root, data, state){
  const people = (data.entities?.people || []).slice()
    .filter(p => matchByQuery(p, state.query, data))
    .sort((a,b)=>a.name.localeCompare(b.name,"fr"));

  root.innerHTML = `
    <div class="kpis">
      <div class="kpi"><strong>${people.length}</strong><span>personnes affichées</span></div>
      <div class="kpi"><strong>${(data.events||[]).length}</strong><span>événements</span></div>
      <div class="kpi"><strong>${(data.documents||[]).length}</strong><span>documents</span></div>
    </div>
    <div class="list">
      ${people.map(p => `
        <div class="card" data-open-person="${escapeHtml(p.id)}">
          <div class="meta"><span>${escapeHtml(p.role || "—")}</span></div>
          <h4>${escapeHtml(p.name)}</h4>
          <p>${escapeHtml(p.summary || "")}</p>
        </div>
      `).join("") || `<div class="small">Aucun résultat.</div>`}
    </div>
  `;
}

export function renderModal(modalRoot, payload, data){
  const { kind, id } = payload;

  let title = "";
  let body = "";

  if(kind==="event"){
    const e = data.events.find(x=>x.id===id);
    if(!e) return;
    title = e.title;
    body = `
      <div class="grid">
        <div class="kv">
          <div class="key">Date</div><div>${escapeHtml(fmtDate(e.date))} ${e.approx?`<span class="badge approx" style="margin-left:6px">approx.</span>`:""}</div>
          <div class="key">Résumé</div><div>${escapeHtml(e.summary||"")}</div>
          <div class="key">Tags</div><div>${(e.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join(" ") || "—"}</div>
          <div class="key">Personnes</div><div>${(e.people||[]).map(pid => escapeHtml((data.entities?.people||[]).find(p=>p.id===pid)?.name || pid)).join(", ") || "—"}</div>
        </div>

        <div class="kv">
          <div class="key">Documents liés</div>
          <div>
            ${(e.related_docs||[]).map(did=>{
              const d = data.documents.find(x=>x.id===did);
              if(!d) return "";
              return `<div style="margin-bottom:8px"><a href="#" data-open-doc="${escapeHtml(d.id)}">${escapeHtml(d.title)}</a></div>`;
            }).join("") || "—"}
          </div>
          <div class="key">Note</div>
          <div class="small">Les documents originaux peuvent contenir des zones censurées/noircies.</div>
        </div>
      </div>
    `;
  }

  if(kind==="doc"){
    const d = data.documents.find(x=>x.id===id);
    if(!d) return;
    title = d.title;
    const imgs = (d.images||[]).map((src,i)=>`
      <a class="thumb" href="${escapeHtml(src)}" target="_blank" rel="noreferrer">
        <img src="${escapeHtml(src)}" alt="image ${i+1}">
        <span>Ouvrir l’image</span>
      </a>
    `).join("");
    body = `
      <div class="grid">
        <div class="kv">
          <div class="key">Type</div><div>${escapeHtml(d.type||"—")}</div>
          <div class="key">Date</div><div>${escapeHtml(fmtDate(d.date))} ${d.approx?`<span class="badge approx" style="margin-left:6px">approx.</span>`:""}</div>
          <div class="key">Résumé</div><div>${escapeHtml(d.summary||"")}</div>
          <div class="key">Tags</div><div>${(d.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join(" ") || "—"}</div>
        </div>

        <div class="kv">
          <div class="key">Personnes</div><div>${(d.people||[]).map(pid => escapeHtml((data.entities?.people||[]).find(p=>p.id===pid)?.name || pid)).join(", ") || "—"}</div>
          <div class="key">Orgs</div><div>${(d.orgs||[]).map(oid => escapeHtml((data.entities?.orgs||[]).find(o=>o.id===oid)?.name || oid)).join(", ") || "—"}</div>
          <div class="key">Lieux</div><div>${(d.places||[]).map(lid => escapeHtml((data.entities?.places||[]).find(l=>l.id===lid)?.name || lid)).join(", ") || "—"}</div>
        </div>
      </div>

      ${imgs ? `<h4 style="margin:14px 0 8px">Images</h4><div class="images">${imgs}</div>` : ""}

      ${d.transcription ? `<h4 style="margin:14px 0 8px">Transcription</h4><pre>${escapeHtml(d.transcription)}</pre>` : ""}

      ${d.extraction ? `<h4 style="margin:14px 0 8px">Extraction structurée</h4><pre>${escapeHtml(JSON.stringify(d.extraction, null, 2))}</pre>` : ""}
    `;
  }

  if(kind==="person"){
    const p = (data.entities?.people||[]).find(x=>x.id===id);
    if(!p) return;
    title = p.name;
    const docs = data.documents.filter(d => (d.people||[]).includes(p.id));
    const events = data.events.filter(e => (e.people||[]).includes(p.id));
    body = `
      <div class="grid">
        <div class="kv">
          <div class="key">Rôle</div><div>${escapeHtml(p.role||"—")}</div>
          <div class="key">Résumé</div><div>${escapeHtml(p.summary||"")}</div>
        </div>
        <div class="kv">
          <div class="key">Documents (${docs.length})</div>
          <div>${docs.map(d => `<div style="margin-bottom:8px"><a href="#" data-open-doc="${escapeHtml(d.id)}">${escapeHtml(d.title)}</a></div>`).join("") || "—"}</div>
          <div class="key">Événements (${events.length})</div>
          <div>${events.map(e => `<div style="margin-bottom:8px"><a href="#" data-open-event="${escapeHtml(e.id)}">${escapeHtml(e.title)}</a></div>`).join("") || "—"}</div>
        </div>
      </div>
    `;
  }

  modalRoot.querySelector("h3").textContent = title;
  modalRoot.querySelector(".body").innerHTML = body;
}
