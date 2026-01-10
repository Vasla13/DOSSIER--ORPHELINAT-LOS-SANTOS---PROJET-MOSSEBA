# DOSSIER MOSSEBA — Site (structure)

## Lancer
Ouvre `index.html` dans un navigateur (double-clic).
Si ton navigateur bloque certains chargements en local, lance un petit serveur:

- Python:
  - `python -m http.server 8000`
  - puis ouvre `http://localhost:8000`

## Structure
- `index.html` : page principale
- `data/timeline.js` : TOUTES les infos (données)
- `assets/js/*` : rendu + filtres + modal
- `assets/css/style.css` : style
- `assets/img/*` : toutes les images (renommées en safe names)

## Modifier la timeline
Édite `data/timeline.js` :
- `documents[]` : preuves (images + transcription + extraction)
- `events[]` : événements (date, titre, résumé, docs liés)
