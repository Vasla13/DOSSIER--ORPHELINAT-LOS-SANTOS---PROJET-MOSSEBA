import { state, setState, initFilters } from "./state.js";
import { parseData } from "./utils.js";

import { renderSidebar } from "./views/sidebar.js";
import { renderOverview } from "./views/overview.js";
import { renderTimeline } from "./views/timeline.js";
import { renderDocuments, renderPeople } from "./views/cards.js";
import { renderGraph, teardownGraph } from "./views/graph.js";
import { renderModal } from "./views/modal.js";

async function init() {
  try {
    let rawData = null;
    if (window.TIMELINE_DATA) {
      rawData = window.TIMELINE_DATA;
    } else if (typeof timelineData !== "undefined") {
      rawData = timelineData;
    }

    if (!rawData) {
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

function renderContent(root, data, currentState) {
  switch (currentState.view) {
    case "overview":
      return renderOverview(root, data, currentState);
    case "documents":
      return renderDocuments(root, data, currentState);
    case "people":
      return renderPeople(root, data, currentState);
    case "graph":
      return renderGraph(root, data, currentState);
    default:
      return renderTimeline(root, data, currentState);
  }
}

function render(data) {
  const sidebarRoot = document.getElementById("sidebar");
  if (sidebarRoot) {
    renderSidebar(sidebarRoot, data, state);
    wireSidebarEvents(data);
  }

  const contentRoot = document.getElementById("content");
  if (state.view !== "graph") {
    teardownGraph();
  }
  contentRoot.innerHTML = "";
  contentRoot.classList.toggle("graph-mode", state.view === "graph");
  renderContent(contentRoot, data, state);

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.setAttribute("aria-current", btn.dataset.view === state.view ? "page" : "false");
  });

  syncShellState();
}

function wireEvents(data) {
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      setState({ view: btn.dataset.view, mobileFiltersOpen: false });
      render(data);
    });
  });

  const filtersToggle = document.getElementById("mobileFiltersToggle");
  if (filtersToggle) {
    filtersToggle.addEventListener("click", () => {
      setState({ mobileFiltersOpen: !state.mobileFiltersOpen });
      syncShellState();
    });
  }

  const mobileBackdrop = document.getElementById("mobileSidebarBackdrop");
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", () => {
      closeMobileFilters();
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && state.mobileFiltersOpen) {
      closeMobileFilters();
    }
  });

  document.addEventListener("click", (e) => {
    const docBtn = e.target.closest("[data-open-doc]");
    const evtBtn = e.target.closest("[data-open-event]");
    const pplBtn = e.target.closest("[data-open-person]");

    const closeBtn = e.target.closest(".close");
    const backdrop = e.target.id === "modalBackdrop";

    if (docBtn) {
      e.preventDefault();
      openModal("doc", docBtn.dataset.openDoc, data);
    } else if (evtBtn) {
      e.preventDefault();
      openModal("event", evtBtn.dataset.openEvent, data);
    } else if (pplBtn) {
      e.preventDefault();
      openModal("person", pplBtn.dataset.openPerson, data);
    } else if (closeBtn || backdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMobileFilters();
    }
  });
}

function wireSidebarEvents(data) {
  const qInput = document.getElementById("q");
  if (qInput) {
    qInput.addEventListener("input", (e) => {
      setState({ query: e.target.value });
      render(data);
      const nextInput = document.getElementById("q");
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
      }
    });
  }

  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.chip;
      const nextShellState = window.innerWidth <= 900 ? { mobileFiltersOpen: false } : {};

      if (btn.classList.contains("chip-type")) {
        const nextTypes = new Set(state.activeTypes);
        if (nextTypes.has(tag)) nextTypes.delete(tag);
        else nextTypes.add(tag);
        setState({ activeTypes: nextTypes, ...nextShellState });
      } else {
        const nextTags = new Set(state.activeTags);
        if (nextTags.has(tag)) nextTags.delete(tag);
        else nextTags.add(tag);
        setState({ activeTags: nextTags, ...nextShellState });
      }

      render(data);
    });
  });

  const personSelect = document.getElementById("person");
  if (personSelect) {
    personSelect.addEventListener("change", (e) => {
      setState({
        activePerson: e.target.value,
        mobileFiltersOpen: window.innerWidth <= 900 ? false : state.mobileFiltersOpen
      });
      render(data);
    });
  }

  const sortSelect = document.getElementById("sortDir");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      setState({
        sortDir: e.target.value,
        mobileFiltersOpen: window.innerWidth <= 900 ? false : state.mobileFiltersOpen
      });
      render(data);
    });
  }

  const closeSidebarBtn = document.getElementById("closeSidebar");
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      closeMobileFilters();
    });
  }
}

function syncShellState() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("mobileSidebarBackdrop");
  const toggle = document.getElementById("mobileFiltersToggle");
  const mobileOpen = state.mobileFiltersOpen && window.innerWidth <= 900;

  if (sidebar) {
    sidebar.classList.toggle("mobile-open", mobileOpen);
  }

  if (backdrop) {
    backdrop.classList.toggle("open", mobileOpen);
  }

  if (toggle) {
    toggle.setAttribute("aria-expanded", mobileOpen ? "true" : "false");
  }
}

function closeMobileFilters() {
  if (!state.mobileFiltersOpen) return;
  setState({ mobileFiltersOpen: false });
  syncShellState();
}

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
