var container, stats, controls, gui;
var camera, scene, renderer, renderer2, loader, clock, light;
var skinnedMesh, animation, groundMaterial, planeGeometry;
var smartphone;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;



    


    window.addEventListener( 'start-animation', onStartAnimation );
    window.addEventListener( 'pause-animation', onPauseAnimation );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 0, 10 ); // (z/depth, y/up-down, x/left-right)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor( 0x142400 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera );
    // Constrict the amount of movement the camera can do
    controls.maxDistance	= 28;
    controls.minPolarAngle	= Math.PI/3;
    controls.maxPolarAngle	= Math.PI/2;
    controls.minAzimuthAngle	= .000001;
    controls.maxAzimuthAngle	= Math.PI/1.65

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    light = new THREE.HemisphereLight( 0xfafff6, 0x142400, 1.6 );
    light.position.set( - 80, 500, 50 );
    scene.add( light );

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
    
    // /////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////
    
    //CSS3D Scene
    scene2 = new THREE.Scene();
    
    //HTML
    element = document.createElement('div');
    // element.innerHTML = 'Plain text inside a div.';
    element.className = 'three-div';
    
    //CSS Object
    div = new THREE.CSS3DObject(element);
    div.position.x = 0;
    div.position.y = 0;
    div.position.z = -5;
    div.rotation.y = Math.PI/2;
    scene2.add(div);
    
    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);
}

function addElmentToScene( geometry, materials ) {
    materials[ 0 ].shading = THREE.FlatShading;

    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    scene.add( mesh );

}

function animate() {
    requestAnimationFrame( animate );
    THREE.AnimationHandler.update( clock.getDelta() );

    render();
    stats.update();
    controls.update();
}

function onStartAnimation(e) { animation.play(); }
function onPauseAnimation(e) { animation.stop(); };

function render() {
    renderer2.render(scene2, camera);
    renderer.render( scene, camera );

}
