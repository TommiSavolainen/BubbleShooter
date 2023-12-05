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
let riveja = 6; 
let pallovali = 21; 

for (let rivi = 0; rivi < riveja; rivi++) {
    for (let i = 0; i < 36; i++) {
        let offset = rivi % 2 === 0 ? 0 : pallovali / 2;
        
        pallot.push(new Pallo(pallo_x + offset, pallo_y, palloRadius, colors[Math.floor(Math.random() * colors.length)], rivi, paikka, (merkattu = false)));
        pallo_x += 21;
        paikka += 1;
    }
    pallo_x = 11;
    pallo_y += 21;

}
class Viiva {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.mousex = undefined;
        this.mousey = undefined;
    }
    hiiriKoordinaatit(mousePos) {
        this.mousex = mousePos.x;
        this.mousey = mousePos.y;
    }

    update() {
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x - 30, this.y);
        ctx.lineTo(this.mousex, this.mousey);
        ctx.stroke();
    }
}

addEventListener('mousemove', (e) => {
    var mousePos = getMousePos(canvas, e);
    viiva.hiiriKoordinaatit(mousePos);
});
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}
let viiva = new Viiva(viiva_x + 30, viiva_y, '#0000ff');
for (i = 0; i < 36; i++) {
    pallot.push(new Pallo(pallo_x, pallo_y, palloRadius, colors[Math.floor(Math.random() * colors.length)], rivi, paikka, (merkattu = false)));
    pallo_x += 21;
    paikka += 1;
}
for (i = 0; i < 4; i++) {
    players.push(new Player(player_x, player_y, playerRadius, colors[Math.floor(Math.random() * colors.length)], { x: 1, y: 1 }));
    player_x -= 30;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ammukset.forEach((ammus) => {
        ammus.update();
    });
    players.forEach((player) => {
        player.draw();
    });
    pallot.forEach((pallo) => {
        pallo.update();
    });
    viiva.update();
}
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
