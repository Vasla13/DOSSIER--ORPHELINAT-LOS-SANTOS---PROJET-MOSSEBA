import { escapeHtml, fmtDate, yearOf, contains } from "./utils.js";

function chip(tag, pressed=false, cls="chip"){
  const content = pressed ? `${escapeHtml(tag)} &times;` : escapeHtml(tag);
  return `<button class="${cls}" data-chip="${escapeHtml(tag)}" aria-pressed="${pressed ? "true":"false"}">${content}</button>`;
}

/* --- SIDEBAR --- */
export function renderSidebar(root, data, state){
  const countEvents = data.events.length;
  const countDocs = data.documents.length;
  const countPeople = (data.entities?.people || []).length;

  root.innerHTML = `
    <div class="section">
      <h3>🔍 Recherche</h3>
      <input class="input" id="q" placeholder="Mot-clé, référence..." value="${escapeHtml(state.query)}" autocomplete="off" />
    </div>

    ${state.view !== "graph" ? `
    <div class="section">
      <h3>🔃 Tri Chronologique</h3>
      <select class="input" id="sortDir">
        <option value="asc" ${state.sortDir==="asc"?"selected":""}>▲ Ancien → Récent</option>
        <option value="desc" ${state.sortDir==="desc"?"selected":""}>▼ Récent → Ancien</option>
      </select>
    </div>` : `<div class="kpi" style="margin-bottom:20px; font-size:11px; border-color:var(--accent); color:#fff; background:rgba(88,166,255,0.1)">
        💡 <strong>Mode Enquête :</strong><br>
        • Survol : Isoler les liens<br>
        • Clic : Ouvrir le dossier<br>
        • Molette : Zoomer
    </div>`}

    <div class="section">
      <h3>📂 Filtres Rapides</h3>
      <div class="filters">
        ${state.allTypes.map(t => chip(t, state.activeTypes.has(t), "chip chip-type")).join("") || "<span class='value'>Aucun type</span>"}
      </div>
    </div>

    <div class="section">
      <h3>🏷️ Tags</h3>
      <div class="filters">
        ${state.allTags.map(t => chip(t, state.activeTags.has(t))).join("") || "<span class='value'>Aucun tag</span>"}
      </div>
    </div>

    <div class="section">
      <h3>👤 Personnes</h3>
      <select class="input" id="person">
        <option value="">— Tous les dossiers —</option>
        ${state.allPeople.map(p => `<option value="${escapeHtml(p.id)}" ${state.activePerson===p.id?"selected":""}>${escapeHtml(p.name)} (${p.role})</option>`).join("")}
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

/* --- Logique de filtrage --- */
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
  const peopleNames = (item.people || [])
    .map(id => (data.entities?.people || []).find(p => p.id === id)?.name)
    .filter(Boolean);
  parts.push(...peopleNames);
  if(item.transcription) parts.push(item.transcription);
  return parts.some(p => String(p).toLowerCase().includes(ql));
}

/* --- ROUTEUR CONTENU --- */
export function renderContent(root, data, state){
  if(state.view === "documents") return renderDocuments(root, data, state);
  if(state.view === "people") return renderPeople(root, data, state);
  if(state.view === "graph") return renderGraph(root, data, state);
  return renderTimeline(root, data, state);
}

// 4. GRAPHE RELATIONNEL (AVANCÉ)
function renderGraph(root, data, state) {
    if(!window.d3) {
        root.innerHTML = "<div class='kpi' style='color:red'>Erreur : D3.js non chargé.</div>";
        return;
    }

    // Légende
    root.innerHTML = `
      <div id="graph-legend">
        <div><span style="background:#58a6ff"></span> Sujet</div>
        <div><span style="background:#f85149"></span> Événement</div>
        <div><span style="background:#238636"></span> Preuve</div>
      </div>
      <div id="graph-container"></div>
    `;
    
    const container = document.getElementById("graph-container");
    const width = container.clientWidth;
    const height = container.clientHeight || 800; 

    // --- 1. PRÉPARATION DES DONNÉES (NOEUDS & LIENS) ---
    const nodes = [];
    const links = [];
    const nodeSet = new Set(); // Pour éviter les doublons

    // A. AJOUTER LES PERSONNES (BLEU)
    const people = (data.entities?.people || []).filter(p => matchByQuery(p, state.query, data));
    people.forEach(p => {
        nodes.push({ id: p.id, name: p.name, type: "person", r: 20, color: "#58a6ff" });
        nodeSet.add(p.id);
    });

    // B. AJOUTER LES DOCUMENTS (VERT)
    const docs = data.documents.filter(d => 
        matchByTags(d, state.activeTags) && 
        matchByTypes(d, state.activeTypes) &&
        matchByQuery(d, state.query, data)
    );
    docs.forEach(d => {
        // On ajoute le doc seulement s'il est lié à quelqu'un d'affiché, ou si aucun filtre de personne n'est actif
        const relatedPeople = (d.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(d.id)) {
            nodes.push({ id: d.id, name: (d.title.length > 15 ? d.title.substring(0,15)+"..." : d.title), type: "doc", r: 12, color: "#238636" });
            nodeSet.add(d.id);
            
            // Liens Doc -> Personnes
            (d.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: d.id });
            });
        }
    });

    // C. AJOUTER LES ÉVÉNEMENTS (ROUGE)
    const events = data.events.filter(e => 
        matchByTags(e, state.activeTags) && 
        matchByQuery(e, state.query, data)
    );
    events.forEach(e => {
        const relatedPeople = (e.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(e.id)) {
            nodes.push({ id: e.id, name: fmtDate(e.date), type: "event", r: 15, color: "#f85149" });
            nodeSet.add(e.id);

            // Liens Event -> Personnes
            (e.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: e.id });
            });

            // Liens Event -> Docs (Preuves)
            (e.related_docs || []).forEach(did => {
                if(nodeSet.has(did)) links.push({ source: e.id, target: did });
            });
        }
    });

    if(nodes.length === 0) {
        root.innerHTML = "<div class='kpi'>Aucune donnée relationnelle à afficher avec ces filtres.</div>";
        return;
    }

    // --- 2. SIMULATION D3 ---
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(80)) // Distance entre les noeuds liés
        .force("charge", d3.forceManyBody().strength(-250)) // Répulsion pour écarter les noeuds
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.r + 5)); // Évite le chevauchement

    // --- 3. RENDU SVG ---
    const svg = d3.select("#graph-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    // Groupe pour le zoom
    const g = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    // Dessiner les liens
    const link = g.append("g")
        .attr("stroke", "#30363d")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1.5);

    // Dessiner les noeuds (Groupes)
    const node = g.append("g")
        .selectAll(".node")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Cercles
    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => d.color)
        .attr("stroke", "#0d1117")
        .attr("stroke-width", 2);

    // Labels (Texte)
    node.append("text")
        .attr("x", d => d.r + 5)
        .attr("y", 4)
        .text(d => d.name)
        .style("font-family", "var(--font-mono)")
        .style("font-size", "10px")
        .style("fill", "#c9d1d9")
        .style("pointer-events", "none")
        .style("text-shadow", "0 1px 2px #000");

    // --- 4. INTERACTIONS (HOVER & CLICK) ---
    
    // Index des voisins pour le highlight rapide
    const linkedByIndex = {};
    links.forEach(d => {
        linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
        linkedByIndex[`${d.target.id},${d.source.id}`] = 1;
    });
    function isConnected(a, b) {
        return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    }

    // Gestion du Hover (Mode Focus)
    node.on("mouseover", (event, d) => {
        node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
        link.style("stroke-opacity", o => (o.source === d || o.target === d ? 1 : 0.05));
        link.style("stroke", o => (o.source === d || o.target === d ? "#fff" : "#30363d"));
    }).on("mouseout", () => {
        node.style("opacity", 1);
        link.style("stroke-opacity", 0.6);
        link.style("stroke", "#30363d");
    });

    // Gestion du Clic (Ouverture Modale)
    node.on("click", (event, d) => {
        event.stopPropagation();
        if(d.type === "doc") {
            const btn = document.createElement("button");
            btn.dataset.openDoc = d.id;
            root.appendChild(btn); btn.click(); root.removeChild(btn);
        } else if (d.type === "person") {
            const btn = document.createElement("button");
            btn.dataset.openPerson = d.id;
            root.appendChild(btn); btn.click(); root.removeChild(btn);
        } else if (d.type === "event") {
            const btn = document.createElement("button");
            btn.dataset.openEvent = d.id;
            root.appendChild(btn); btn.click(); root.removeChild(btn);
        }
    });

    // --- 5. UPDATE LOOP ---
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

// --- UTILITAIRE ICÔNES (Timeline) ---
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

// 1. TIMELINE VERTICALE
function renderTimeline(root, data, state){
  let events = data.events.slice();
  events = events.filter(e => matchByPerson(e, state.activePerson) && matchByTags(e, state.activeTags) && matchByQuery(e, state.query, data));
  
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

// 2. GRILLE DOCUMENTS
function renderDocuments(root, data, state){
  let docs = data.documents.slice();
  docs = docs.filter(d => matchByPerson(d, state.activePerson) && matchByTags(d, state.activeTags) && matchByTypes(d, state.activeTypes) && matchByQuery(d, state.query, data));

  docs.sort((a,b)=>{
    const ad = a.date || "0000-01-01";
    const bd = b.date || "0000-01-01";
    return state.sortDir==="asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });

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

// 3. PERSONNES
function renderPeople(root, data, state){
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

// MODAL
export function renderModal(modalRoot, payload, data){
  const { kind, id } = payload;
  let title = "Document";
  let body = "";

  if(kind === "doc"){
      const d = data.documents.find(x=>x.id===id);
      if(!d) return;
      title = `PREUVE #${d.id.split('_')[1] || d.id}`;
      const imagesHtml = (d.images||[]).map(src => 
          `<a href="${escapeHtml(src)}" target="_blank" style="display:block; margin-bottom:10px; border:1px solid var(--border); border-radius:4px; overflow:hidden">
             <img src="${escapeHtml(src)}" style="width:100%; display:block;">
             <div style="padding:8px; background:#0d1117; font-size:11px; color:var(--text-muted); text-align:center">Ouvrir en haute résolution ↗</div>
           </a>`
      ).join("");
      body = `
        <h2 style="margin:0 0 16px 0; color:#fff">${escapeHtml(d.title)}</h2>
        <div class="grid-details">
            <div>
                <div class="detail-block"><span class="label">Date & Type</span><span class="value">${escapeHtml(fmtDate(d.date))} <span class="tag">${escapeHtml(d.type)}</span></span></div>
                <div class="detail-block"><span class="label">Personnes Liées</span><div class="value">${(d.people||[]).map(pid => `• ${escapeHtml((data.entities?.people||[]).find(p=>p.id===pid)?.name || pid)}`).join("<br>") || "—"}</div></div>
            </div>
            <div>${imagesHtml}</div>
        </div>
        ${d.transcription ? `<div style="margin-top:24px"><span class="label">Contenu</span><div class="transcription">${escapeHtml(d.transcription)}</div></div>` : ""}
      `;
  } else if(kind === "person"){
      const p = (data.entities?.people||[]).find(x=>x.id===id);
      if(!p) return;
      title = "DOSSIER INDIVIDUEL";
      const relatedDocs = data.documents.filter(d => (d.people||[]).includes(p.id));
      body = `
        <h2 style="margin:0 0 0 0; color:#fff; font-size:28px">${escapeHtml(p.name)}</h2>
        <div style="color:var(--accent); margin-bottom:24px; font-family:var(--font-mono)">${escapeHtml(p.role)}</div>
        <div class="detail-block"><span class="label">Synthèse</span><div class="value">${escapeHtml(p.summary)}</div></div>
        <hr style="border:0; border-top:1px solid var(--border); margin:24px 0">
        <span class="label">Mentions dans les archives (${relatedDocs.length})</span>
        <ul style="padding-left:20px; color:var(--text-main)">${relatedDocs.map(d => `<li><a href="#" data-open-doc="${d.id}">${escapeHtml(d.title)}</a></li>`).join("")}</ul>
      `;
  } else if(kind === "event") {
      const e = data.events.find(x=>x.id===id);
      if(!e) return;
      title = "DÉTAILS DE L'ÉVÉNEMENT";
      
      const peopleLinks = (e.people || []).map(pid => {
         const p = (data.entities?.people||[]).find(x => x.id === pid);
         if(p) return `<li><a href="#" data-open-person="${escapeHtml(p.id)}" style="color:var(--accent)">${escapeHtml(p.name)}</a> <span style="font-size:0.9em; color:var(--text-muted)">(${p.role})</span></li>`;
         return `<li>${escapeHtml(pid)}</li>`;
      }).join("");

      const peopleSection = peopleLinks 
        ? `<ul style="margin:0; padding-left:20px; line-height:1.6">${peopleLinks}</ul>` 
        : `<div class="value" style="color:var(--text-muted); font-style:italic">Aucun sujet spécifié.</div>`;

      const docsLinks = (e.related_docs || []).map(did => {
         const d = data.documents.find(x => x.id === did);
         if(!d) return "";
         return `
            <div class="doc-card" data-open-doc="${escapeHtml(d.id)}" style="margin-bottom:8px; padding:10px; border:1px solid var(--border); background:rgba(255,255,255,0.03); display:flex; align-items:center; gap:10px; cursor:pointer">
               <div style="font-size:20px">📄</div>
               <div>
                  <div style="font-weight:bold; font-size:13px; color:#fff">${escapeHtml(d.title)}</div>
                  <div style="font-size:11px; color:var(--text-muted)">${escapeHtml(d.type)}</div>
               </div>
            </div>
         `;
      }).join("");

      const docsSection = docsLinks 
        ? `<div>${docsLinks}</div>` 
        : `<div class="value" style="color:var(--text-muted); font-style:italic">Aucune preuve liée.</div>`;

      body = `
        <h2 style="margin:0 0 5px 0; color:#fff; font-size:20px">${escapeHtml(e.title)}</h2>
        <div style="margin-bottom:20px; color:var(--accent); font-family:var(--font-mono); font-size:14px">
            ${escapeHtml(fmtDate(e.date))} ${e.approx ? "<span class='tag'>~ Approx</span>" : ""}
        </div>

        <div class="detail-block">
            <span class="label">RÉSUMÉ DES FAITS</span>
            <div class="transcription">${escapeHtml(e.summary)}</div>
        </div>

        <div class="grid-details" style="margin-top:24px; border-top:1px solid var(--border); padding-top:20px">
            <div>
                <span class="label" style="margin-bottom:12px">👥 SUJETS IMPLIQUÉS</span>
                ${peopleSection}
            </div>
            <div>
                <span class="label" style="margin-bottom:12px">🔍 PREUVES & DOSSIERS</span>
                ${docsSection}
            </div>
        </div>
      `;
  }

  modalRoot.querySelector("h3").textContent = title;
  modalRoot.querySelector(".body").innerHTML = body;
}