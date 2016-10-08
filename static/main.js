//setup
var player = 0;
var units = new Array();
var spawn_pos = new Array();

var renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {antialias:false, transparent:false, resolution:1});
var stage = new PIXI.Container();
start();
function start()
{
var bodyRef = document.body;
document.body.appendChild(renderer.view);
//loading assets
PIXI.loader
    .add("static/assets/main/grass.png")
    .add("static/assets/main/blTile.png")
    .add("static/assets/main/brTile.png")
    .add("static/assets/main/lrTile.png")
    .add("static/assets/main/ltTile.png")
    .add("static/assets/main/lbTile.png")
    .add("static/assets/main/lSplit.png")
    .add("static/assets/main/rSplit.png")
    .add("static/assets/main/tbTile.png")
    .add("static/assets/main/trTile.png")
    .add("static/assets/main/castle1.png")
    .add("static/assets/main/castle2.png")
    .add("static/assets/main/house.png")
    .add("static/assets/main/units/soldier1.png")
    .add("static/assets/main/units/soldier2.png")
    .add("static/assets/main/units/wizard1.png")
    .add("static/assets/main/units/wizard2.png")
    .add("static/assets/main/units/worker1.png")
    .add("static/assets/main/units/worker2.png")
    .load(setup);
}

function setup()
{
    var tile = new Array();
    for(i=0;i<Math.ceil(window.innerHeight/64);i++)
    {
        for(j=0;j<Math.ceil(window.innerWidth/64);j++)
        {
            tile.push(new PIXI.Sprite( PIXI.loader.resources["static/assets/main/grass.png"].texture));
            tile[tile.length - 1].x = j*64;
            tile[tile.length - 1].y = i*64;
            tile[tile.length - 1].width = 64;
            tile[tile.length - 1].height = 64;
            stage.addChild(tile[tile.length - 1]);
        }
    }
    //make BG dynamically
    //make map for left side
    var init = new Array();
    if (player == 0)
    {
        init[0] =  window.innerWidth*0.2;
    }else{
        init[0] =  window.innerWidth*0.8;
    }
    init[1] = makeCastle(init[0]);
    //make castle and assign the initial x
    makeRoads(init);    
    makeHuts(init);

    //render
    renderer.render(stage);
}
function makeSprite(x, y, sprite)
{
    var tmp = new PIXI.Sprite(PIXI.loader.resources["static/assets/main/"+sprite+".png"].texture);
    tmp.x = x;
    tmp.y = y;
    stage.addChild(tmp);
    return tmp;
}
function makeHuts(init)
{
    var huts = new Array();
    if(player == 0)
    {
        huts.push(makeSprite(init[0]+256+32,init[1]-256+32,"house"));
        spawn_pos[0] = huts[0].x; 
        spawn_pos[1] = huts[0].y - 43; 
        huts.push(makeSprite(init[0]+256+32,init[1]+256+32,"house"));
        spawn_pos[2] = huts[1].x; 
        spawn_pos[3] = huts[1].y - 43; 
    }else{
        huts.push(makeSprite(init[0]-384+32,init[1]-256+32,"house"));
        spawn_pos[0] = huts[0].x; 
        spawn_pos[1] = huts[0].y - 43; 
        huts.push(makeSprite(init[0]-384+32,init[1]+256+32,"house"));
        spawn_pos[2] = huts[1].x; 
        spawn_pos[3] = huts[1].y - 43; 
    }
}
function makeRoads(init)
{
    var roads = new Array();
    if(player == 0)
    {
        roads.push(makeSprite(init[0]+128,init[1],"lrTile"));
        roads.push(makeSprite(init[0]+256,init[1],"lSplit"));
        roads.push(makeSprite(init[0]+256,init[1]+128,"tbTile"));
        roads.push(makeSprite(init[0]+256,init[1]-128,"tbTile"));
        roads.push(makeSprite(init[0]+256,init[1]-256,"brTile"));
        roads.push(makeSprite(init[0]+256,init[1]+256,"trTile"));
        for(i=0;i<Math.ceil((window.innerWidth - init[0]+384)/128);i++)
        {
            roads.push(makeSprite(init[0]+384+(i*128),init[1]+256,"lrTile"));
            roads.push(makeSprite(init[0]+384+(i*128),init[1]-256,"lrTile"));
        }
    }else{
        roads.push(makeSprite(init[0]-256,init[1],"lrTile"));
        roads.push(makeSprite(init[0]-384,init[1],"rSplit"));
        roads.push(makeSprite(init[0]-384,init[1]-128,"tbTile"));
        roads.push(makeSprite(init[0]-384,init[1]+128,"tbTile"));
        roads.push(makeSprite(init[0]-384,init[1]+256,"ltTile"));
        roads.push(makeSprite(init[0]-384,init[1]-256,"lbTile"));
        for(i=0;i<Math.ceil((window.innerWidth - init[0]+512)/128);i++)
        {
            roads.push(makeSprite(init[0]-512-(i*128),init[1]+256,"lrTile"));
            roads.push(makeSprite(init[0]-512-(i*128),init[1]-256,"lrTile"));
        }
    }
}
function makeCastle(xInit)
{
    var center = window.innerHeight/2;
    var castle = new Array(2);
    castle[0] = new PIXI.Sprite(PIXI.loader.resources["static/assets/main/castle1.png"].texture);
    castle[0].y = center + (castle[0].height/2) - 64;
    if(player ==0)
    {
        castle[0].x = xInit + 5; 
    }else{
        castle[0].x = xInit - 128 -5; 
    }
    castle[1] = new PIXI.Sprite(PIXI.loader.resources["static/assets/main/castle2.png"].texture);
    castle[1].y = castle[0].y - castle[1].height; 
    if(player == 0)
    {
        castle[1].x = xInit + 5 ;
    }else{
        castle[1].x = xInit - 128 -5;
    }
    stage.addChild(castle[0]);
    stage.addChild(castle[1]);
    return castle[0].y - 30;   
}

//GAME LOOP GOODNESS
gameLoop();
function gameLoop()
{
    requestAnimationFrame(gameLoop);
    renderer.render(stage);
    // units[0].x = units[0].x + 1;
    units.forEach(function(unit) { unit.x = unit.x + 1; });
}
function spawn()
{
    units.push(makeSprite(spawn_pos[0],spawn_pos[1], 'units/worker1'));
}
