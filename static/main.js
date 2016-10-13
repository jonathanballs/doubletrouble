//setup
var playerSide = 0
var gameOverScene;
var player;
var gamestate;
var units = new Array();
var spawn_pos = new Array();
var hud = new Array();
var laneInfo1;
var laneInfo2;
var renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {antialias:false, transparent:false, resolution:1});
var stage = new PIXI.Container();
var laneIndexSelected = 0;
var msg;
var msg2;
var timer = 0;

// Call this to start the game
function start(pside)
{
    playerSide = pside;
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
        .add("static/assets/main/coin.png")
        .add("static/assets/main/heart.png")
        .add("static/assets/main/arrow.png")
        .load(setup);
}

function setup()
{
    // Generate Background automatically
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

    var init = new Array();
    if (playerSide == 0)
    {
        init[0] =  window.innerWidth*0.2;
    }else{
        init[0] =  window.innerWidth*0.8;
    }
    init[1] = makeCastle(init[0]);
    //make castle and assign the initial x
    makeRoads(init);    
    makeHuts(init);

    // Create Hud
    hud = new Hud();
    hud.addUnitButton("worker", "Q", 50);
    hud.addUnitButton("soldier", "W", 25);
    hud.addUnitButton("wizard", "E", 250);
    hud.paint();

    // Create lane information
    laneInfo0 = new LaneInfo(0, spawn_pos[0], spawn_pos[1]);
    laneInfo0.paint();
    laneInfo1 = new LaneInfo(1, spawn_pos[2], spawn_pos[3]);
    laneInfo1.paint();

    //render
    renderer.render(stage);
    //Keyboard handling 
    var keyQ = keyboard(81);
    var keyW = keyboard(87);
    var keyE = keyboard(69);
    var keyJ = keyboard(74);
    var keyK = keyboard(75);
    var keyUp = keyboard(38);
    var keyDown = keyboard(40);
    // var keyR = keyboard(82);
    keyQ.press = function() {
        console.log("train Worker");
        spawn(0);
    };
    keyW.press = function() {
        console.log("train soldier");
        spawn(1);
    };
    keyE.press = function() {
        console.log("train wizard");
        spawn(2);
    };
    keyJ.press =
    keyDown.press = function() {
        if (laneIndexSelected == 0)
            laneIndexSelected = 1;
    };
    keyK.press =
    keyUp.press = function() {
        if (laneIndexSelected == 1)
            laneIndexSelected = 0;
    };
    msg = new PIXI.Text("Game",{font:"100px sans-serif", fill:"white"});
    msg.x = window.innerWidth - msg.width/2 - 50;
    if(playerSide)
    {
        msg.text = "Over";
        msg.x = 50 + msg.width/2;
    }
    msg.anchor.set(0.5,0.5);
    msg.y = 200;
    msg.visible = false;
    stage.addChild(msg);
    msg2 = new PIXI.Text("You won",{font:"30px sans-serif", fill:"white"});
    msg2.anchor.set(0.5,0.5);
    msg2.x = window.innerWidth/2;
    msg2.y = 300;
    msg2.visible = false;
    stage.addChild(msg2);
    gameLoop();
}


class LaneInfo {
    constructor(hutNum, hutX, hutY) {
        this.hutNum = hutNum;

        var iconHeight = 32
        var iconPadding = playerSide ? 40 : -40;
        var iconStartX = hutX + (playerSide ? 84: 0);
        var iconStartY = hutY + 24;

        if (playerSide)
            hutX += 30;

        // Heart icon
        this.heartIcon = makeSprite(0, 0, "heart");
        this.heartIcon.anchor.set(0.5, 0.5);
        this.heartIcon.position.set(iconStartX + iconPadding, iconStartY + 48);
        this.heartIcon.height = iconHeight;
        this.heartIcon.width = iconHeight;

        // Heart value
        this.heartText = new PIXI.Text("0", {font:"20px sans-serif", fill:"black"});
        this.heartText.anchor.set(0.5, 0.5);
        this.heartText.position.set(this.heartIcon.position.x + 2, // slight offset
                this.heartIcon.position.y + this.heartIcon.height);

        // Worker icon
        this.workerIcon = makeSprite(0, 0, "units/worker" + (playerSide + 1));
        this.workerIcon.anchor.set(0.5, 0.5);
        this.workerIcon.position.set(iconStartX + (2*iconPadding), iconStartY + 48);
        this.workerIcon.height = iconHeight * 3;//Weird whitespace issue with workers
        this.workerIcon.width = iconHeight * 3;

        // Workers value
        this.workerText = new PIXI.Text("0", {font:"20px sans-serif", fill:"black"});
        this.workerText.anchor.set(0.5, 0.5);
        this.workerText.position.set(this.workerIcon.position.x + 2, // slight offset
                this.workerIcon.position.y + this.heartIcon.height);

        // Lane selection arrow
        this.arrowIcon = makeSprite(0, 0, "arrow");
        this.arrowIcon.anchor.set(0.5, 0.5);
        this.arrowIcon.position.set(iconStartX + (4*iconPadding), iconStartY + 48);
        this.arrowIcon.height = iconHeight * 1.5;
        this.arrowIcon.width = iconHeight * 1.5;
        this.arrowIcon.rotation = playerSide ? 3.14159 : 0;
    }

