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
    webglRenderer.setClearColor(0x267c9c);
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(webglRenderer.domElement);

    /* Create and position the camera */
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.set( 500, 0, 300 ); // (z/depth, y/up-down, x/left-right)

    /* Setup the input controls and constrict their movement accordingly */
    controls = new THREE.OrbitControls( camera, webglRenderer.domElement );
    controls.minDistance	= 500; // Zoom In
    controls.maxDistance	= 750; // Zoom Out
    // controls.minPolarAngle	= Math.PI/2; // Vertical Rotate Up
    controls.maxPolarAngle	= Math.PI/2; // Vertical Rotate Down
    // controls.minAzimuthAngle	= 0; // Horizontal Rotate Left
    // controls.maxAzimuthAngle	= Math.PI/2.05; // Horizonal Rotate Right

    /* Add Stats to the project */
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    /* Create and add the lights*/
    light = new THREE.HemisphereLight( 0xffffff, 0x23799a, 1.6 );
    light.position.set( - 80, 500, 50 );
    webglScene.add( light );

    var set = ['smartphone','floor'];

    for (var i=0; i<set.length; i++) {
	loader.load( "js/json/" + set[i] + ".json",  addElmentToScene);
    }

    // webglScene.fog = new THREE.FogExp2( 0x267c9c, 0.00095 );

    // console.log(webglScene);
    // camera.lookAt(objects.normal.webglScene.position);
    
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
    cssRenderer.setSize( container.clientWidth, container.clientHeight );
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    document.body.appendChild(cssRenderer.domElement);

    /* Set all the sizes initially and on resize*/
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    webglRenderer.setSize(container.clientWidth, container.clientHeight);
    cssRenderer.setSize(container.clientWidth, container.clientHeight);
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