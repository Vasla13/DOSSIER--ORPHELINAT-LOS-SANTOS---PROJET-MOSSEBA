/* assets/js/views/graph.js */
import { fmtDate } from "../utils.js";
import { matchByQuery, matchByTags, matchByTypes } from "../logic/filters.js";

export function renderGraph(root, data, state) {
    // Vérification de sécurité
    if (!window.d3) {
        root.innerHTML = "<div class='kpi' style='color:#f85149'>Erreur : La librairie D3.js n'est pas chargée.</div>";
        return;
    }

    // 1. INJECTION DE LA STRUCTURE HTML (Conteneur + Légende Flottante)
    root.innerHTML = `
      <div id="graph-container"></div>
      
      <div id="graph-legend">
        <div class="legend-item">
            <div class="legend-dot" style="background:#58a6ff; box-shadow:0 0 8px #58a6ff;"></div> 
            <span>Sujet (Personne)</span>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background:#f85149; box-shadow:0 0 8px #f85149;"></div> 
            <span>Événement</span>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background:#2ea043; box-shadow:0 0 8px #2ea043;"></div> 
            <span>Preuve (Document)</span>
        </div>
        
        <div style="margin-top:15px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1); font-size:10px; color:#8b949e; line-height:1.6">
            <div style="display:flex; justify-content:space-between;"><span>ZOOM</span> <span>Molette</span></div>
            <div style="display:flex; justify-content:space-between;"><span>MOVE</span> <span>Drag</span></div>
            <div style="display:flex; justify-content:space-between;"><span>OPEN</span> <span>Clic</span></div>
        </div>
      </div>
    `;
    
    const container = document.getElementById("graph-container");
    // Dimensions du conteneur (fallback si non rendu)
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 800; 

    // 2. PRÉPARATION DES DONNÉES (FILTRAGE & CRÉATION DES NOEUDS)
    const nodes = [];
    const links = [];
    const nodeSet = new Set(); // Set pour éviter les doublons d'IDs

    // --- A. Personnes (Bleu) ---
    // On prend toutes les personnes qui correspondent à la recherche textuelle
    const people = (data.entities?.people || []).filter(p => matchByQuery(p, state.query, data));
    people.forEach(p => {
        nodes.push({ 
            id: p.id, 
            name: p.name, 
            type: "person", 
            r: 25, // Rayon un peu plus grand pour les personnes
            color: "#58a6ff" 
        });
        nodeSet.add(p.id);
    });

    // --- B. Documents (Vert) ---
    const docs = data.documents.filter(d => 
        matchByTags(d, state.activeTags) && 
        matchByTypes(d, state.activeTypes) &&
        matchByQuery(d, state.query, data)
    );
    docs.forEach(d => {
        // On n'affiche le document que s'il est lié à une personne affichée OU si aucun filtre "personne" n'est actif
        const relatedPeople = (d.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(d.id)) {
            // Titre tronqué pour ne pas surcharger le graphe
            const label = d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title;
            
            nodes.push({ 
                id: d.id, 
                name: label, 
                type: "doc", 
                r: 15, 
                color: "#2ea043" 
            });
            nodeSet.add(d.id);
            
            // Création des liens Doc <-> Personnes
            (d.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: d.id });
            });
        }
    });

    // --- C. Événements (Rouge) ---
    const events = data.events.filter(e => 
        matchByTags(e, state.activeTags) && 
        matchByQuery(e, state.query, data)
    );
    events.forEach(e => {
        const relatedPeople = (e.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(e.id)) {
            nodes.push({ 
                id: e.id, 
                name: fmtDate(e.date), // On affiche la date comme nom
                type: "event", 
                r: 18, 
                color: "#f85149" 
            });
            nodeSet.add(e.id);

            // Liens Event <-> Personnes
            (e.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: e.id });
            });

            // Liens Event <-> Documents (Preuves)
            (e.related_docs || []).forEach(did => {
                if(nodeSet.has(did)) links.push({ source: e.id, target: did });
            });
        }
    });

    // Si aucune donnée ne correspond, on affiche un message
    if(nodes.length === 0) {
        root.innerHTML += "<div class='kpi' style='margin-top:20%; opacity:0.5'>Aucune donnée relationnelle visible.</div>";
        return;
    }

    // 3. MOTEUR DE SIMULATION PHYSIQUE (D3 FORCE)
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100)) // Longueur des liens
        .force("charge", d3.forceManyBody().strength(-300)) // Répulsion entre les noeuds
        .force("center", d3.forceCenter(width / 2, height / 2)) // Attraction vers le centre
        .force("collide", d3.forceCollide().radius(d => d.r + 10).iterations(2)); // Anti-collision

    // 4. RENDU SVG
    const svg = d3.select("#graph-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height])
        .style("cursor", "grab");

    // Groupe principal (qui sera zoomé/déplacé)
    const g = svg.append("g");

    // Gestion du Zoom
    const zoomBehavior = d3.zoom()
        .scaleExtent([0.1, 4]) // Zoom min / max
        .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoomBehavior);

    // Dessin des Liens (Lignes)
    const link = g.append("g")
        .attr("stroke", "#30363d")
        .attr("stroke-opacity", 0.4)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1.5);

    // Dessin des Noeuds (Groupes Circle + Text)
    const node = g.append("g")
        .selectAll(".node")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragStart)
            .on("drag", dragging)
            .on("end", dragEnd));

    // Le cercle du noeud
    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", "#0d1117") // Fond noir pour masquer les lignes derrière
        .attr("stroke", d => d.color)
        .attr("stroke-width", 2)
        .style("transition", "all 0.3s");

    // L'étiquette (Texte)
    node.append("text")
        .attr("x", d => d.r + 8)
        .attr("y", 5)
        .text(d => d.name)
        .style("font-family", "var(--font-mono)")
        .style("font-size", "11px")
        .style("fill", "#c9d1d9")
        .style("pointer-events", "none") // Le texte ne bloque pas la souris
        .style("text-shadow", "0 2px 4px #000"); // Ombre pour lisibilité

    // 5. GESTION DES INTERACTIONS

    // Helper pour savoir si deux noeuds sont connectés
    const linkedByIndex = {};
    links.forEach(d => {
        linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
        linkedByIndex[`${d.target.id},${d.source.id}`] = 1;
    });
    function isConnected(a, b) {
        return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    }

    // Hover : Mise en évidence des voisins
    node.on("mouseover", (event, d) => {
        // On réduit l'opacité de tout ce qui n'est PAS connecté
        node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
        link.style("stroke-opacity", o => (o.source === d || o.target === d ? 1 : 0.05));
        link.style("stroke", o => (o.source === d || o.target === d ? d.color : "#30363d"));
    }).on("mouseout", () => {
        // Retour à la normale
        node.style("opacity", 1);
        link.style("stroke-opacity", 0.4);
        link.style("stroke", "#30363d");
    });

    // Clic : Ouverture de la modale
    node.on("click", (event, d) => {
        event.stopPropagation(); // Empêche le drag de démarrer si on clique juste
        triggerOpen(d.type, d.id, root);
    });

    // 6. BOUCLE D'ANIMATION (TICK)
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Fonctions de Drag & Drop D3
    function dragStart(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart(); // Réchauffe la simulation
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        d3.select(this).style("cursor", "grabbing");
    }

    function dragging(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnd(event) {
        if (!event.active) simulation.alphaTarget(0); // Refroidit la simulation
        event.subject.fx = null;
        event.subject.fy = null;
        d3.select(this).style("cursor", "pointer");
    }
}

// Petit helper pour tronquer les textes longs
function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n-1) + "..." : str;
}

// Astuce pour déclencher l'ouverture de la modale via l'écouteur global dans app.js
function triggerOpen(type, id, root) {
    const btn = document.createElement("button");
    if(type === "doc") btn.dataset.openDoc = id;
    if(type === "person") btn.dataset.openPerson = id;
    if(type === "event") btn.dataset.openEvent = id;
    
    // On ajoute le bouton invisible au DOM, on clique, on l'enlève
    root.appendChild(btn); 
    btn.click(); 
    root.removeChild(btn);
}