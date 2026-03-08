import { escapeHtml, fmtDate, getDocumentsForPerson, getEventsForPerson } from "../utils.js";

const OVERVIEW_EVENT_IDS = [
  "evt_2023_deficit",
  "evt_2023_vente",
  "evt_incident_nuit",
  "evt_2024_v2",
  "evt_2024_coma",
  "evt_cannibalisme",
  "evt_2028_mosseba",
  "evt_codes"
];

const OVERVIEW_DOC_IDS = [
  "doc_comptes_2023",
  "doc_vente_2023",
  "doc_note_faute",
  "doc_xt_v2",
  "doc_marcia_suivi",
  "doc_note_perington",
  "doc_henri_kimmer",
  "doc_mosseba_origin",
  "doc_mosseba_eval",
  "doc_cctv_levy",
  "doc_lettre_codes",
  "doc_sienna_exam"
];

const PEOPLE_ORDER = [
  "p_sanders",
  "p_levy",
  "p_sienna",
  "p_marcia",
  "p_perington",
  "p_henri",
  "p_ethan",
  "p_samson"
];

const PERSON_BRIEFS = {
  p_sanders: {
    level: "Noyau",
    summary: "Reprend l'orphelinat, apparaît dans les comptes, puis dirige les essais XT Plasma."
  },
  p_levy: {
    level: "Nom associé",
    summary: "Le nom Levy ressort dans la surveillance CCTV et reste lié aux recoupements autour de MOSSEBA."
  },
  p_sienna: {
    level: "Point de contact",
    summary: "Nommée dans l'examen final et destinataire de la lettre codée qui prolonge le dossier."
  },
  p_marcia: {
    level: "Sujet test",
    summary: "Patiente suivie sous XT Plasma jusqu'à la perte de conscience et au transfert au bloc."
  },
  p_perington: {
    level: "Opérationnel",
    summary: "Destinataire des consignes sur l'aile dangereuse et la nitroglycérine."
  },
  p_henri: {
    level: "Signal faible",
    summary: "Son dossier fixe la formule 'Ils ont pris ma voix', utile pour le motif identitaire du projet."
  },
  p_ethan: {
    level: "Contexte",
    summary: "Ses écrits montrent l'environnement de contrainte dans l'orphelinat avant les pièces fédérales."
  },
  p_samson: {
    level: "Transition",
    summary: "Le vendeur de l'orphelinat matérialise la bascule de contrôle vers Anton Sanders."
  }
};

function getById(list, id) {
  return (list || []).find(item => item.id === id) || null;
}

function renderSectionLink(label, target) {
  return `<a class="overview-anchor" href="#${escapeHtml(target)}">${escapeHtml(label)}</a>`;
}

function renderEventCard(event) {
  return `
    <article class="overview-phase-card" data-open-event="${escapeHtml(event.id)}">
      <div class="overview-phase-date">${escapeHtml(fmtDate(event.date))}</div>
      <h4>${escapeHtml(event.title)}</h4>
      <p>${escapeHtml(event.summary)}</p>
      <div class="overview-inline-link">Ouvrir l'événement</div>
    </article>
  `;
}

function renderEvidenceCard(doc) {
  return `
    <article class="overview-evidence-card" data-open-doc="${escapeHtml(doc.id)}">
      <div class="card-header">
        <span>${escapeHtml(doc.type || "Archive")}</span>
        <span>${escapeHtml(fmtDate(doc.date))}</span>
      </div>
      <div class="card-body">
        <h4>${escapeHtml(doc.title)}</h4>
        <p>${escapeHtml(doc.summary || "Aucun résumé.")}</p>
        <div class="overview-inline-link">Ouvrir la preuve</div>
      </div>
    </article>
  `;
}

function renderPersonCard(person, data) {
  const brief = PERSON_BRIEFS[person.id] || {
    level: "Dossier",
    summary: person.summary || "Implication à préciser."
  };
  const relatedDocs = getDocumentsForPerson(person.id, data).slice(0, 3);
  const relatedEvents = getEventsForPerson(person.id, data);

  return `
    <article class="overview-person-card">
      <div class="overview-person-head">
        <button class="overview-person-name" type="button" data-open-person="${escapeHtml(person.id)}">${escapeHtml(person.name)}</button>
        <span class="tag">${escapeHtml(brief.level)}</span>
      </div>
      <div class="overview-person-role">${escapeHtml(person.role)}</div>
      <p>${escapeHtml(brief.summary)}</p>
      <div class="overview-person-metrics">DOCS ${relatedDocs.length} · EVTS ${relatedEvents.length}</div>
      <div class="overview-related-links">
        ${relatedDocs.map(doc => `<button type="button" class="overview-mini-link" data-open-doc="${escapeHtml(doc.id)}">${escapeHtml(doc.title)}</button>`).join("")}
      </div>
    </article>
  `;
}

