var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var clock = new THREE.Clock();


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// Create a light, set its position, and add it to the scene.
var light = new THREE.PointLight(0xffffff);
light.position.set(-100,200,100);
scene.add(light);

// Load in the mesh and add it to the scene.
// var loader = new THREE.JSONLoader();
blendMesh = new THREE.BlendCharacter();
blendMesh.load( "3d/animCipher.js", start );

var animation;
// loader.load( "3d/animCipher.json", function(geometry, material){
//     console.dir(THREE);
//     material = new THREE.MeshLambertMaterial(material);
//     // var material = new THREE.MeshLambertMaterial({color: 0x55B663});
//     mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     // add animation data to the animation handler
//     // THREE.AnimationHandler.add(mesh.geometry.animation);
//     // console.dir(mesh);
//     // THREE.Animation(mesh.geometry.animations[0]);

//     // create animation
//     animation = new THREE.Animation(
// 	mesh,
// 	geometry.animations[0]
// 	// 'ArmatureAction',
// 	// THREE.AnimationHandler.CATMULLROM
//     );

//     // play the anim
//     // animation.play();

//     render();
// });
render();

function render() {
    // animation.update(.01);
    var delta = 0.75 * clock.getDelta();
    THREE.AnimationHandler.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


camera.position.z = 5;

// Add OrbitControls so that we can pan around with the mouse.
controls = new THREE.OrbitControls(camera, renderer.domElement);

// var render = function () {
//     requestAnimationFrame( render );

//     // mesh.rotation.x += 0.1;
//     // mesh.rotation.y += 0.1;

//     renderer.render(scene, camera);
// };

// render();
