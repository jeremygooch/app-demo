var container, stats, controls, gui;
var camera, scene, renderer, loader, clock, light;
var skinnedMesh, animation, groundMaterial, planeGeometry;
var smartphone;

init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );




    window.addEventListener( 'start-animation', onStartAnimation );
    // window.addEventListener( 'stop-animation', onStopAnimation );
    window.addEventListener( 'pause-animation', onPauseAnimation );
    // window.addEventListener( 'step-animation', onStepAnimation );
    // window.addEventListener( 'weight-animation', onWeightAnimation );
    // window.addEventListener( 'crossfade', onCrossfade );
    // window.addEventListener( 'warp', onWarp );
    // window.addEventListener( 'toggle-show-skeleton', onShowSkeleton );
    // window.addEventListener( 'toggle-show-model', onShowModel );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 0, 10 ); // (z/depth, y/up-down, x/left-right)

    scene = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor( 0x142400 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    light = new THREE.HemisphereLight( 0xfafff6, 0x142400, 1 );
    light.position.set( - 80, 500, 50 );
    scene.add( light );

    // loader.load( './models/skinned/simple/simple.json', function ( geometry, materials ) {

    // 	for ( var k in materials ) {
    // 	    materials[k].skinning = true;
    // 	}

    // 	skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    // 	skinnedMesh.scale.set( 1, 1, 1 );

    // 	gui = new BlendCharacterGui(skinnedMesh.animations);
	
    // 	scene.add( skinnedMesh );
    // 	animation = new THREE.Animation( skinnedMesh, skinnedMesh.geometry.animations[ 0 ] );

    // 	animation.play();

    // });

    var set = [
	'background',
	'phone',
	'base',
	'support',
	'wallBack',
	'wallLeft'
    ];

    for (var i=0; i<set.length; i++) {
	loader.load( "js/json/" + set[i] + ".json",  addElmentToScene);
    }
    
    // loader.load( "models/skinned/simple/simple3.json", createPhone );
    // loader.load( "models/skinned/simple/base.json", createBase );

    // blendMesh = new THREE.BlendCharacter();
    // blendMesh.load( "models/skinned/simple/simple3.json" );


    

    // loader.load( './models/skinned/simple/simple2.json', function ( geometry, materials ) {

    // 	for ( var k in materials ) {
    // 	    materials[k].skinning = true;
    // 	}

    // 	smartphone = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    // 	smartphone.scale.set( 1, 1, 1 );

    // 	scene.add( smartphone );
    // 	animation = new THREE.Animation( smartphone, smartphone.geometry.animations[ 0 ] );

    // 	animation.play();

    // });

}

// function start() {

//     blendMesh.rotation.y = Math.PI * -135 / 180;
//     scene.add( blendMesh );

//     var aspect = window.innerWidth / window.innerHeight;
//     var radius = blendMesh.geometry.boundingSphere.radius;

//     camera = new THREE.PerspectiveCamera( 45, aspect, 1, 10000 );
//     camera.position.set( 0.0, radius, radius * 3.5 );

//     controls = new THREE.OrbitControls( camera );
//     controls.target.set( 0, radius, 0 );
//     controls.update();

//     // Set default weights

//     blendMesh.animations[ 'idle' ].weight = 1 / 3;
//     blendMesh.animations[ 'walk' ].weight = 1 / 3;
//     blendMesh.animations[ 'run' ].weight = 1 / 3;

//     gui = new BlendCharacterGui(blendMesh.animations);

//     // Create the debug visualization

//     helper = new THREE.SkeletonHelper( blendMesh );
//     helper.material.linewidth = 3;
//     scene.add( helper );

//     helper.visible = false;

//     animate();
// }


function addElmentToScene( geometry, materials ) {
    materials[ 0 ].shading = THREE.FlatShading;

    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    scene.add( mesh );

}

// function createBase( geometry, materials ) {
//     materials[ 0 ].shading = THREE.FlatShading;

//     mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
//     scene.add( mesh );

// }

function animate() {
    requestAnimationFrame( animate );
    THREE.AnimationHandler.update( clock.getDelta() );

    controls.update();

    render();
    stats.update();

}

function onStartAnimation(e) { animation.play(); }
function onPauseAnimation(e) { animation.stop(); };

function render() {

    renderer.render( scene, camera );

}
