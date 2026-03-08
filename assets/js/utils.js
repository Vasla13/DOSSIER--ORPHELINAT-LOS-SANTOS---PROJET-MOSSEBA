const MONTHS_FR = [
  "janv.",
  "fevr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "aout",
  "sept.",
  "oct.",
  "nov.",
  "dec."
];

export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function parseIsoDate(iso) {
  if (!iso) return null;

  const match = String(iso).match(/^(\d{4})(?:-(\d{2})-(\d{2}))?$/);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: match[2] ? Number(match[2]) : null,
    day: match[3] ? Number(match[3]) : null
  };
}

export function fmtDate(iso) {
  if (!iso) return "Date inconnue";
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  if (!parsed.month || !parsed.day) return String(parsed.year);
  return `${String(parsed.day).padStart(2, "0")} ${MONTHS_FR[parsed.month - 1]} ${parsed.year}`;
}

export function fmtDayMonth(iso) {
  const parsed = parseIsoDate(iso);
  if (!parsed || !parsed.month || !parsed.day) return "--/--";
  return `${String(parsed.day).padStart(2, "0")}/${String(parsed.month).padStart(2, "0")}`;
}

export function yearOf(iso) {
  const parsed = parseIsoDate(iso);
  return parsed ? parsed.year : null;
}

export function uniq(arr) {
  return [...new Set(arr)];
}

export function contains(haystack, needle) {
  return String(haystack || "").toLowerCase().includes(String(needle || "").toLowerCase());
}

export function dateSortKey(iso) {
  const parsed = parseIsoDate(iso);
  if (!parsed) return "0000-00-00";

  return [
    String(parsed.year).padStart(4, "0"),
    String(parsed.month || 0).padStart(2, "0"),
    String(parsed.day || 0).padStart(2, "0")
  ].join("-");
}

export function getDocumentsByIds(docIds = [], data) {
  if (!data?.documents?.length || docIds.length === 0) return [];
  const idSet = new Set(docIds);
  return data.documents.filter(doc => idSet.has(doc.id));
}

export function getRelatedDocuments(item, data) {
  if (!item || !data) return [];

  if ((data.documents || []).some(doc => doc.id === item.id)) {
    return [item];
  }

  if (Array.isArray(item.related_docs)) {
    return getDocumentsByIds(item.related_docs, data);
  }

  if ((data.entities?.people || []).some(person => person.id === item.id)) {
    return data.documents.filter(doc => (doc.people || []).includes(item.id));
  }

  return [];
}

export function getPersonIdsForItem(item, data) {
  const ids = new Set(item?.people || []);

  if ((data?.entities?.people || []).some(person => person.id === item?.id)) {
    ids.add(item.id);
  }

  getRelatedDocuments(item, data).forEach(doc => {
    (doc.people || []).forEach(personId => ids.add(personId));
  });

  return [...ids];
}

export function itemMentionsPerson(item, personId, data) {
  if (!personId) return true;
  if (item?.id === personId) return true;
  return getPersonIdsForItem(item, data).includes(personId);
}

export function getDocumentsForPerson(personId, data) {
  if (!personId || !data?.documents?.length) return [];
  return data.documents.filter(doc => (doc.people || []).includes(personId));
}

export function getEventsForPerson(personId, data) {
  if (!personId || !data?.events?.length) return [];
  return data.events.filter(event => itemMentionsPerson(event, personId, data));
}

export function getThumbnailSrc(src) {
  if (!src) return "";

  const normalized = String(src).replaceAll("\\", "/");
  if (!normalized.includes("/img/")) return normalized;

  return normalized
    .replace("/img/", "/img/thumbs/")
    .replace(/\.[^.]+$/, ".jpg");
}

export function parseData(source) {
  if (!source) {
    return {
      meta: {},
      entities: { people: [], orgs: [], places: [] },
      documents: [],
      events: []
    };
  }

  return {
    meta: source.meta || {},
    entities: {
      people: source.entities?.people || [],
      orgs: source.entities?.orgs || [],
      places: source.entities?.places || []
    },
    documents: source.documents || [],
    events: source.events || []
  };
}
