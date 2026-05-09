const cursor = document.querySelector('.cc');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let currentScale = 1;

const speed = 0.35;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const pointerVal = getComputedStyle(e.target).getPropertyValue('--pointer').trim();
  currentScale = pointerVal === '1' ? 1.5 : 1.0;
});

function animate() {
  let dx = mouseX - cursorX;
  let dy = mouseY - cursorY;
  
  cursorX += dx * speed;
  cursorY += dy * speed;

  const skewX = Math.min(Math.abs(dx) * 2, 25) * Math.sign(dx);
  const skewY = Math.min(Math.abs(dy) * 2, 25) * Math.sign(dy);

  cursor.style.transform = `
    translate3d(${cursorX}px, ${cursorY}px, 0)
    skewX(${skewX}deg)
    skewY(${skewY}deg)
    scale(${currentScale})
  `;

  requestAnimationFrame(animate);
}

animate();