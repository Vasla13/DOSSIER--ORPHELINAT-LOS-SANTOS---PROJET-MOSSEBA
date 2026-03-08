import { fmtDate, getPersonIdsForItem } from "../utils.js";
import { matchByPerson, matchByQuery, matchByTags, matchByTypes } from "../logic/filters.js";

let activeSimulation = null;

export function teardownGraph() {
    if (activeSimulation) {
        activeSimulation.stop();
        activeSimulation = null;
    }
}

export function renderGraph(root, data, state) {
    if (!window.d3) {
        root.innerHTML = "<div class='kpi' style='color:#f85149'>Erreur : D3.js non chargé.</div>";
        return;
    }

    teardownGraph();

    root.innerHTML = `
      <div id="graph-wrapper">
          <div id="graph-container"></div>
          
          <div id="graph-legend">
            <div class="legend-item" style="color:#58a6ff"><div class="legend-dot" style="background:#58a6ff"></div> Sujet</div>
            <div class="legend-item" style="color:#f85149"><div class="legend-dot" style="background:#f85149"></div> Événement</div>
            <div class="legend-item" style="color:#2ea043"><div class="legend-dot" style="background:#2ea043"></div> Preuve</div>
            <div style="margin-top:10px; border-top:1px solid #333; padding-top:5px; opacity:0.5; font-size:9px">
                SCROLL: Zoom | DRAG: Bouger
            </div>
          </div>
      </div>
    `;

    const container = root.querySelector("#graph-container");
    const width = container.clientWidth || 1000;
    const height = Math.max(container.clientHeight || 0, 720);

    const nodes = [];
    const links = [];
    const nodeSet = new Set();

    const docs = data.documents.filter(doc =>
        matchByPerson(doc, state.activePerson, data) &&
        matchByTags(doc, state.activeTags, data) &&
        matchByTypes(doc, state.activeTypes, data) &&
        matchByQuery(doc, state.query, data)
    );

    const events = data.events.filter(event =>
        matchByPerson(event, state.activePerson, data) &&
        matchByTags(event, state.activeTags, data) &&
        matchByTypes(event, state.activeTypes, data) &&
        matchByQuery(event, state.query, data)
    );

    const relatedPersonIds = new Set();
    docs.forEach(doc => {
        (doc.people || []).forEach(personId => relatedPersonIds.add(personId));
    });
    events.forEach(event => {
        getPersonIdsForItem(event, data).forEach(personId => relatedPersonIds.add(personId));
    });
    if (state.activePerson) relatedPersonIds.add(state.activePerson);

    const people = (data.entities?.people || []).filter(person => {
        if (state.activePerson) {
            return person.id === state.activePerson || relatedPersonIds.has(person.id);
        }
        return relatedPersonIds.has(person.id) || matchByQuery(person, state.query, data);
    });

    people.forEach(person => {
        nodes.push({ id: person.id, name: person.name, type: "person", r: 25, color: "#58a6ff" });
        nodeSet.add(person.id);
    });

    docs.forEach(doc => {
        if (nodeSet.has(doc.id)) return;

        nodes.push({
            id: doc.id,
            name: doc.title.length > 18 ? `${doc.title.substring(0, 18)}...` : doc.title,
            type: "doc",
            r: 15,
            color: "#2ea043"
        });
        nodeSet.add(doc.id);

        (doc.people || []).forEach(personId => {
            if (nodeSet.has(personId)) links.push({ source: personId, target: doc.id });
        });
    });

    events.forEach(event => {
        if (nodeSet.has(event.id)) return;

        nodes.push({
            id: event.id,
            name: event.title.length > 18 ? `${event.title.substring(0, 18)}...` : event.title,
            label: fmtDate(event.date),
            type: "event",
            r: 18,
            color: "#f85149"
        });
        nodeSet.add(event.id);

        getPersonIdsForItem(event, data).forEach(personId => {
            if (nodeSet.has(personId)) links.push({ source: personId, target: event.id });
        });
        (event.related_docs || []).forEach(docId => {
            if (nodeSet.has(docId)) links.push({ source: event.id, target: docId });
        });
    });

    if (nodes.length === 0) {
        container.innerHTML = "<div class='kpi' style='margin-top:20%; opacity:0.5'>Aucune donnée.</div>";
        return;
    }

    activeSimulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.r + 10));

    const svg = d3.select(container).append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.1, 4]).on("zoom", (e) => g.attr("transform", e.transform)));

    const link = g.append("g").selectAll("line")
        .data(links).join("line")
        .attr("stroke", "#30363d").attr("stroke-opacity", 0.5).attr("stroke-width", 1);

    const node = g.append("g").selectAll(".node")
        .data(nodes).join("g").attr("class", "node")
        .call(d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd));

    node.append("circle")
        .attr("r", d => d.r)
        .attr("stroke", d => d.color)
        .attr("fill", d => d.color)
        .attr("fill-opacity", 0.15)
        .attr("stroke-width", 2);

    node.append("text")
        .attr("x", d => d.r + 8).attr("y", 0)
        .text(d => d.name)
        .style("font-size", "10px").style("fill", "#8b949e")
        .style("pointer-events", "none");

    node.filter(d => d.label).append("text")
        .attr("x", d => d.r + 8).attr("y", 13)
        .text(d => d.label)
        .style("font-size", "9px").style("fill", "#6e7681")
        .style("pointer-events", "none");

    const linkedByIndex = {};
    links.forEach(d => {
        linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
        linkedByIndex[`${d.target.id},${d.source.id}`] = 1;
    });
    function isConnected(a, b) {
        return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    }

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
        if (d.type === "doc") btn.dataset.openDoc = d.id;
        if (d.type === "person") btn.dataset.openPerson = d.id;
        if (d.type === "event") btn.dataset.openEvent = d.id;
        root.appendChild(btn);
        btn.click();
        root.removeChild(btn);
    });

    activeSimulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragStart(e) {
        if (!e.active) activeSimulation.alphaTarget(0.3).restart();
        e.subject.fx = e.subject.x;
        e.subject.fy = e.subject.y;
    }

    function dragging(e) {
        e.subject.fx = e.x;
        e.subject.fy = e.y;
    }

    function dragEnd(e) {
        if (!e.active) activeSimulation.alphaTarget(0);
        e.subject.fx = null;
        e.subject.fy = null;
    }
}
