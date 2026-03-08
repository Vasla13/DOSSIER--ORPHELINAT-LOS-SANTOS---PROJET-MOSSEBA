import { uniq } from "./utils.js";

// L'état global de l'application
export const state = {
  view: "timeline",      // overview | timeline | documents | people | graph
  query: "",
  activeTags: new Set(),
  activeTypes: new Set(),
  activePerson: "",      // ID de la personne sélectionnée
  sortDir: "asc",        // asc | desc
  mobileFiltersOpen: false,
  
  // Listes pour les menus déroulants (remplies via initFilters)
  allTags: [],
  allTypes: [],
  allPeople: []
};

// Fonction simple pour mettre à jour l'état
export function setState(changes) {
  Object.assign(state, changes);
}

// Fonction pour initialiser les filtres (tags, types...) à partir des données chargées
export function initFilters(data) {
  state.allTags = uniq([
    ...data.events.flatMap(e => e.tags || []),
    ...data.documents.flatMap(d => d.tags || [])
  ]).sort((a,b)=>a.localeCompare(b,"fr"));

  state.allTypes = uniq([
    ...data.documents.map(d => d.type).filter(Boolean)
  ]).sort((a,b)=>a.localeCompare(b,"fr"));

  state.allPeople = (data.entities?.people || []).slice().sort((a,b)=>a.name.localeCompare(b.name,"fr"));
}
