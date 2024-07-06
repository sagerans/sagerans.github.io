const cube = document.querySelector('.cube');

let startX, startY, currentX = 0, currentY = 0, rotationX = -30, rotationY = -45;

cube.addEventListener('mousedown', function(event) {
    startX = event.clientX;
    startY = event.clientY;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(event) {
    currentX = event.clientX - startX;
    currentY = event.clientY - startY;

    cube.style.transform = `rotateX(${rotationX - currentY / 2}deg) rotateY(${rotationY + currentX / 2}deg)`;
}

function onMouseUp() {
    rotationX -= currentY / 2;
    rotationY += currentX / 2;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
