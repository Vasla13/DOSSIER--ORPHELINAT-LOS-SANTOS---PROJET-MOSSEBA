import { state, setState, initFilters } from "./state.js";
import { parseData } from "./utils.js";

// Imports des modules découpés
import { renderSidebar } from "./views/sidebar.js";
import { renderTimeline } from "./views/timeline.js";
import { renderDocuments, renderPeople } from "./views/cards.js";
import { renderGraph } from "./views/graph.js";
import { renderModal } from "./views/modal.js";

async function init() {
  try {
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
    initFilters(data); 
    render(data);
    wireEvents(data);

  } catch (err) {
    console.error("Init Error:", err);
  }
}

// Routeur d'affichage simple
function renderContent(root, data, state) {
    switch(state.view) {
        case "documents": return renderDocuments(root, data, state);
        case "people": return renderPeople(root, data, state);
        case "graph": return renderGraph(root, data, state);
        default: return renderTimeline(root, data, state);
    }
}

// Fonction de rendu principal
function render(data) {
  const sidebarRoot = document.getElementById("sidebar");
  if (sidebarRoot) {
      renderSidebar(sidebarRoot, data, state);
      // On ré-attache les événements de la sidebar à chaque rendu car le HTML est régénéré
      wireSidebarEvents(data);
  }

  const contentRoot = document.getElementById("content");
  contentRoot.innerHTML = ""; 
  renderContent(contentRoot, data, state);

  // Mise à jour visuelle des onglets de navigation
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.setAttribute("aria-current", btn.dataset.view === state.view ? "page" : "false");
  });
}

// Gestionnaires d'événements globaux (Navigation, Modale, Clics)
function wireEvents(data) {
  // Navigation (Top bar)
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      setState({ view: btn.dataset.view });
      render(data);
    });
  });

  // Délégation d'événements pour les clics "Ouvrir..." (Cards, Timeline rows, Graph nodes)
  // Cela permet de gérer les éléments créés dynamiquement sans rattacher d'écouteurs partout
  document.addEventListener("click", (e) => {
      const docBtn = e.target.closest("[data-open-doc]");
      const evtBtn = e.target.closest("[data-open-event]");
      const pplBtn = e.target.closest("[data-open-person]");
      
      // Gestion fermeture modale
      const closeBtn = e.target.closest(".close");
      const backdrop = e.target.id === "modalBackdrop";

      if(docBtn) {
          e.preventDefault();
          openModal("doc", docBtn.dataset.openDoc, data);
      }
      else if(evtBtn) {
          e.preventDefault();
          openModal("event", evtBtn.dataset.openEvent, data);
      }
      else if(pplBtn) {
          e.preventDefault();
          openModal("person", pplBtn.dataset.openPerson, data);
      }
      else if(closeBtn || backdrop) {
          closeModal();
      }
  });

  // Touche Echap pour fermer la modale
  document.addEventListener("keydown", (e) => {
      if(e.key === "Escape") closeModal();
  });
}

// Gestionnaires spécifiques à la Sidebar (Inputs générés dynamiquement)
function wireSidebarEvents(data) {
    // Recherche
    const qInput = document.getElementById("q");
    if(qInput) {
        qInput.addEventListener("input", (e) => {
            setState({ query: e.target.value });
            render(data);
            // On remet le focus car le render() a recréé l'input
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

// Fonctions Modale
function openModal(kind, id, data) {
  const backdrop = document.getElementById("modalBackdrop");
  const modal = document.getElementById("modal");
  renderModal(modal, { kind, id }, data);
  backdrop.classList.add("open");
}

function closeModal() {
  document.getElementById("modalBackdrop").classList.remove("open");
}

init();