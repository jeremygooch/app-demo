var container, stats, controls;
var camera, sceneGL, sceneCSS, rendererGL, rendererCSS, loader, clock, light;

init();
initAnim();

function init() {
    /* *********************************************************
     * WebGL Scene Setup
     ********************************************************* */
    container = document.querySelector('.phoneContainer');

    sceneGL = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;

    /* Create the renderer and add it to the container */
    rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererGL.setClearColor(0x267c9c);
    rendererGL.setPixelRatio(window.devicePixelRatio);
    container.appendChild(rendererGL.domElement);

    /* Create and position the camera */
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.set( 300, 0, -500 ); // (z/depth, y/up-down, x/left-right)

    /* Setup the input controls and constrict their movement accordingly */
    controls = new THREE.OrbitControls( camera, rendererGL.domElement );
    // controls.minDistance	= 500; // Zoom In
    // controls.maxDistance	= 750; // Zoom Out
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
    sceneGL.add( light );

    var setGL = ['smartphone','floor'];

    for (var i=0; i<setGL.length; i++) {
	loader.load( "js/json/" + setGL[i] + ".json", addElementToScene);
    }

    // console.log(sceneGL);
    // camera.lookAt(objects.normal.sceneGL.position);
    
    /* *********************************************************
     * CSS Scene Setup
     ********************************************************* */
    
    sceneCSS = new THREE.Scene();

    var setCSS = ['cmLoading','cmLoading_frames'],
        elm = [], div = {};

    for (i=0; i<setCSS.length; i++)  {
	elm[i] = document.createElement('div');
	elm[i].className = setCSS[i];
	console.dir(elm[i]);
	/* Turn the div into a three.js oject */
	div[setCSS[i]] = new THREE.CSS3DObject(elm[i]);
	div[setCSS[i]].position.x = 0;
	div[setCSS[i]].position.y = -30;
	div[setCSS[i]].position.z = 40;

	div[setCSS[i]].rotation.x = -Math.PI/1.09;

	sceneCSS.add(div[setCSS[i]]);
	animateCSS(setCSS[i], div);
    }

    
    
    /* Create the renderer and add it to the container */
    rendererCSS = new THREE.CSS3DRenderer();
    rendererCSS.setSize( container.clientWidth, container.clientHeight );
    rendererCSS.domElement.style.position = 'absolute';
    rendererCSS.domElement.style.top = 0;
    // rendererCSS.domElement.appendChild(rendererGL.domElement);
    // document.querySelector('.phoneContainer').appendChild(rendererCSS.domElement);
    document.body.appendChild(rendererCSS.domElement);

    /* Set all the sizes initially and on resize*/
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    rendererGL.setSize(container.clientWidth, container.clientHeight);
    rendererCSS.setSize(container.clientWidth, container.clientHeight);
}

function addElementToScene( geometry, materials  ) {
    materials[ 0 ].shading = THREE.FlatShading;
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );

    // Increase the size since CSS will be at a much larger scale
    mesh.scale.set(55,55,55);
    sceneGL.add(mesh);
}

function animateCSS(item, div) {
    var position, target, tween,
        speed = 700, delay = 400;
    switch (item) {
    case "cmLoading_frames":
	target = {x:0, y:-30, z:-45};
    case "cmLoading":
	position = {x:0, y:-30, z:40};
	target = (target) ? target : {x:0, y:-30, z:-40};
	
	setTimeout(function() {
	    tween = new TWEEN.Tween(position).to(target, speed);

	    tween.onUpdate(function(){
		div[item].position.x = position.x;
		div[item].position.y = position.y;
		div[item].position.z = position.z;
	    });
	    div.cmLoading.element.style['-webkit-animation-duration'] = speed;
	    div.cmLoading.element.style['animation-duration'] = speed;
	    // Start the animation
	    div.cmLoading.element.style['-webkit-animation-play-state'] = 'running';
	    div.cmLoading.element.style['animation-play-state'] = 'running';

	    tween.start();
	}, delay);
    default :
	break;
    };
}

function initAnim() {
    requestAnimationFrame(initAnim);
    THREE.AnimationHandler.update( clock.getDelta() );

    render();
    stats.update();
    TWEEN.update();
    controls.update();
}

function render() {
    rendererCSS.render(sceneCSS, camera);
    rendererGL.render( sceneGL, camera );
}
