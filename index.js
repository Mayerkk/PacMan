const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreElm = document.querySelector("#scoreElm");
let tiempoJuego = 0;
console.log("scoreElm");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Perimetro {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
    }
    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - 0.75);
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = "yellow";
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
        this.radians += this.openRate;
    }
}

class Fantasma {
    constructor({ position, speed, color = "red",image }) {
        this.position = position;
        this.speed = speed;
        this.radius = 15;
        this.scared = false;
        this.color = color;
        this.image = image; 
    }

    draw() {
        c.drawImage(this.image, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update(playerPosition) {
        const dx = playerPosition.x - this.position.x;
        const dy = playerPosition.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.position.x += (dx / distance) * this.speed;
        this.position.y += (dy / distance) * this.speed;
    }
}

class Moneda {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "white";
        c.fill();
        c.closePath();
    }
}
class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 7;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "white";
        c.fill();
        c.closePath();
    }
}
const imagenFantasma = createImage("./img/fantasmita.png");
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.src = "BEAT DO PAC MAN 2K22 (Slowed + Reverb)_(Bass Boosted)🔊.mp3";


// Para reproducir la música de fondo
function playBackgroundMusic() {
    backgroundMusic.play();
}

// Para detener la música de fondo
function stopBackgroundMusic() {
    backgroundMusic.pause();
}
backgroundMusic.volume = 0.5;
const monedas = [];
const perimetros = [];
const powerUps = [];
const fantasmas = []; // Agregamos una matriz para los fantasmas

const player = new Player({
    position: {
        x: Perimetro.width + Perimetro.width / 2,
        y: Perimetro.height + Perimetro.height / 2,
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
};

let lastKey = "";
let score = 0;

const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", "F", "|"],
    ["|", ".", "b", "p", "[", "+", "]", "p", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", "F", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", "F", "|"],
    ["|", ".", "b", "p", "[", "+", "]", "p", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", "F", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", "p", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];
function mostrarTiempo() {
    const segundos = Math.floor(tiempoJuego);
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `Tiempo: ${segundos} s`;
}
function iniciarTemporizador() {
    setInterval(() => {
        tiempoJuego += 1; // Incrementar el tiempo en 1 segundo
        mostrarTiempo(); // Actualizar la visualización del tiempo
    }, 1000); // Llamar a la función cada 1000 ms (1 segundo)
}
function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

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
                        image: createImage("./img/pipeHorizontal.png"),
                    })
                );
                break;
            case "|":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeVertical.png"),
                    })
                );
                break;
            case "1":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeCorner1.png"),
                    })
                );
                break;
            case "2":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeCorner2.png"),
                    })
                );
                break;
            case "3":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeCorner3.png"),
                    })
                );
                break;
            case "4":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeCorner4.png"),
                    })
                );
                break;
            case "b":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/block.png"),
                    })
                );
                break;
            case "[":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/capLeft.png"),
                    })
                );
                break;
            case "]":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/capRight.png"),
                    })
                );
                break;
            case "_":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/capBottom.png"),
                    })
                );
                break;
            case "^":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/capTop.png"),
                    })
                );
                break;
            case "+":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeCross.png"),
                    })
                );
                break;
            case "5":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeConnectorTop.png"),
                    })
                );
                break;
            case "6":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeConnectorRight.png"),
                    })
                );
                break;
            case "7":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeConnectorBottom.png"),
                    })
                );
                break;
            case "8":
                perimetros.push(
                    new Perimetro({
                        position: {
                            x: Perimetro.width * j,
                            y: Perimetro.height * i,
                        },
                        image: createImage("./img/pipeConnectorLeft.png"),
                    })
                );
                break;
            case ".":
                monedas.push(
                    new Moneda({
                        position: {
                            x: Perimetro.width * j + Perimetro.width / 2,
                            y: Perimetro.height * i + Perimetro.height / 2,
                        },
                    })
                );
                break;
            case "p":
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: Perimetro.width * j + Perimetro.width / 2,
                            y: Perimetro.height * i + Perimetro.height / 2,
                        },
                    })
                );
                break;
            case "F": // Agregamos el símbolo "F" para representar a los fantasmas en el mapa
                fantasmas.push(
                    new Fantasma({
                        position: {
                            x: Perimetro.width * j + Perimetro.width / 2,
                            y: Perimetro.height * i + Perimetro.height / 2,
                        },
                        speed: 2, // Puedes ajustar la velocidad de los fantasmas según tus necesidades.
                        image: imagenFantasma,
                    })
                );
                break;
        }
    });
});
function hasGhostTouchedPlayer(player, ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        const distance = Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y);
        if (distance < ghost.radius + player.radius) {
            return true;
        }
    }
    return false;
}
function colisionCirculoReactangulo({ circulo, rectangulo }) {
    return (
        player.position.y - player.radius + player.velocity.y <= rectangulo.position.y + rectangulo.height &&
        player.position.x + player.radius + player.velocity.x >= rectangulo.position.x &&
        player.position.y + player.radius + player.velocity.y >= rectangulo.position.y &&
        player.position.x - player.radius + player.velocity.x <= rectangulo.position.x + rectangulo.width
    );
}

