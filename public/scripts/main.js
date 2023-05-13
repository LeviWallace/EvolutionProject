let canv = document.getElementById("simulation");
let ctx = canv.getContext("2d");

let table = document.getElementById("organismList")
let running = true;

let BACKGROUND_COLOR = "white";
setInterval(main, 1000/60);

function clearing()
{
    console.log("here");
    organisms = [];
}

function changeState(state)
{
    running = state;
}

function produceTraits(traits)
{
    out = [];
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

function drawOrganismInCell(organism)
{
    let c = document.createElement("canvas");
    let context = c.getContext("2d");
    context.fillStyle = organism.color;
    context.beginPath();
    context.arc(c.width/2, c.height/2, this.radius, 0, 2 * Math.PI, false);
    context.fill();
    return c;
}

function updateTable()
{
    table.innerHTML = "";
    let title = table.insertRow(0);
    title.insertCell(0).innerHTML = "Organism";
    title.insertCell(1).innerHTML = "Fitness";
    organisms.filter(organism => { return organism.alive; }).forEach(organism => {
        let row = table.insertRow(-1);
        let c0 = row.insertCell(0);
        c0.innerHTML = "&nbsp;"
        c0.style.backgroundColor = organism.color;
        let c1 = row.insertCell(1);
        c1.innerHTML = organism.fitness;
    })
}

function clear()
{
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function main()
{
    if (running)
    {
        update();
        draw();
    }
}

function update()
{
    for (organism of organisms)
    {
        if (organism.alive) organism.update();
    }
    updateTable();
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