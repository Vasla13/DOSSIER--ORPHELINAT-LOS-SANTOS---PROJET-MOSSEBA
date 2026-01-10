import { contains } from "../utils.js";

// Vérifie si un item correspond à la recherche textuelle
export function matchByQuery(item, q, data) {
  if (!q) return true;
  
  // On construit une chaîne avec tout le contenu pertinent de l'item
  const parts = [
    item.title, 
    item.summary, 
    item.type,
    ...(item.tags || [])
  ].filter(Boolean);

  // On ajoute les noms des personnes liées (résolution des IDs)
  const peopleNames = (item.people || [])
    .map(id => (data.entities?.people || []).find(p => p.id === id)?.name)
    .filter(Boolean);
  parts.push(...peopleNames);

  if (item.transcription) parts.push(item.transcription);

  return parts.some(p => contains(p, q));
}

// Filtre par Personne
export function matchByPerson(item, personId) {
  if (!personId) return true;
  return (item.people || []).includes(personId);
}

// Filtre par Tags (ET logique : doit contenir l'un des tags actifs ?) 
// Note: Ton code original faisait un "OU" (si item a un des tags actifs -> ok). Je garde cette logique.
export function matchByTags(item, activeTags) {
  if (activeTags.size === 0) return true;
  const tags = item.tags || [];
  for (const t of activeTags) {
    if (tags.includes(t)) return true;
  }
  return false;
}

// Filtre par Types
export function matchByTypes(doc, activeTypes) {
  if (activeTypes.size === 0) return true;
  return activeTypes.has(doc.type);
}

// Fonction utilitaire pour trier les données par date
export function sortItems(items, sortDir) {
  return items.sort((a, b) => {
    const ad = a.date || "0000-01-01";
    const bd = b.date || "0000-01-01";
    return sortDir === "asc" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });
}