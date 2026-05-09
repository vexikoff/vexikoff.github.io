const body = document.body;

function tht() {
  body.classList.toggle('darktheme');
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