export function renderOverview(root, data) {
  const mosseba = getById(data.entities?.orgs, "o_mosseba");
  const orphanage = getById(data.entities?.orgs, "o_orphelinat");
  const keyEvents = OVERVIEW_EVENT_IDS.map(id => getById(data.events, id)).filter(Boolean);
  const keyDocs = OVERVIEW_DOC_IDS.map(id => getById(data.documents, id)).filter(Boolean);
  const people = PEOPLE_ORDER.map(id => getById(data.entities?.people, id)).filter(Boolean);

  const years = keyEvents
    .map(event => Number(String(event.date || "").slice(0, 4)))
    .filter(year => Number.isFinite(year) && year > 0);
  const startYear = years.length ? Math.min(...years) : null;
  const endYear = years.length ? Math.max(...years) : null;

  root.innerHTML = `
    <div class="overview-shell">
      <section class="overview-hero">
        <div class="overview-hero-copy">
          <div class="overview-eyebrow">Synthèse du dossier</div>
          <h1>${escapeHtml(mosseba?.name || "Projet MOSSEBA")}</h1>
          <p>
            Le dossier relie ${escapeHtml(orphanage?.name || "l'orphelinat")} à une chaîne de gestion opaque,
            d'expérimentations médicales, de surveillance et de documents fédéraux autour de MOSSEBA.
            Les pièces vérifiées décrivent un projet orienté vers la continuité de la conscience et de l'identité
            hors support biologique.
          </p>
          <p>
            Le fil directeur passe par la reprise de l'orphelinat par Anton Sanders, les essais XT Plasma,
            les incidents cliniques, puis une bascule vers des pièces fédérales et des signaux plus tardifs
            autour de Sienna Cameron.
          </p>

          <div class="overview-anchor-row">
            ${renderSectionLink("Lecture du dossier", "overview-reading")}
            ${renderSectionLink("Chronologie", "overview-chronology")}
            ${renderSectionLink("Personnes impliquées", "overview-people")}
            ${renderSectionLink("Preuves centrales", "overview-evidence")}
          </div>
        </div>

        <div class="overview-hero-side">
          <div class="kpi"><strong>${keyDocs.length}</strong><span>Preuves clés</span></div>
          <div class="kpi"><strong>${people.length}</strong><span>Personnes impliquées</span></div>
          <div class="kpi"><strong>${keyEvents.length}</strong><span>Étapes du dossier</span></div>
          <div class="kpi"><strong>${startYear && endYear ? `${startYear}-${endYear}` : "?"}</strong><span>Période couverte</span></div>
        </div>
      </section>

      <section class="overview-section" id="overview-reading">
        <div class="overview-section-head">
          <h3>Lecture du dossier</h3>
          <p>Version courte et factuelle des pièces qui structurent MOSSEBA.</p>
        </div>

        <div class="overview-reading-grid">
          <article class="overview-reading-card">
            <h4>1. Infrastructure</h4>
            <p>
              Le point d'ancrage est l'orphelinat de Los Santos. Les comptes montrent un déficit, des dépenses
              techniques et l'apparition d'Anton Sanders avant la vente officielle.
            </p>
            <div class="overview-related-links">
              <button type="button" class="overview-mini-link" data-open-doc="doc_comptes_2023">Livre des comptes</button>
              <button type="button" class="overview-mini-link" data-open-doc="doc_vente_2023">Acte de vente</button>
            </div>
          </article>

          <article class="overview-reading-card">
            <h4>2. Expérimentation</h4>
            <p>
              XT Plasma apparaît comme le volet médical du dossier. Les pièces vérifiées confirment la dissociation,
              la montée de tension, la nitroglycérine et le passage au bloc chez Marcia Wilson.
            </p>
            <div class="overview-related-links">
              <button type="button" class="overview-mini-link" data-open-doc="doc_xt_v2">Rapport XT Plasma V2</button>
              <button type="button" class="overview-mini-link" data-open-doc="doc_marcia_suivi">Suivi Marcia</button>
              <button type="button" class="overview-mini-link" data-open-doc="doc_note_perington">Note Perington</button>
            </div>
          </article>

          <article class="overview-reading-card">
            <h4>3. Bascule MOSSEBA</h4>
            <p>
              Les dossiers fédéraux parlent d'une continuité de conscience hors support biologique, puis classent
              MOSSEBA comme menace existentielle maximale. La surveillance Levy et la lettre à Sienna prolongent
              ce noyau après les incidents médicaux.
            </p>
            <div class="overview-related-links">
              <button type="button" class="overview-mini-link" data-open-doc="doc_mosseba_origin">Origine MOSSEBA</button>
              <button type="button" class="overview-mini-link" data-open-doc="doc_mosseba_eval">Évaluation fédérale</button>
              <button type="button" class="overview-mini-link" data-open-doc="doc_lettre_codes">Lettre à Sienna</button>
            </div>
          </article>
        </div>
      </section>

      <section class="overview-section" id="overview-chronology">
        <div class="overview-section-head">
          <h3>Chronologie condensée</h3>
          <p>Les étapes qui font passer le dossier d'un lieu fermé à un projet classé OMEGA.</p>
        </div>
        <div class="overview-phase-grid">
          ${keyEvents.map(renderEventCard).join("")}
        </div>
      </section>

      <section class="overview-section" id="overview-people">
        <div class="overview-section-head">
          <h3>Personnes impliquées</h3>
          <p>Classement par rôle dans le dossier, avec renvoi direct vers les pièces qui les concernent.</p>
        </div>
        <div class="overview-people-grid">
          ${people.map(person => renderPersonCard(person, data)).join("")}
        </div>
      </section>

      <section class="overview-section" id="overview-evidence">
        <div class="overview-section-head">
          <h3>Preuves centrales</h3>
          <p>Les pièces à ouvrir en priorité pour comprendre MOSSEBA sans refaire toute la timeline.</p>
        </div>
        <div class="overview-evidence-grid">
          ${keyDocs.map(renderEvidenceCard).join("")}
        </div>
      </section>
    </div>
  `;
}
