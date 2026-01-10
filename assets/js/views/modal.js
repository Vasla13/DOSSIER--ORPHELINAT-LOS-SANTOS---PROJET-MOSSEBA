import { escapeHtml, fmtDate } from "../utils.js";
import { getRichDescription } from "../lore.js"; 

export function renderModal(modalRoot, payload, data){
  const { kind, id } = payload;
  let title = "Document";
  let body = "";

  // =========================================================
  // 1. GESTION DES PREUVES (Documents)
  // =========================================================
  if(kind === "doc"){
      const d = data.documents.find(x => x.id === id);
      if(!d) return;

      // Récupération du "Lore" riche ou fallback sur le résumé standard
      const richContent = getRichDescription(d);
      const contentDisplay = richContent 
          ? richContent 
          : escapeHtml(d.summary || "Aucune information disponible.");

      title = `PREUVE #${d.id.split('_')[1] || d.id}`;
      
      // Génération de la colonne images
      const imagesHtml = (d.images||[]).map(src => 
          `<a href="${escapeHtml(src)}" target="_blank" class="modal-img-link">
             <img src="${escapeHtml(src)}" loading="lazy">
             <div class="modal-img-caption">Ouvrir en haute résolution ↗</div>
           </a>`
      ).join("");

      body = `
        <h2 class="modal-title">${escapeHtml(d.title)}</h2>
        
        <div class="grid-details">
            <div class="info-column">
                <div class="detail-block">
                    <span class="label">Date & Type</span>
                    <span class="value">${escapeHtml(fmtDate(d.date))} <span class="tag">${escapeHtml(d.type)}</span></span>
                </div>
                
                <div class="transcription rich-text">
                    ${contentDisplay}
                </div>
            </div>

            <div class="media-column">
                ${imagesHtml}
            </div>
        </div>
        
        ${d.transcription ? `<div style="margin-top:24px; border-top:1px solid var(--border); padding-top:10px"><span class="label">Transcription Brute</span><div class="transcription" style="opacity:0.7">${escapeHtml(d.transcription)}</div></div>` : ""}
      `;

  // =========================================================
  // 2. GESTION DES SUJETS (Personnes)
  // =========================================================
  } else if(kind === "person"){
      const p = (data.entities?.people || []).find(x => x.id === id);
      if(!p) return;
      
      title = "DOSSIER INDIVIDUEL";

      // Récupération du "Lore" riche ou fallback sur le résumé standard
      const richContent = getRichDescription(p);
      const summaryHtml = richContent 
          ? `<div class="rich-text">${richContent}</div>` 
          : `<div class="value">${escapeHtml(p.summary || "Aucune information.")}</div>`;

      // Récupération des documents liés
      const relatedDocs = data.documents.filter(d => (d.people || []).includes(p.id));
      
      body = `
        <h2 style="margin:0 0 0 0; color:#fff; font-size:28px">${escapeHtml(p.name)}</h2>
        <div style="color:var(--accent); margin-bottom:24px; font-family:var(--font-mono)">${escapeHtml(p.role)}</div>
        
        <div class="detail-block">
            <span class="label">ANALYSE DU SUJET</span>
            ${summaryHtml}
        </div>

        <hr style="border:0; border-top:1px solid var(--border); margin:24px 0">
        
        <span class="label">Mentions dans les archives (${relatedDocs.length})</span>
        <ul style="padding-left:20px; color:var(--text-main); margin-top:10px">
            ${relatedDocs.map(d => `<li><a href="#" data-open-doc="${d.id}">${escapeHtml(d.title)}</a></li>`).join("")}
        </ul>
      `;

  // =========================================================
  // 3. GESTION DES ÉVÉNEMENTS (Timeline)
  // =========================================================
  } else if(kind === "event") {
      const e = data.events.find(x => x.id === id);
      if(!e) return;
      title = "DÉTAILS DE L'ÉVÉNEMENT";
      
      // Liste des personnes impliquées
      const peopleLinks = (e.people || []).map(pid => {
         const p = (data.entities?.people || []).find(x => x.id === pid);
         if(p) return `<li><a href="#" data-open-person="${escapeHtml(p.id)}" style="color:var(--accent)">${escapeHtml(p.name)}</a> <span style="font-size:0.9em; color:var(--text-muted)">(${p.role})</span></li>`;
         return `<li>${escapeHtml(pid)}</li>`;
      }).join("");

      // Liste des preuves liées (Mini cartes)
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
                ${peopleLinks ? `<ul style="margin:0; padding-left:20px; line-height:1.6">${peopleLinks}</ul>` : `<div class="value" style="color:var(--text-muted); font-style:italic">Aucun sujet spécifié.</div>`}
            </div>
            <div>
                <span class="label" style="margin-bottom:12px">🔍 PREUVES & DOSSIERS</span>
                ${docsLinks ? `<div>${docsLinks}</div>` : `<div class="value" style="color:var(--text-muted); font-style:italic">Aucune preuve liée.</div>`}
            </div>
        </div>
      `;
  }

  // Injection finale dans le DOM
  modalRoot.querySelector("h3").textContent = title;
  modalRoot.querySelector(".body").innerHTML = body;
}