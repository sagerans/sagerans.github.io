document.addEventListener('DOMContentLoaded', function() {
    const dominoContainer = document.getElementById('domino-container');

    function createDomino(x, y, rotation) {
        const domino = document.createElement('div');
        domino.classList.add('domino');
        domino.style.left = `${x}px`;
        domino.style.top = `${y}px`;
        domino.style.transform = `rotate(${rotation}deg)`;

        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            const dotPositions = [
                [15, 7.5], [45, 7.5],
                [15, 22.5], [45, 22.5],
                [30, 15]
            ];
            dot.style.left = `${dotPositions[i % 5][0]}px`;
            dot.style.top = `${dotPositions[i % 5][1]}px`;
            domino.appendChild(dot);
        }

        domino.addEventListener('click', function() {
            domino.style.transition = 'transform 0.5s';
            domino.style.transform += 'rotate(90deg)';
        });

        dominoContainer.appendChild(domino);
    }

    createDomino(50, 50, 0);
    createDomino(150, 50, 0);
    createDomino(250, 50, 0);
});
