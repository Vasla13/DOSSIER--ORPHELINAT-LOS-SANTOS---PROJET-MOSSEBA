import { fmtDate } from "../utils.js";
import { matchByQuery, matchByTags, matchByTypes } from "../logic/filters.js";

export function renderGraph(root, data, state) {
    if (!window.d3) {
        root.innerHTML = "<div class='kpi' style='color:red'>Erreur : D3.js non chargé.</div>";
        return;
    }

    // Légende HTML
    root.innerHTML = `
      <div id="graph-legend">
        <div><span style="background:#58a6ff"></span> Sujet</div>
        <div><span style="background:#f85149"></span> Événement</div>
        <div><span style="background:#238636"></span> Preuve</div>
      </div>
      <div id="graph-container"></div>
    `;
    
    const container = document.getElementById("graph-container");
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600; 

    // --- PRÉPARATION DES DONNÉES (NOEUDS & LIENS) ---
    const nodes = [];
    const links = [];
    const nodeSet = new Set(); // Pour éviter les doublons

    // A. AJOUTER LES PERSONNES (BLEU)
    const people = (data.entities?.people || []).filter(p => matchByQuery(p, state.query, data));
    people.forEach(p => {
        nodes.push({ id: p.id, name: p.name, type: "person", r: 20, color: "#58a6ff" });
        nodeSet.add(p.id);
    });

    // B. AJOUTER LES DOCUMENTS (VERT)
    const docs = data.documents.filter(d => 
        matchByTags(d, state.activeTags) && 
        matchByTypes(d, state.activeTypes) &&
        matchByQuery(d, state.query, data)
    );
    docs.forEach(d => {
        const relatedPeople = (d.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(d.id)) {
            nodes.push({ id: d.id, name: truncate(d.title), type: "doc", r: 12, color: "#238636" });
            nodeSet.add(d.id);
            
            (d.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: d.id });
            });
        }
    });

    // C. AJOUTER LES ÉVÉNEMENTS (ROUGE)
    const events = data.events.filter(e => 
        matchByTags(e, state.activeTags) && 
        matchByQuery(e, state.query, data)
    );
    events.forEach(e => {
        const relatedPeople = (e.people || []).filter(pid => nodeSet.has(pid));
        const shouldAdd = state.activePerson === "" || relatedPeople.length > 0;

        if (shouldAdd && !nodeSet.has(e.id)) {
            nodes.push({ id: e.id, name: fmtDate(e.date), type: "event", r: 15, color: "#f85149" });
            nodeSet.add(e.id);

            (e.people || []).forEach(pid => {
                if(nodeSet.has(pid)) links.push({ source: pid, target: e.id });
            });

            (e.related_docs || []).forEach(did => {
                if(nodeSet.has(did)) links.push({ source: e.id, target: did });
            });
        }
    });

    if(nodes.length === 0) {
        root.innerHTML += "<div class='kpi'>Aucune donnée relationnelle à afficher avec ces filtres.</div>";
        return;
    }

    // --- RENDU D3 ---
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(80))
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.r + 5));

    const svg = d3.select("#graph-container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", (e) => g.attr("transform", e.transform)));

    const link = g.append("g")
        .attr("stroke", "#30363d").attr("stroke-opacity", 0.6)
        .selectAll("line").data(links).join("line").attr("stroke-width", 1.5);

    const node = g.append("g")
        .selectAll(".node").data(nodes).join("g")
        .attr("class", "node")
        .call(d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd));

    node.append("circle")
        .attr("r", d => d.r).attr("fill", d => d.color)
        .attr("stroke", "#0d1117").attr("stroke-width", 2);

    node.append("text")
        .attr("x", d => d.r + 5).attr("y", 4)
        .text(d => d.name)
        .style("font-family", "var(--font-mono)").style("font-size", "10px").style("fill", "#c9d1d9")
        .style("pointer-events", "none").style("text-shadow", "0 1px 2px #000");

    // --- INTERACTIONS ---
    const linkedByIndex = {};
    links.forEach(d => {
        linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
        linkedByIndex[`${d.target.id},${d.source.id}`] = 1;
    });
    function isConnected(a, b) { return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id; }

    node.on("mouseover", (e, d) => {
        node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
        link.style("stroke-opacity", o => (o.source === d || o.target === d ? 1 : 0.05));
    }).on("mouseout", () => {
        node.style("opacity", 1);
        link.style("stroke-opacity", 0.6);
    });

    node.on("click", (e, d) => {
        e.stopPropagation();
        triggerOpen(d.type, d.id, root);
    });

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragStart(e) { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; }
    function dragging(e) { e.subject.fx = e.x; e.subject.fy = e.y; }
    function dragEnd(e) { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; }
}

function truncate(str) { return str.length > 15 ? str.substring(0, 15) + "..." : str; }

// Helper pour simuler un clic sur un lien data-open-*
function triggerOpen(type, id, root) {
    const btn = document.createElement("button");
    if(type === "doc") btn.dataset.openDoc = id;
    if(type === "person") btn.dataset.openPerson = id;
    if(type === "event") btn.dataset.openEvent = id;
    root.appendChild(btn); btn.click(); root.removeChild(btn);
}