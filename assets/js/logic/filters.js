import { contains, dateSortKey, getRelatedDocuments, itemMentionsPerson } from "../utils.js";

// Vérifie si un item correspond à la recherche textuelle
export function matchByQuery(item, q, data) {
  if (!q) return true;
  
  const parts = [
    item.title, 
    item.summary, 
    item.type,
    item.name,
    item.role,
    ...(item.tags || [])
  ].filter(Boolean);

  const peopleNames = (item.people || [])
    .map(id => (data.entities?.people || []).find(p => p.id === id)?.name)
    .filter(Boolean);
  parts.push(...peopleNames);

  if (item.transcription) parts.push(item.transcription);

  getRelatedDocuments(item, data).forEach(doc => {
    parts.push(doc.title, doc.summary, doc.type, doc.transcription, ...(doc.tags || []));
    (doc.people || []).forEach(id => {
      const personName = (data.entities?.people || []).find(p => p.id === id)?.name;
      if (personName) parts.push(personName);
    });
  });

  return parts.some(p => contains(p, q));
}

// Filtre par Personne
export function matchByPerson(item, personId, data) {
  return itemMentionsPerson(item, personId, data);
}

// Filtre par Tags avec propagation via les preuves liées
export function matchByTags(item, activeTags, data) {
  if (activeTags.size === 0) return true;

  const tags = new Set(item.tags || []);
  getRelatedDocuments(item, data).forEach(doc => {
    (doc.tags || []).forEach(tag => tags.add(tag));
  });

  for (const t of activeTags) {
    if (tags.has(t)) return true;
  }
  return false;
}

// Filtre par Types avec propagation via les preuves liées
export function matchByTypes(item, activeTypes, data) {
  if (activeTypes.size === 0) return true;
  if (item.type && activeTypes.has(item.type)) return true;
  return getRelatedDocuments(item, data).some(doc => activeTypes.has(doc.type));
}

// Fonction utilitaire pour trier les données par date
export function sortItems(items, sortDir) {
  return items.sort((a, b) => {
    const ad = dateSortKey(a.date);
    const bd = dateSortKey(b.date);
    return sortDir === "asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });
}
