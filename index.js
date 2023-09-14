const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
class Perimetro {
    static width = 40;
    static height = 40;
    constructor({ position }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }
    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "yellow";
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
const perimetros = [];
const player = new Player({
    position: {
        x: Perimetro.width + Perimetro.width / 2,
        y: Perimetro.height + Perimetro.height / 2,
    },
    velocity: {
        x: 0,
        y: 0,
    }
})
const map = [
    ["-", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", "-"],
    ["-", " ", "-", "-", " ", "-"],
    ["-", " ", " ", " ", " ", "-"],
    ["-", "-", "-", "-", "-", "-"],
];
map.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        switch (Symbol) {
            case "-":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                    })
                );
                break;
        }
    });
});
function animacion() {
    requestAnimationFrame(animacion);
    c.clearRect(0, 0, canvas.width, canvas.height);
    perimetros.forEach((Perimetro) => {
        Perimetro.draw();
    });
    player.update();
}
animacion();
addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            player.velocity.y = -5;
            break;
        case "a":
            player.velocity.x = -5;
            break;
        case "s":
            player.velocity.y = 5;
            break;
        case "d":
            player.velocity.x = 5;
            break;
    }
    console.log(player.velocity);
});
addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            player.velocity.y = 0;
            break;
        case "a":
            player.velocity.x = 0;
            break;
        case "s":
            player.velocity.y = 0;
            break;
        case "d":
            player.velocity.x = 0;
            break;
    }
    console.log(player.velocity);
});
