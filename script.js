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
