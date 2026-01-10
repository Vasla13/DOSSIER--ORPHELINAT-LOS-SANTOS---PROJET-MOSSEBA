import { fmtDate } from "../utils.js";
import { matchByQuery, matchByTags, matchByTypes } from "../logic/filters.js";

export function renderGraph(root, data, state) {
    if (!window.d3) {
        root.innerHTML = "<div class='kpi' style='color:#f85149'>Erreur : D3.js non chargé.</div>";
        return;
    }

    // 1. INJECTION DE LA STRUCTURE
    // Note: On met la légende DANS le container pour qu'elle soit bien positionnée en bas à droite
    root.innerHTML = `
      <div id="graph-wrapper" style="position:relative; width:100%; height:100%;">
          <div id="graph-container"></div>
          
          <div id="graph-legend">
            <div class="legend-item" style="color:#58a6ff"><div class="legend-dot" style="background:#58a6ff"></div> Sujet</div>
            <div class="legend-item" style="color:#f85149"><div class="legend-dot" style="background:#f85149"></div> Événement</div>
            <div class="legend-item" style="color:#2ea043"><div class="legend-dot" style="background:#2ea043"></div> Preuve</div>
            <div style="margin-top:10px; border-top:1px solid #333; padding-top:5px; opacity:0.5; font-size:9px">
                SCROLL: Zoom • DRAG: Bouger
            </div>
          </div>
      </div>
    `;
    
    const container = document.getElementById("graph-container");
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 800; 

    // 2. DONNÉES
    const nodes = [];
    const links = [];
    const nodeSet = new Set();

    // -- Personnes (Bleu) --
    const people = (data.entities?.people || []).filter(p => matchByQuery(p, state.query, data));
    people.forEach(p => {
        nodes.push({ id: p.id, name: p.name, type: "person", r: 25, color: "#58a6ff" });
        nodeSet.add(p.id);
    });

    // -- Documents (Vert) --
    const docs = data.documents.filter(d => 
        matchByTags(d, state.activeTags) && matchByTypes(d, state.activeTypes) && matchByQuery(d, state.query, data)
    );
    docs.forEach(d => {
        const related = (d.people||[]).filter(pid => nodeSet.has(pid));
        if (state.activePerson === "" || related.length > 0) {
            if (!nodeSet.has(d.id)) {
                nodes.push({ 
                    id: d.id, 
                    name: d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title, 
                    type: "doc", r: 15, color: "#2ea043" 
                });
                nodeSet.add(d.id);
                (d.people||[]).forEach(pid => { if(nodeSet.has(pid)) links.push({ source: pid, target: d.id }); });
            }
        }
    });

    // -- Événements (Rouge) --
    const events = data.events.filter(e => matchByTags(e, state.activeTags) && matchByQuery(e, state.query, data));
    events.forEach(e => {
        const related = (e.people||[]).filter(pid => nodeSet.has(pid));
        if (state.activePerson === "" || related.length > 0) {
            if (!nodeSet.has(e.id)) {
                nodes.push({ id: e.id, name: fmtDate(e.date), type: "event", r: 18, color: "#f85149" });
                nodeSet.add(e.id);
                (e.people||[]).forEach(pid => { if(nodeSet.has(pid)) links.push({ source: pid, target: e.id }); });
                (e.related_docs||[]).forEach(did => { if(nodeSet.has(did)) links.push({ source: e.id, target: did }); });
            }
        }
    });

    if(nodes.length === 0) {
        container.innerHTML = "<div class='kpi' style='margin-top:20%; opacity:0.5'>Aucune donnée.</div>";
        return;
    }

    // 3. MOTEUR D3
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.r + 10));

    const svg = d3.select("#graph-container").append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    // Zoom
    svg.call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", (e) => g.attr("transform", e.transform)));

    // Liens
    const link = g.append("g").selectAll("line")
        .data(links).join("line")
        .attr("stroke", "#30363d").attr("stroke-opacity", 0.5).attr("stroke-width", 1);

    // Noeuds
    const node = g.append("g").selectAll(".node")
        .data(nodes).join("g").attr("class", "node")
        .call(d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd));

    // CERCLES (Avec remplissage transparent pour effet couleur)
    node.append("circle")
        .attr("r", d => d.r)
        .attr("stroke", d => d.color) // La couleur vive sur le bord
        .attr("fill", d => d.color)   // La couleur en fond...
        .attr("fill-opacity", 0.15)   // ...mais très transparente (effet verre)
        .attr("stroke-width", 2);

    // TEXTE
    node.append("text")
        .attr("x", d => d.r + 8).attr("y", 4)
        .text(d => d.name)
        .style("font-size", "10px").style("fill", "#8b949e")
        .style("pointer-events", "none");

    // Interactions
    const linkedByIndex = {};
    links.forEach(d => { linkedByIndex[`${d.source.id},${d.target.id}`] = 1; linkedByIndex[`${d.target.id},${d.source.id}`] = 1; });
    function isConnected(a, b) { return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id; }

    node.on("mouseover", (e, d) => {
        node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
        link.style("stroke-opacity", o => (o.source === d || o.target === d ? 1 : 0.05));
        link.attr("stroke", o => (o.source === d || o.target === d ? d.color : "#30363d"));
    }).on("mouseout", () => {
        node.style("opacity", 1);
        link.style("stroke-opacity", 0.5).attr("stroke", "#30363d");
    });

    node.on("click", (e, d) => {
        e.stopPropagation();
        const btn = document.createElement("button");
        if(d.type==="doc") btn.dataset.openDoc = d.id;
        if(d.type==="person") btn.dataset.openPerson = d.id;
        if(d.type==="event") btn.dataset.openEvent = d.id;
        root.appendChild(btn); btn.click(); root.removeChild(btn);
    });

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragStart(e) { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; }
    function dragging(e) { e.subject.fx = e.x; e.subject.fy = e.y; }
    function dragEnd(e) { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; }
}