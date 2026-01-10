import { uniq } from "./utils.js";

export function initState(data){
  const allTags = uniq([
    ...data.events.flatMap(e => e.tags || []),
    ...data.documents.flatMap(d => d.tags || [])
  ]).sort((a,b)=>a.localeCompare(b,"fr"));

  const allTypes = uniq([
    ...data.documents.map(d => d.type).filter(Boolean)
  ]).sort((a,b)=>a.localeCompare(b,"fr"));

  const allPeople = (data.entities?.people || []).slice().sort((a,b)=>a.name.localeCompare(b.name,"fr"));

  return {
    view: "timeline",      // timeline | documents | people
    query: "",
    activeTags: new Set(),
    activeTypes: new Set(),
    activePerson: null,
    sortDir: "asc",
    allTags,
    allTypes,
    allPeople
  };
}
