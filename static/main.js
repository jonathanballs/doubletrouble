//setup
var player = 0;
var gamestate;
var units = new Array();
var spawn_pos = new Array();
var hud = new Array();
var buttons = new Array();
var renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {antialias:false, transparent:false, resolution:1});
var stage = new PIXI.Container();
//start();
function start(input)
{
player = input;
var bodyRef = document.body;
bodyRef.innerHTML = "";
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
    .add("static/assets/main/details/detail1.png")
    .add("static/assets/main/details/detail2.png")
    .add("static/assets/main/details/detail3.png")
    .add("static/assets/main/details/detail4.png")
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
    makeHud(); 
    makeButtons();

    buttons.forEach(function(item){stage.addChild(item)});

    //render
    renderer.render(stage);
    //Keyboard handling 
    var keyQ = keyboard(81);
    var keyW = keyboard(87);
    var keyE = keyboard(69);
    // var keyR = keyboard(82);
    keyQ.press = function() {
        console.log("train Worker");
        spawn(0,0);
    };
    keyW.press = function() {
        console.log("train soldier");
        spawn(0,1);
    };
    keyE.press = function() {
        console.log("train wizard");
        spawn(0,2);
    };
}
function makeHud()
{
    if(player == 0)
    {
        hud[1] = new PIXI.Text("Moneyz:1000", {font:"20px sans-serif", fill:"black"});
        hud[1].position.set(20,20);
        hud[0] = new PIXI.Graphics();
        hud[0].beginFill("0xdddddd");
        hud[0].drawRect(0,0,window.innerWidth * 0.18, window.innerHeight);
        hud[0].endFill();
        hud[0].alpha = 0.4;
        hud.forEach(function(item){stage.addChild(item)});
    }else{
        hud[1] = new PIXI.Text("Moneyz:1000", {font:"20px sans-serif", fill:"black"});
        hud[1].position.set(window.innerWidth -hud[1].width - 20,20);
        hud[0] = new PIXI.Graphics();
        hud[0].beginFill("0xdddddd");
        hud[0].drawRect(window.innerWidth - (window.innerWidth * 0.18),window.innerWidth * 0.18, window.innerHeight);
        hud[0].endFill();
        hud[0].alpha = 0.4;
        hud.forEach(function(item){stage.addChild(item)});

    }
    
}
function makeButtons()
{
    buttons[2] = new PIXI.Text("Q", {font:"30px sans-serif", fill:"black"});
    buttons[2].position.set(35,85);
    buttons[1] = makeSprite(20, 70, 'units/worker' + (player +1));
    buttons[0] = new PIXI.Graphics();
    buttons[0].beginFill("0xdddddd");
    buttons[0].drawRect(20,70,128,128);
    buttons[0].endFill();
    buttons[0].alpha = 0.35;
    buttons[5] = new PIXI.Text("W", {font:"30px sans-serif", fill:"black"});
    buttons[5].position.set(35,223);
    buttons[4] = makeSprite(20, 208, 'units/soldier' + (player +1));
    buttons[3] = new PIXI.Graphics();
    buttons[3].beginFill("0xdddddd");
    buttons[3].drawRect(20,208,128,128);
    buttons[3].endFill();
    buttons[3].alpha = 0.35;
    buttons[8] = new PIXI.Text("E", {font:"30px sans-serif", fill:"black"});
    buttons[8].position.set(35,356);
    buttons[7] = makeSprite(20, 346, 'units/wizard' + (player +1));
    buttons[6] = new PIXI.Graphics();
    buttons[6].beginFill("0xdddddd");
    buttons[6].drawRect(20,346,128,128);
    buttons[6].endFill();
    buttons[6].alpha = 0.35;
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
        spawn_pos[0] = huts[0].x - 30; 
        spawn_pos[1] = huts[0].y - 43; 
        huts.push(makeSprite(init[0]-384+32,init[1]+256+32,"house"));
        spawn_pos[2] = huts[1].x - 30; 
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
        for(i=0;i<Math.ceil((window.innerWidth - init[0]+800)/128);i++)
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
    //destroying units offscreen
    units.forEach(function(unit) { if(unit.x > innerWidth +128) 
        { 
            units.splice(units.indexOf(unit),1);
            stage.removeChild(unit);
            console.log("unit destroyed in order to free memory");
        } });
    units.forEach(function(unit) { unit.x++});

}
function spawn(pos,unit)
{
    var spawns = ['worker', 'soldier', 'wizard'];
    if (pos == 0)
    {
        units.push(makeSprite(spawn_pos[0],spawn_pos[1], 'units/'+spawns[unit]+ (player + 1)));
    }
    else
    {
        units.push(makeSprite(spawn_pos[2],spawn_pos[3], 'units/'+spawns[unit]+ (player + 1)));
    }
    
}
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

//Socket.io stuff
socket.on('gamestate', function(data)
        {
            gamestate = data;
            console.log(gamestate);
        });