function animacion() {
    requestAnimationFrame(animacion);
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros[i];
            if (
                colisionCirculoReactangulo({
                    circulo: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: -5,
                        },
                    },
                    rectangulo: perimetro,
                })
            ) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -5;
            }
        }
    } else if (keys.a.pressed && lastKey === "a") {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros[i];
            if (
                colisionCirculoReactangulo({
                    circulo: {
                        ...player,
                        velocity: {
                            x: -5,
                            y: 0,
                        },
                    },
                    rectangulo: perimetro,
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === "s") {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros[i];
            if (
                colisionCirculoReactangulo({
                    circulo: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: -5,
                        },
                    },
                    rectangulo: perimetro,
                })
            ) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = 5;
            }
        }
    } else if (keys.d.pressed && lastKey === "d") {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros[i];
            if (
                colisionCirculoReactangulo({
                    circulo: {
                        ...player,
                        velocity: {
                            x: 5,
                            y: 0,
                        },
                    },
                    rectangulo: perimetro,
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = 5;
            }
        }
    }
    if (monedas.length === 0) {
        console.log("you win");
        cancelAnimationFrame();
    }
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i];
        powerUp.draw();
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1);

            fantasmas.forEach((fantasma) => {
                fantasma.scared = true;

                setTimeout(() => {
                    fantasma.scared = false;
                }, 5000);
            });
        }
    }

    for (let i = monedas.length - 1; 0 <= i; i--) {
        const moneda = monedas[i];
        moneda.draw();
        if (Math.hypot(moneda.position.x - player.position.x, moneda.position.y - player.position.y) < moneda.radius + player.radius) {
            console.log("tocando");
            monedas.splice(i, 1);
            score += 10;
            scoreElm.innerHTML = score;
        }
    }

    perimetros.forEach((perimetro) => {
        perimetro.draw();
        if (
            colisionCirculoReactangulo({
                circulo: player,
                rectangulo: perimetro,
            })
        ) {
            console.log("colisioooon"); 
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    // Actualizamos y dibujamos los fantasmas
    fantasmas.forEach((fantasma) => {   
        fantasma.update(player.position);
        fantasma.draw();
    });
    if (hasGhostTouchedPlayer(player, fantasmas)) {
        console.log("¡Un fantasma te ha atrapado!");
        cancelAnimationFrame(animacion); // Detener la animación
        return;
    }

    player.update();
    if (player.velocity.x > 0) player.rotation = 0;
    else if (player.velocity.x < 0) player.rotation = Math.PI;
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}
playBackgroundMusic();
iniciarTemporizador();
animacion();


addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            keys.w.pressed = true;
            lastKey = "w";
            break;
        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break;
        case "s":
            keys.s.pressed = true;
            lastKey = "s";
            break;
        case "d":
            keys.d.pressed = true;
            lastKey = "d";
            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            keys.w.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
    }
});
