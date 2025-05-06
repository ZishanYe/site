class BallShape {
    constructor({ name, color, diameter, mass, orbitRadius, orbitSpeed, rotationSpeed }) {
        this.name = name;
        this.color = color;
        this.diameter = diameter;
        this.mass = mass;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
        this.rotationSpeed = rotationSpeed;
        this.element = null;
    }

    createElement() {
        const div = document.createElement('div');
        div.className = 'celestial-body';
        div.style.width = `${this.diameter}px`;
        div.style.height = `${this.diameter}px`;
        div.style.backgroundColor = this.color;
        div.style.borderRadius = '50%';
        div.style.position = 'absolute';
        div.style.top = '50%';
        div.style.left = '50%';
        div.style.transform = `translate(-50%, -50%)`;
        this.element = div;
        return div;
    }
}

class Planet extends BallShape {
    constructor(props) {
        super(props);
    }

    createOrbit(centerX, centerY) {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = `${this.orbitRadius * 2}px`;
        orbit.style.height = `${this.orbitRadius * 2}px`;
        orbit.style.border = '1px dashed gray';
        orbit.style.borderRadius = '50%';
        orbit.style.position = 'absolute';
        orbit.style.top = `${centerY - this.orbitRadius}px`;
        orbit.style.left = `${centerX - this.orbitRadius}px`;
        return orbit;
    }

    animate(centerX, centerY) {
        const angle = (Date.now() * this.orbitSpeed) / 1000;
        const x = centerX + this.orbitRadius * Math.cos(angle);
        const y = centerY + this.orbitRadius * Math.sin(angle);
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}

class SolarSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bodies = [];
        this.centerX = 750;
        this.centerY = 400;
        this.sun = null;
    }

    addBody(body) {
        if (body instanceof Planet) {
            const orbit = body.createOrbit(this.centerX, this.centerY);
            this.container.appendChild(orbit);
        }
        const el = body.createElement();
        this.container.appendChild(el);
        this.bodies.push(body);
    }

    setSun(sun) {
        this.sun = sun;
        const el = sun.createElement();
        el.style.left = `${this.centerX}px`;
        el.style.top = `${this.centerY}px`;
        this.container.appendChild(el);
        this.bodies.push(sun);
    }

    start() {
        const animate = () => {
            for (let body of this.bodies) {
                if (body instanceof Planet) {
                    body.animate(this.centerX, this.centerY);
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = new SolarSystem('solar-system');

    const sun = new BallShape({
        name: 'Sun',
        color: 'yellow',
        diameter: 100,
        mass: 1.989e30,
        orbitRadius: 0,
        orbitSpeed: 0,
        rotationSpeed: 0
    });
    solarSystem.setSun(sun);

    const planets = [
        { name: 'Mercury', color: 'gray', diameter: 10, mass: 3.3e23, orbitRadius: 60, orbitSpeed: 0.02, rotationSpeed: 0.01 },
        { name: 'Venus', color: 'orange', diameter: 18, mass: 4.87e24, orbitRadius: 100, orbitSpeed: 0.015, rotationSpeed: 0.008 },
        { name: 'Earth', color: 'blue', diameter: 20, mass: 5.97e24, orbitRadius: 140, orbitSpeed: 0.012, rotationSpeed: 0.01 },
        { name: 'Mars', color: 'red', diameter: 15, mass: 6.4e23, orbitRadius: 180, orbitSpeed: 0.01, rotationSpeed: 0.009 },
        { name: 'Jupiter', color: 'brown', diameter: 40, mass: 1.9e27, orbitRadius: 240, orbitSpeed: 0.007, rotationSpeed: 0.03 },
        { name: 'Saturn', color: 'goldenrod', diameter: 35, mass: 5.68e26, orbitRadius: 300, orbitSpeed: 0.005, rotationSpeed: 0.025 }
    ];

    for (let config of planets) {
        const planet = new Planet(config);
        solarSystem.addBody(planet);
    }

    window.solarSystemInstance = solarSystem;
    solarSystem.start();
});

// Table creation and display on click
function createInfoTable(bodies) {
    const table = document.createElement('table');
    table.border = '1';
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const headers = ['Name', 'Mass', 'Orbit Radius', 'Color', 'Diameter'];
    const headerRow = table.insertRow();

    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        th.style.cursor = 'pointer';
        th.onclick = () => sortTable(table, headers.indexOf(header));
        headerRow.appendChild(th);
    });

    bodies.forEach(body => {
        const row = table.insertRow();
        row.insertCell().innerText = body.name;
        row.insertCell().innerText = body.mass;
        row.insertCell().innerText = body.orbitRadius || '0';
        row.insertCell().innerText = body.color;
        row.insertCell().innerText = body.diameter;
    });

    return table;
}

function sortTable(table, colIndex) {
    const rows = Array.from(table.rows).slice(1);
    const isNumeric = !isNaN(parseFloat(rows[0].cells[colIndex].innerText));
    const asc = table.getAttribute('data-sort') !== 'asc';

    rows.sort((a, b) => {
        const aText = a.cells[colIndex].innerText;
        const bText = b.cells[colIndex].innerText;
        return isNumeric
            ? (asc ? aText - bText : bText - aText)
            : (asc ? aText.localeCompare(bText) : bText.localeCompare(aText));
    });

    rows.forEach(row => table.tBodies[0].appendChild(row));
    table.setAttribute('data-sort', asc ? 'asc' : 'desc');
}

document.addEventListener('click', () => {
    const existing = document.getElementById('info-table');
    if (existing) return;

    const container = document.createElement('div');
    container.id = 'info-table';
    container.style.position = 'absolute';
    container.style.top = '820px';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';
    container.style.border = '1px solid black';
    container.style.width = '100%';
    const table = createInfoTable(window.solarSystemInstance.bodies);
    container.appendChild(table);
    document.body.appendChild(container);
});
