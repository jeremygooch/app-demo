var container, stats, controls;
var camera, webglScene, cssScene, webglRenderer, cssRenderer, loader, clock, light;

init();
animate();

function init() {
    /* *********************************************************
     * WebGL Scene Setup
     ********************************************************* */
    container = document.querySelector('.phoneContainer');

    webglScene = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;

    /* Create the renderer and add it to the container */
    webglRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    webglRenderer.setClearColor( 0x142400 );
    webglRenderer.setPixelRatio( window.devicePixelRatio );
    webglRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild( webglRenderer.domElement );


    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 10000 );
    camera.position.set( 600, 0, 400 ); // (z/depth, y/up-down, x/left-right)

    controls = new THREE.OrbitControls( camera );
    // Constrict the amount of movement the camera can do
    controls.minDistance	= 250; // Zoom In
    controls.maxDistance	= 1050; // Zoom Out
    controls.minPolarAngle	= Math.PI/2.5; // Vertical Rotate Up
    controls.maxPolarAngle	= Math.PI/2; // Vertical Rotate Down
    controls.minAzimuthAngle	= 0; // Horizontal Rotate Left
    controls.maxAzimuthAngle	= Math.PI/2.05; // Horizonal Rotate Right

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    light = new THREE.HemisphereLight( 0xfafff6, 0x142400, 1.6 );
    light.position.set( - 80, 500, 50 );
    webglScene.add( light );

    var set = [
	'background',
	'phone',
	'bench'
    ];

    for (var i=0; i<set.length; i++) {
	loader.load( "js/json/" + set[i] + ".json",  addElmentToScene);
    }
    
    /* *********************************************************
     * CSS Scene Setup
     ********************************************************* */
    
    cssScene = new THREE.Scene();
    
    element = document.createElement('div');
    element.className = 'three-div';
    
    /* Turn the div into a three.js oject */
    div = new THREE.CSS3DObject(element);
    div.position.x = 0;
    div.position.y = 0;
    div.position.z = -5;

    div.rotation.y = Math.PI/2;
    cssScene.add(div);
    
    /* Create the renderer and add it to the container */
    cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(container.clientWidth, container.clientHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    document.body.appendChild(cssRenderer.domElement);
}

function addElmentToScene( geometry, materials ) {
    materials[ 0 ].shading = THREE.FlatShading;
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
    // Increase the size since CSS will be at a much larger scale
    mesh.scale.set(55,55,55);
    webglScene.add( mesh );

}

function animate() {
    requestAnimationFrame( animate );
    THREE.AnimationHandler.update( clock.getDelta() );

    render();
    stats.update();
    controls.update();
}

function render() {
    cssRenderer.render(cssScene, camera);
    webglRenderer.render( webglScene, camera );

}
