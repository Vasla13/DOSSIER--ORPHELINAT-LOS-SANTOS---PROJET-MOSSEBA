import { escapeHtml, fmtDate } from "../utils.js";

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