    update() {
        this.workerText.text = player.lanes[this.hutNum].villagers;
        this.heartText.text = player.lanes[this.hutNum].health;
        this.arrowIcon.visible = laneIndexSelected == this.hutNum;
    }

    paint() {
        stage.addChild(this.heartIcon);
        stage.addChild(this.heartText);
        stage.addChild(this.workerIcon);
        stage.addChild(this.workerText);
    }
}


class Hud {

    constructor() {
        this.hudPadding = 20;
        this.hudWidth = 168; // 128 + padding
        this.hudStartX = playerSide ? window.innerWidth - this.hudWidth : 0;

        // Background
        var bg = new PIXI.Graphics();
        bg.beginFill("0xdddddd");
        bg.drawRect(this.hudStartX, 0, this.hudWidth, window.innerHeight);
        bg.endFill();
        bg.alpha = 0.4; // slight transparency
        this.background = bg;

        // Money counter
        this.moneyCounter = new PIXI.Text("0", {font:"20px sans-serif", fill:"black"});
        this.coinIcon = makeSprite(0, 0, "coin");
        this.coinIcon.position.set(this.hudStartX + this.hudPadding, this.hudPadding);
        this.coinIcon.width = this.moneyCounter.height;
        this.coinIcon.height = this.moneyCounter.height;
        this.moneyCounter.position.set(this.coinIcon.position.x + this.coinIcon.width + 10,
                this.coinIcon.position.y);

        // Buttons
        this.buttons = new Array();
    }

    paint() {
        [this.background, this.coinIcon, this.moneyCounter].forEach(
                function(item){stage.addChild(item)}
                );
        this.buttons.forEach(function(button) {
            stage.addChild(button.btn);
            stage.addChild(button.sprite);
            stage.addChild(button.text);
            stage.addChild(button.price);
            stage.addChild(button.coin);
        });
    }

    update() {
        this.moneyCounter.text = Math.floor(player.money);
    }

    addUnitButton(unitName, shortcutKey, unitPrice) {

        var buttonWidth = 128;
        var buttonHeight = 128;
        var buttonPadding = 10;

        var buttonStartX = this.hudStartX + this.hudPadding;
        var buttonStartY = this.moneyCounter.position.y + this.moneyCounter.height + this.hudPadding + (this.buttons.length * (buttonHeight + this.hudPadding));

        // Create button
        var button = new PIXI.Graphics();
        button.beginFill("0xdddddd");
        button.drawRect(buttonStartX, buttonStartY,128,128);
        button.endFill();
        button.alpha = 0.35;

        // Create sprite
        var buttonSprite = makeSprite(buttonStartX, buttonStartY-5, 'units/'+ unitName + (playerSide +1));

        // Create shorcut key text
        var shortcutText = new PIXI.Text(shortcutKey, {font:"20px sans-serif", fill:"grey"});
        shortcutText.position.set(buttonStartX+buttonPadding, buttonStartY+buttonPadding);

        // Create price
        var priceText = new PIXI.Text(unitPrice, {font:"20px sans-serif", fill:"grey"});
        var coinIcon = makeSprite(0, 0, "coin");
        coinIcon.position.set(buttonStartX+buttonPadding,
                buttonStartY+buttonHeight-buttonPadding-priceText.height);
        coinIcon.width = priceText.height; // Slightly smaller
        coinIcon.height = priceText.height;
        priceText.position.set(coinIcon.position.x+coinIcon.width+5, coinIcon.position.y);

        this.buttons.push({btn: button, sprite: buttonSprite, text: shortcutText, coin: coinIcon, price: priceText});
    }
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
    if(playerSide == 0)
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
    if(playerSide == 0)
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
    if(playerSide ==0)
    {
        castle[0].x = xInit + 5; 
    }else{
        castle[0].x = xInit - 128 -5; 
    }
    castle[1] = new PIXI.Sprite(PIXI.loader.resources["static/assets/main/castle2.png"].texture);
    castle[1].y = castle[0].y - castle[1].height; 
    if(playerSide == 0)
    {
        castle[1].x = xInit + 5 ;
    }else{
        castle[1].x = xInit - 128 -5;
    }
    var name = new PIXI.Text(player.name,{font:"20px sans-serif", fill:"black"});
    if(player.name == "")
        name.text = "The Biene";
    name.anchor.set(0.5,0.5);
    name.x = castle[1].x + 64;
    name.y = castle[1].y + 32;
    
    stage.addChild(name);
    stage.addChild(castle[0]);
    stage.addChild(castle[1]);
    return castle[0].y - 30;   
}

