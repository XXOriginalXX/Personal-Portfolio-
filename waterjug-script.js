document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", () => {
        const jug1Capacity = parseInt(document.getElementById("jug1-capacity").value);
        const jug2Capacity = parseInt(document.getElementById("jug2-capacity").value);
        const target = parseInt(document.getElementById("target-volume").value);

        if (isNaN(jug1Capacity) || isNaN(jug2Capacity) || isNaN(target)) {
            alert("Please fill in all fields with valid numbers!");
            return;
        }

        simulateWaterJug(jug1Capacity, jug2Capacity, target);
    });

    function updateJugVisual(jugId, amount, capacity) {
        const jugWater = document.getElementById(`${jugId}-water`);
        const height = (amount / capacity) * 100;
        jugWater.style.height = `${height}%`;
    }

    function simulateWaterJug(x, y, z) {
        const visited = new Set(); 
        const queue = [{ a: 0, b: 0, steps: [] }]; 
        const stepsContainer = document.getElementById("steps");
        stepsContainer.innerHTML = "";

        let delay = 0;

        while (queue.length > 0) {
            const { a, b, steps } = queue.shift();

            
            if (a === z || b === z) {
                steps.push(`Goal Achieved: Jug 1 = ${a}, Jug 2 = ${b}`);
                visualizeSolution(steps, delay);
                return;
            }

            
            if (visited.has(`${a}-${b}`)) continue;

            visited.add(`${a}-${b}`); 

            const actions = [
                { a: x, b, desc: "Fill Jug 1" }, 
                { a, b: y, desc: "Fill Jug 2" }, 
                { a: 0, b, desc: "Empty Jug 1" }, 
                { a, b: 0, desc: "Empty Jug 2" }, 
                { a: Math.max(0, a - (y - b)), b: Math.min(y, b + a), desc: "Pour Jug 1 to Jug 2" }, 
                { a: Math.min(x, a + b), b: Math.max(0, b - (x - a)), desc: "Pour Jug 2 to Jug 1" }, 
            ];

            for (const action of actions) {
                if (!visited.has(`${action.a}-${action.b}`) && action.a >= 0 && action.b >= 0) {
                    queue.push({ a: action.a, b: action.b, steps: [...steps, action.desc] });
                }
            }
        }

        setTimeout(() => {
            stepsContainer.innerHTML = "<p>No solution found.</p>";
        }, delay + 1000);
    }

    function visualizeSolution(steps, delay) {
        const stepsContainer = document.getElementById("steps");
        stepsContainer.innerHTML = ""; 

        steps.forEach((step, index) => {
            setTimeout(() => {
                const stepElement = document.createElement("p");
                stepElement.textContent = step;
                stepsContainer.appendChild(stepElement);

                if (step.includes("Jug 1")) {
                    const [_, a] = step.match(/Jug 1 = (\d+)/) || [];
                    updateJugVisual("jug1", parseInt(a), document.getElementById("jug1-capacity").value);
                }
                if (step.includes("Jug 2")) {
                    const [_, b] = step.match(/Jug 2 = (\d+)/) || [];
                    updateJugVisual("jug2", parseInt(b), document.getElementById("jug2-capacity").value);
                }
            }, delay * index);
        });
    }
});
