// Ren logik för uppgiftslistan, utan beroenden till DOM eller localStorage.
// Laddas som vanligt skript i webbläsaren och kan även köras i Node (tester).

// Uppgifter som sparats innan klarmarkering fanns saknar "done" och räknas som ej klara.
function normalizeTasks(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw.map((task) => ({
        ...task,
        done: task.done === true,
    }));
}

// Returnerar en ny lista där uppgiften på given plats har växlat klarstatus.
function toggleDone(tasks, index) {
    return tasks.map((task, i) => (i === index ? { ...task, done: !task.done } : task));
}

function countRemaining(tasks) {
    return tasks.filter((task) => !task.done).length;
}

// Ej klara först, klara sist; i övrigt samma ordning som i den sparade listan.
// Varje post behåller sin plats i den sparade listan (index) för ta bort och klarmarkering.
function sortForDisplay(tasks) {
    return tasks
        .map((task, index) => ({ task, index }))
        .sort((a, b) => Number(a.task.done) - Number(b.task.done) || a.index - b.index);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeTasks, toggleDone, countRemaining, sortForDisplay };
}
