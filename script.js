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
    body.classList.add('mb');
} else {
    body.classList.remove('mb');
}

class ListScroller {
    constructor(elementId, delay) {
        this.listmain = document.getElementById(elementId);
        this.iskrutkaanimating = false;
        this.krutkainterval = null;
        this.krutkadelays = delay;

        if (this.listmain) {
            this.start();
        }
    }

    krutkasheight() {
        const children = this.listmain.children;
        const firstelement = children[0];
        const secondelement = children[1];

        if (secondelement) {
            const firsttop = firstelement.getBoundingClientRect().top;
            const secondtop = secondelement.getBoundingClientRect().top;
            return secondtop - firsttop;
        }

        const computedstyle = window.getComputedStyle(firstelement);
        const margintop = parseFloat(computedstyle.marginTop);
        const marginbottom = parseFloat(computedstyle.marginBottom);
        const blockheight = firstelement.getBoundingClientRect().height;

        return blockheight + margintop + marginbottom;
    }

    krutiblyat() {
        if (this.iskrutkaanimating || !this.listmain) {
            return;
        }

        const firstelement = this.listmain.firstElementChild;

        if (!firstelement) {
            return;
        }

        const stepheight = this.krutkasheight();

        if (stepheight <= 0) {
            return;
        }

        this.iskrutkaanimating = true;

        this.listmain.style.transform = 'translateY(-' + stepheight + 'px)';

        const self = this;
        const finishkrutka = function (event) {
            if (event.propertyName !== 'transform') {
                return;
            }

            self.listmain.removeEventListener('transitionend', finishkrutka);

            self.listmain.style.transition = 'none';
            self.listmain.style.transform = 'translateY(0)';
            self.listmain.appendChild(firstelement);

            void self.listmain.offsetHeight;

            self.listmain.style.transition = '';
            self.iskrutkaanimating = false;
        };

        this.listmain.addEventListener('transitionend', finishkrutka);
    }

    start() {
        if (this.krutkainterval !== null) {
            clearInterval(this.krutkainterval);
        }
        
        this.krutkainterval = setInterval(() => this.krutiblyat(), this.krutkadelays);
    }
}

function mainlistepta() {
    new ListScroller('listmain', 3000);
    new ListScroller('listmain2', 3000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainlistepta);
} else {
    mainlistepta();
}