//GAME LOOP GOODNESS
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
    //update Money counter
    hud.update();
    laneInfo0.update();
    laneInfo1.update();

    if (timer != 0)
    {
        timer--;
    } 

    draw();

}
function spawn(unit)
{
    if(timer == 0) 
    {
        var spawns = ['worker', 'soldier', 'wizard'];
        socket.emit('spawn', { lane:laneIndexSelected, type:spawns[unit]});
        timer == 6000;
    }
    else
    {
        console.log("Timer is currently on " + timer);
    }
}
function draw()
{
    if(playerSide == 0)
    {
        var lanes = gamestate.playerLeft.lanes;
        var opLanes = gamestate.playerRight.lanes;
        var oPlayer = 2;
    }else{
        var lanes = gamestate.playerRight.lanes;
        var opLanes = gamestate.playerLeft.lanes;
        var oPlayer = 1;
    }
    units.forEach(function(unit) {
            units.splice(units.indexOf(unit),1);
            stage.removeChild(unit);
            })
    lanes[0].units.forEach(function(unit)
            {
                var ends = [renderer.width,spawn_pos[0]];
                if(playerSide == 0)
                {
                    var spawn = [spawn_pos[0]+64,renderer.width];
                    if(unit.progress < 50)
                    {
                        units.push(makeSprite(spawn[0] + (ends[0]-spawn[0])*(unit.progress/50),spawn_pos[1]+64,"units/"+ unit.type +(playerSide+1)));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }else{
                    var spawn = [spawn_pos[0],renderer.width];
                    if(unit.progress <50)
                    {
                        units.push(makeSprite(spawn[0]-(spawn[0])*(unit.progress / 50),spawn_pos[1]+64,"units/" + unit.type + (playerSide+1)));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }
            });
    opLanes[0].units.forEach(function(unit)
            {
                var spawn = [spawn_pos[0]+128,renderer.width];
                var ends = [renderer.width,spawn_pos[0]];
                if(playerSide == 0)
                {
                    if(unit.progress > 50)
                    {
                        units.push(makeSprite(spawn[1] - (spawn[1]-ends[1])*((unit.progress - 50)/50),spawn_pos[1]+64,"units/"+ unit.type +oPlayer));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }else{
                    if(unit.progress > 50)
                    {
                        units.push(makeSprite((ends[1])*((unit.progress-50)/50),spawn_pos[1]+64,"units/"+ unit.type +oPlayer));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }
            })
    lanes[1].units.forEach(function(unit)
            {
                var ends = [renderer.width,spawn_pos[0]];
                if(playerSide == 0)
                {
                    var spawn = [spawn_pos[0]+64,renderer.width];
                    if(unit.progress < 50)
                    {
                        units.push(makeSprite(spawn[0] + (ends[0]-spawn[0])*(unit.progress/50),spawn_pos[3]+64,"units/"+ unit.type +(playerSide+1)));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }else{
                    var spawn = [spawn_pos[0],renderer.width];
                    if(unit.progress <50)
                    {
                        units.push(makeSprite(spawn[0]-(spawn[0])*(unit.progress / 50),spawn_pos[3]+64,"units/" + unit.type + (playerSide+1)));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }
            });
    opLanes[1].units.forEach(function(unit)
            {
                var spawn = [spawn_pos[0]+128,renderer.width];
                var ends = [renderer.width,spawn_pos[0]];
                if(playerSide == 0)
                {
                    if(unit.progress > 50)
                    {
                        units.push(makeSprite(spawn[1] - (spawn[1]-ends[1])*((unit.progress - 50)/50),spawn_pos[3]+64,"units/"+ unit.type +oPlayer));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }else{
                    if(unit.progress > 50)
                    {
                        units.push(makeSprite((ends[1])*((unit.progress-50)/50),spawn_pos[3]+64,"units/"+ unit.type +oPlayer));
                        units[units.length-1].anchor.set(0.5,0.5);
                    }
                }
            })

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
function gameOver(winner)
{
    msg.visible = true;
    if(winner == playerSide)
        msg2.visible = true;
    document.body.className = 'gray';
}
// function resizeStage()
// {
//     buttons.forEach(function(bt){bt.destroy();});
//     var init = new Array();
//     if (player == 0)
//     {
//         init[0] =  window.innerWidth*0.2;
//     }else{
//         init[0] =  window.innerWidth*0.8;
//     }
//     init[1] = makeCastle(init[0]);
//     //make castle and assign the initial x
//     makeRoads(init);    
//     makeHuts(init);
//     // (); 
//     // makeButtons();

//     buttons.forEach(function(item){stage.addChild(item)});
// }

//Socket.io stuff
socket.on('gamestate', function(data)
        {
            gamestate = data.gamestate;
            player =  playerSide ? data.gamestate.playerRight : data.gamestate.playerLeft;
        });
socket.on('gameend', function(data)
        {
            gameOver(data.winner);
        });

