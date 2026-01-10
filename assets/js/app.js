import { initState } from "./state.js";
import { renderSidebar, renderContent, renderModal } from "./renderers.js";

function getData(){
  const d = window.TIMELINE_DATA;
  if(!d){
    throw new Error("TIMELINE_DATA introuvable. Vérifie que data/timeline.js est bien chargé avant app.js.");
  }
  // Normalize minimal fields
  d.events = d.events || [];
  d.documents = d.documents || [];
  d.entities = d.entities || {people:[], orgs:[], places:[]};
  return d;
}

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function setView(state, view){
  state.view = view;
  // update nav buttons
  $all(".nav button").forEach(b=>{
    const v = b.dataset.view;
    b.setAttribute("aria-current", v===view ? "page" : "false");
  });
}

function openModal(payload, data){
  const backdrop = $("#modalBackdrop");
  const modal = $("#modal");
  modal.dataset.kind = payload.kind;
  modal.dataset.id = payload.id;
  renderModal(modal, payload, data);
  backdrop.classList.add("open");
  // focus close for accessibility
  $(".close", modal).focus();
}

function closeModal(){
  $("#modalBackdrop").classList.remove("open");
}

function wireSidebar(state, data){
  const sidebar = $("#sidebar");

  // Search
  $("#q", sidebar).addEventListener("input", (e)=>{
    state.query = e.target.value;
    rerender(state, data);
  });

  // Sort
  $("#sortDir", sidebar).addEventListener("change", (e)=>{
    state.sortDir = e.target.value;
    rerender(state, data);
  });

  // Tags
  $all("[data-chip]", sidebar).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const val = btn.dataset.chip;
      if(btn.classList.contains("chip-type")){
        if(state.activeTypes.has(val)) state.activeTypes.delete(val);
        else state.activeTypes.add(val);
      }else{
        if(state.activeTags.has(val)) state.activeTags.delete(val);
        else state.activeTags.add(val);
      }
      rerender(state, data);
    });
  });

  // Person dropdown
  $("#person", sidebar).addEventListener("change",(e)=>{
    state.activePerson = e.target.value || null;
    rerender(state, data);
  });
}

function wireContent(state, data){
  const content = $("#content");

  // open event/doc/person
  content.addEventListener("click",(e)=>{
    const t = e.target.closest("[data-open-event],[data-open-doc],[data-open-person]");
    if(!t) return;
    e.preventDefault();
    if(t.dataset.openEvent) openModal({kind:"event", id:t.dataset.openEvent}, data);
    if(t.dataset.openDoc) openModal({kind:"doc", id:t.dataset.openDoc}, data);
    if(t.dataset.openPerson) openModal({kind:"person", id:t.dataset.openPerson}, data);
  });
}

function wireModal(state, data){
  $("#modalBackdrop").addEventListener("click",(e)=>{
    if(e.target.id === "modalBackdrop") closeModal();
  });
  $("#modal .close").addEventListener("click", closeModal);

  // Allow clicking links inside modal to navigate to doc/event/person
  $("#modal").addEventListener("click",(e)=>{
    const t = e.target.closest("[data-open-event],[data-open-doc],[data-open-person]");
    if(!t) return;
    e.preventDefault();
    if(t.dataset.openEvent) openModal({kind:"event", id:t.dataset.openEvent}, data);
    if(t.dataset.openDoc) openModal({kind:"doc", id:t.dataset.openDoc}, data);
    if(t.dataset.openPerson) openModal({kind:"person", id:t.dataset.openPerson}, data);
  });

  // Esc closes
  window.addEventListener("keydown",(e)=>{
    if(e.key === "Escape") closeModal();
  });
}

function rerender(state, data){
  // Sidebar changes require rerendering sidebar (chips pressed) + content
  renderSidebar($("#sidebar"), data, state);
  wireSidebar(state, data);
  renderContent($("#content"), data, state);
}

function init(){
  const data = getData();
  const state = initState(data);

  // Nav
  $all(".nav button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setView(state, btn.dataset.view);
      rerender(state, data);
    });
  });

  // initial
  setView(state, "timeline");
  renderSidebar($("#sidebar"), data, state);
  wireSidebar(state, data);
  renderContent($("#content"), data, state);
  wireContent(state, data);
  wireModal(state, data);

  // hash routing (optional)
  window.addEventListener("hashchange", ()=>{
    const h = location.hash.replace("#","").trim();
    if(["timeline","documents","people"].includes(h)){
      setView(state, h);
      rerender(state, data);
    }
  });
  const h = location.hash.replace("#","").trim();
  if(["timeline","documents","people"].includes(h)){
    setView(state, h);
    rerender(state, data);
  }
}

init();
