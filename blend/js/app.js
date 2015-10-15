
var container, stats, controls;
var camera, scene, renderer, loader, clock, light;
var skinnedMesh, animation, groundMaterial, planeGeometry;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 10, 0, 10 ); // (z/depth, y/up-down, x/left-right)

    scene = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor( 0x777777 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    // groundMaterial = new THREE.MeshPhongMaterial( { emissive: 0xbbbbbb } );
    // planeGeometry = new THREE.PlaneBufferGeometry( 16000, 16000 );
    // ground = new THREE.Mesh( planeGeometry, groundMaterial );
    // ground.position.set( 0, -5, 0 );
    // ground.rotation.x = -Math.PI/2;
    // scene.add( ground );

    light = new THREE.HemisphereLight( 0xffffff, 0x003300, 1 );
    light.position.set( - 80, 500, 50 );
    scene.add( light );

    loader.load( './models/skinned/simple/simple.json', function ( geometry, materials ) {

	for ( var k in materials ) {

	    materials[k].skinning = true;

	}

	skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
	skinnedMesh.scale.set( 1, 1, 1 );

	
	scene.add( skinnedMesh );
	animation = new THREE.Animation( skinnedMesh, skinnedMesh.geometry.animations[ 0 ] );

	animation.play();

    });

}

function animate() {

    requestAnimationFrame( animate );

    THREE.AnimationHandler.update( clock.getDelta() );

    controls.update();

    render();
    stats.update();

}

function render() {

    renderer.render( scene, camera );

}