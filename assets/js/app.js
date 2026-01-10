import { renderContent, renderSidebar, renderModal } from "./renderers.js";
import { state, setState, initFilters } from "./state.js"; // Import corrigé
import { parseData } from "./utils.js";

// --- Main Init ---
async function init() {
  try {
    // 1. Chargement des données
    let rawData = null;

    if (window.TIMELINE_DATA) {
        rawData = window.TIMELINE_DATA;
    } else if (typeof timelineData !== "undefined") {
        rawData = timelineData;
    }

    if(!rawData) {
        document.body.innerHTML = `
            <div style='color:#f85149; text-align:center; margin-top:50px; font-family:monospace'>
                <h1>ERREUR CRITIQUE</h1>
                <p>Les données (data/timeline.js) sont introuvables.</p>
            </div>`;
        return;
    }

    const data = parseData(rawData);
    
    // 2. Initialisation des filtres (Tags, Types, Personnes)
    initFilters(data); 

    // 3. Premier Rendu
    render(data);

    // 4. Activation des événements
    wireEvents(data);

  } catch (err) {
    console.error("Init Error:", err);
  }
}

// --- Render Loop ---
function render(data) {
  const sidebarRoot = document.getElementById("sidebar");
  const contentRoot = document.getElementById("content");

  // Rendu Sidebar
  if (sidebarRoot) {
      renderSidebar(sidebarRoot, data, state);
      wireSidebar(data); 
  }

  // Rendu Contenu
  contentRoot.innerHTML = ""; 
  renderContent(contentRoot, data, state);

  // Boutons Nav
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.setAttribute("aria-current", btn.dataset.view === state.view ? "page" : "false");
  });
}

// --- Events Globaux ---
function wireEvents(data) {
  // Navigation
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      setState({ view: btn.dataset.view });
      render(data);
    });
  });

  // Modal
  document.querySelector(".modal .close").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if(e.target.id === "modalBackdrop") closeModal();
  });
  document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") closeModal();
  });

  // Clics sur les cartes (Documents, Events, People)
  document.getElementById("content").addEventListener("click", (e) => {
    handleOpenClick(e, data);
  });
  
  // Clics dans la modale (liens internes)
  document.querySelector(".modal").addEventListener("click", (e) => {
    handleOpenClick(e, data);
  });
}

function handleOpenClick(e, data){
    const docBtn = e.target.closest("[data-open-doc]");
    const evtBtn = e.target.closest("[data-open-event]");
    const pplBtn = e.target.closest("[data-open-person]");

    if(docBtn) openModal("doc", docBtn.dataset.openDoc, data);
    else if(evtBtn) openModal("event", evtBtn.dataset.openEvent, data);
    else if(pplBtn) openModal("person", pplBtn.dataset.openPerson, data);
}

// --- Events Sidebar ---
function wireSidebar(data) {
  // Recherche
  const qInput = document.getElementById("q");
  if(qInput){
      qInput.addEventListener("input", (e) => {
        setState({ query: e.target.value });
        render(data); 
        const newInp = document.getElementById("q");
        if(newInp) {
            newInp.focus();
            newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      });
  }

  // Chips (Tags & Types)
  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.chip;
      if(btn.classList.contains("chip-type")) {
         const newTypes = new Set(state.activeTypes);
         if(newTypes.has(tag)) newTypes.delete(tag);
         else newTypes.add(tag);
         setState({ activeTypes: newTypes });
      } else {
         const newTags = new Set(state.activeTags);
         if(newTags.has(tag)) newTags.delete(tag);
         else newTags.add(tag);
         setState({ activeTags: newTags });
      }
      render(data);
    });
  });

  // Select Personne
  const pSelect = document.getElementById("person");
  if(pSelect){
      pSelect.addEventListener("change", (e) => {
        setState({ activePerson: e.target.value });
        render(data);
      });
  }
  
  // Select Tri
  const sSelect = document.getElementById("sortDir");
  if(sSelect){
      sSelect.addEventListener("change", (e) => {
        setState({ sortDir: e.target.value });
        render(data);
      });
  }
}

// --- Modal ---
function openModal(kind, id, data) {
  const backdrop = document.getElementById("modalBackdrop");
  renderModal(document.getElementById("modal"), { kind, id }, data);
  backdrop.classList.add("open");
}

function closeModal() {
  document.getElementById("modalBackdrop").classList.remove("open");
}

init();