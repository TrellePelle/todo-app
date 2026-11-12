const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeTasks, toggleDone, countRemaining, sortForDisplay } = require('../tasks.js');

describe('normalizeTasks (redan sparade uppgifter, krav 7)', () => {
    test('gammal uppgift utan done blir ej klar och behåller text och tid', () => {
        const result = normalizeTasks([{ text: 'Handla', createdAt: 1 }]);
        assert.deepEqual(result, [{ text: 'Handla', createdAt: 1, done: false }]);
    });

    test('done: true förblir klar', () => {
        const result = normalizeTasks([{ text: 'Klar', createdAt: 1, done: true }]);
        assert.equal(result[0].done, true);
    });

    test('ogiltiga done-värden blir ej klar', () => {
        const result = normalizeTasks([
            { text: 'a', done: 'yes' },
            { text: 'b', done: 1 },
            { text: 'c', done: null },
        ]);
        assert.deepEqual(result.map((t) => t.done), [false, false, false]);
    });

    test('tom lagring (null) ger tom lista', () => {
        assert.deepEqual(normalizeTasks(null), []);
    });
});

describe('toggleDone (klarmarkering, krav 1, 3, 5)', () => {
    const tasks = [
        { text: 'a', done: false },
        { text: 'b', done: false },
    ];

    test('växlar till klar och tillbaka till ej klar', () => {
        const once = toggleDone(tasks, 0);
        assert.equal(once[0].done, true);
        const twice = toggleDone(once, 0);
        assert.equal(twice[0].done, false);
    });

    test('ändrar bara rätt uppgift och muterar inte originalet', () => {
        const result = toggleDone(tasks, 1);
        assert.equal(result[0].done, false);
        assert.equal(result[1].done, true);
        assert.equal(tasks[1].done, false);
    });

    test('status finns kvar efter spara och läs in igen', () => {
        const saved = JSON.stringify(toggleDone(tasks, 0));
        const loaded = normalizeTasks(JSON.parse(saved));
        assert.deepEqual(loaded.map((t) => t.done), [true, false]);
    });
});

describe('sortForDisplay (ordning, krav 5 och 6)', () => {
    const tasks = [
        { text: 'a', done: true },
        { text: 'b', done: false },
        { text: 'c', done: true },
        { text: 'd', done: false },
    ];

    test('ej klara först, klara sist, ordning behålls inom grupperna', () => {
        const texts = sortForDisplay(tasks).map((entry) => entry.task.text);
        assert.deepEqual(texts, ['b', 'd', 'a', 'c']);
    });

    test('varje rad pekar på sin plats i den sparade listan', () => {
        for (const { task, index } of sortForDisplay(tasks)) {
            assert.equal(tasks[index], task);
        }
    });

    test('ändrar inte den sparade listans ordning', () => {
        sortForDisplay(tasks);
        assert.deepEqual(tasks.map((t) => t.text), ['a', 'b', 'c', 'd']);
    });
});

describe('countRemaining (räknare, krav 4)', () => {
    test('tom lista ger 0', () => {
        assert.equal(countRemaining([]), 0);
    });

    test('blandad lista ger antal ej klara', () => {
        assert.equal(countRemaining([{ done: true }, { done: false }, { done: false }]), 2);
    });

    test('alla klara ger 0', () => {
        assert.equal(countRemaining([{ done: true }, { done: true }]), 0);
    });
});
