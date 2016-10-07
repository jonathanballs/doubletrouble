//create renderer
var bodyRef = document.body;
var renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, {antialias:false, transparent:false, resolution:1});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
renderer.render(stage);

function reRender()
{
    renderer.resize(bodyRef.clientWidth,window.innerHeight);
}
