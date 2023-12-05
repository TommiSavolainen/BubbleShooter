let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let peliAlusta = document.getElementById('peliAlusta');
canvas.height = peliAlusta.offsetHeight + 50;
canvas.width = peliAlusta.offsetWidth;
let player_x = canvas.width / 2;
let player_y = canvas.height - 30;
let ammus_x = canvas.width / 2;
let ammus_y = canvas.height - 30;
let viiva_x = canvas.width / 2;
let viiva_y = canvas.height - 30;
let palloRadius = 10;
let playerRadius = 10;
let playerColor = 'pink';
let colors = ['red', 'green', 'yellow', 'blue', 'pink'];
let players = [];
let ammukset = [];
let pallot = [];
let rivi = 6;
let paikka = 1;
let pallo_x = 11;
let pallo_y = 11;
let nopeus = 4;

// Luokka ammuttaville palloille
class Player {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    update() {
        this.draw();
        if (this.x + this.radius >= canvas.width) {
            this.velocity.x = -this.velocity.x;
        } else if (this.x - this.radius <= 0) {
            this.velocity.x = -this.velocity.x;
        } else if (this.y - (this.radius + 4) <= 0) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

// Luokka pelikentän palloille
class Pallo {
    constructor(x, y, radius, color, rivi, paikka, merkattu) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.rivi = rivi;
        this.paikka = paikka;
        this.merkattu = merkattu;
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    update() {
        this.draw();
    }
}

// Luodaan pallot pelikentälle
// rivijä 6
let riveja = 6;
let pallovali = 21;

for (let rivi = 0; rivi < riveja; rivi++) {
    // palloja 36
    for (let i = 0; i < 36; i++) {
        let offset = rivi % 2 === 0 ? 0 : pallovali / 2;

        pallot.push(new Pallo(pallo_x + offset, pallo_y, palloRadius, colors[Math.floor(Math.random() * colors.length)], rivi, paikka, (merkattu = false)));
        pallo_x += 21;
        paikka += 1;
    }
    pallo_x = 11;
    pallo_y += 20;
}

// Luokka tähtäys viivan piirtämiseen
class Viiva {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.mousex = undefined;
        this.mousey = undefined;
    }
    hiiriKoordinaatit(mousePos, angle) {
        this.mousex = mousePos.x;
        this.mousey = mousePos.y;
        this.angle = -angle;
    }

    update() {
        let alkux = this.x - 30;
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x - 30, this.y);
        ctx.lineTo(alkux + 8 * palloRadius * Math.cos(this.angle), this.y - 8 * palloRadius * Math.sin(this.angle));
        ctx.stroke();
    }
}

// Haetaan hiiren koordinaatit ja lasketaan kulma
addEventListener('mousemove', (e) => {
    var mousePos = getMousePos(canvas, e);
    let angle = Math.atan2(e.clientY - (window.innerHeight - 40), e.clientX - window.innerWidth / 2);
    viiva.hiiriKoordinaatit(mousePos, angle);
});
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

// Luodaan uusi viiva objekti
let viiva = new Viiva(viiva_x + 30, viiva_y, '#0000ff');

for (i = 0; i < 4; i++) {
    players.push(new Player(player_x, player_y, playerRadius, colors[Math.floor(Math.random() * colors.length)], { x: 1, y: 1 }));
    player_x -= 30;
}

// Pyöritetään animaatiota luupissa
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ammukset.forEach((ammus, index) => {
        ammus.update();
        pallot.forEach((pallo) => {
            if (tormaakoYmpyra(ammus.x, ammus.y, ammus.radius, pallo.x, pallo.y, pallo.radius)) {
                if (ammus.x > pallo.x) {
                    if (pallot.indexOf(pallo.x + 10.5) == -1 && pallot.indexOf(pallo.y + 19) == -1) {
                        pallot.push(new Pallo(pallo.x + 10.5, pallo.y + 19, palloRadius, ammus.color, pallo.rivi + 1, paikka, (merkattu = false)));
                        ammukset.shift();
                    }
                } else if (pallot.indexOf(pallo.x - 10.5) == -1 && pallot.indexOf(pallo.y + 19) == -1) {
                    pallot.push(new Pallo(pallo.x - 10.5, pallo.y + 19, palloRadius, ammus.color, pallo.rivi + 1, paikka, (merkattu = false)));
                    ammukset.shift();
                }
                ammus.velocity.x = 0;
                ammus.velocity.y = 0;
            }
        });
    });
    players.forEach((player) => {
        player.draw();
    });
    pallot.forEach((pallo) => {
        pallo.update();
    });
    viiva.update();
}

// Tarkistetaan törmääkö ympyrät
function tormaakoYmpyra(x1, y1, r1, x2, y2, r2) {
    // Lasketaan ympyröitten keskipisteiden välit
    var dx = x1 - x2;
    var dy = y1 - y2;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < r1 - 1 + r2 - 1) {
        // Ympyrät törmää
        return true;
    }

    return false;
}

// Ammutaan pallo, kun hiiren nappia painetaan
addEventListener('click', (e) => {
    let angle = Math.atan2(e.clientY - (window.innerHeight - 40), e.clientX - window.innerWidth / 2);
    let velocity = {
        x: Math.cos(angle) * nopeus,
        y: Math.sin(angle) * nopeus,
    };

    ammukset.push(new Player(ammus_x, ammus_y, playerRadius, players[0].color, { x: velocity.x, y: velocity.y }));
    players.shift();
    luoUusiPlayer();
    console.log(ammukset);
});
function luoUusiPlayer() {
    players.forEach((player) => {
        player.x += 30;
    });

    players.push(new Player(player_x + 30, player_y, playerRadius, colors[Math.floor(Math.random() * colors.length)], { x: 1, y: 1 }));
}

animate();
