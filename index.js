const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreElm = document.querySelector("#scoreElm");
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
        //c.fillStyle = "blue";
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y);
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
const monedas = [];
const perimetros = [];
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
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};
let lastKey = "";
let score = 0;
const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];
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
        }
    });
});
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
    for (let i = monedas.length - 1; 0 < i; i--) {
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

    player.update();
    //player.velocity.y=0
    //player.velocity.x=0
}
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
    console.log(keys.d.pressed);
    console.log(keys.s.pressed);
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
    console.log(keys.d.pressed);
    console.log(keys.s.pressed);
});
