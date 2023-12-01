let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let peliAlusta = document.getElementById('peliAlusta');
canvas.height = peliAlusta.offsetHeight + 50;
canvas.width = peliAlusta.offsetWidth;
let player_x = canvas.width / 2;
let player_y = canvas.height - 30;
let ammus_x = canvas.width / 2;
let ammus_y = canvas.height - 30;
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
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    update() {
        this.draw();
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
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    update() {
        this.draw();
    }
}
for (i = 0; i < 36; i++) {
    pallot.push(new Pallo(pallo_x, pallo_y, palloRadius, colors[Math.floor(Math.random() * colors.length)], rivi, paikka, (merkattu = false)));
    pallo_x += 21;
    paikka += 1;
}
for (i = 0; i < 1; i++) {
    players.push(new Player(player_x, player_y, playerRadius, colors[Math.floor(Math.random() * colors.length)], { x: 1, y: 1 }));
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
        pallo.draw();
    });
}
addEventListener('click', (e) => {
    let angle = Math.atan2(e.clientY - (window.innerHeight - 40), e.clientX - window.innerWidth / 2);
    let velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    ammukset.push(new Player(ammus_x, ammus_y, playerRadius, players[0].color, { x: velocity.x, y: velocity.y }));
    console.log(e);
});
animate();
console.dir(window);
console.log(window.innerHeight - 40);
