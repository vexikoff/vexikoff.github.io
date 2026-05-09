const body = document.body;

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
} else {
  body.classList.remove('mb')
}
