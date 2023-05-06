let canv = document.getElementById("simulation");
let ctx = canv.getContext("2d");

let BACKGROUND_COLOR = "white";
setInterval(main, 1000/60);


function produceTraits(traits)
{
    out = [];
    console.log(traits);
    for (trait of traits)
    {
        out.push(trait + 0.1);
    }
    return out;
}

function getFitness(traits)
{
    out = 0;
    for (trait of traits)
    {
        out += trait;
    }
    return out/traits.length;
}

class Organism
{
    constructor(x, y, xVel, yVel, traits)
    {
        this.alive = true;
        this.x = x;
        this.y = y;
        
        // [0.9, 0.1, 0.23, 0.42]
        this.traits = traits;
        // 1 > fitness > 0
        this.fitness = getFitness(traits);
        this.color = `hsl(240, 50%, ${this.fitness*100}%)`;
        this.radius = 25;
        // in ticks
        this.lifespan = 60 * 10;
        this.life = 0;
        this.birthRate = 60 * (7-5*this.fitness);
        //
        this.xVel = xVel * (1 + this.fitness);
        this.yVel = yVel * (1 + this.fitness);
        //

    }

    update()
    {
        this.x += this.xVel;
        this.y += this.yVel;
        if (this.x+this.radius >= canv.width)
        {
            this.xVel *= -1;
        }
        if (this.y+this.radius >= canv.height)
        {
            this.yVel *= -1;
        }
        if (this.x-this.radius <= 0)
        {
            this.xVel *= -1;
        }
        if (this.y-this.radius <= 0)
        {
            this.yVel *= -1;
        }
        this.life += 1;
        if (this.life % this.birthRate == 0)
        {
            this.reproduce();
        }
        if (this.life >= this.lifespan)
        {  
            this.alive = false;
        }
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        console.log(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    reproduce()
    {

        let offspring = new Organism(this.x, this.y, 2*Math.random()-1, 2*Math.random()-1, produceTraits(this.traits));
        organisms.push(offspring);
    }
}

let organisms = [new Organism(100, 100, 1, 0.25, [0, 0, 0, 0])]

function clear()
{
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function main()
{
    update();
    draw();
}

function update()
{
    for (organism of organisms)
    {
        if (organism.alive) organism.update();
    }
}

function draw()
{
    clear();
    for (organism of organisms)
    {
        if (organism.alive) organism.draw();
    }
}

main();