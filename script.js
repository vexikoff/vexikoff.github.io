const body = document.body;
const delmob = document.querySelector('.cc');

if (localStorage.getItem('theme') === 'darktheme') {
  body.classList.add('darktheme');
}

function tht() {
  body.classList.toggle('darktheme');
  
  if (body.classList.contains('darktheme')) {
    localStorage.setItem('theme', 'darktheme');
  } else {
    localStorage.removeItem('theme');
  }
}

function goto(link) {
  window.location.href = link;
}


function detectDevice() {
  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return "mb";
  } else {
    return "dsk";
  }
}

if (detectDevice() === "mb") {
  body.classList.add('mb')
  delmob.remove();
} else {
  body.classList.remove('mb')
}

window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('music');
    
    if (audio) {
        audio.volume = 0.1;

        const startPlayback = () => {
            audio.play().catch(() => {
                const playOnInteraction = () => {
                    audio.play();
                    document.removeEventListener('click', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
            });
        };

        setTimeout(startPlayback, 30000);

        audio.addEventListener('ended', () => {
            setTimeout(startPlayback, 30000);
        });
    }
});
