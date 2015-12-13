var container, stats, controls;
var camera, sceneGL, sceneCSS, rendererGL, rendererCSS, loader, clock, light;
var beginFeatureAnim = {}, featureDelay = 1500;
var features = ['security', 'performance', 'open'];
var globals = {};
hideCanvas();
init();

var launchAnim = function (start) {
    if (start) {
	showCanvas(function() {
	    initAnim();
	    onReplay();
	});
    }
};

function init() {
    container = document.querySelector('.phoneContainer');

    /* *********************************************************
     * CSS Scene Setup
     ********************************************************* */
    sceneCSS = new THREE.Scene();
    constructCSS();
    
    /* Create the renderer and add it to the container */
    rendererCSS = new THREE.CSS3DRenderer();
    rendererCSS.setSize( container.clientWidth, container.clientHeight );
    rendererCSS.domElement.style.position = 'absolute';
    rendererCSS.domElement.style.top = 0;
    rendererCSS.domElement.className += ' css3dobject';

    document.body.appendChild(rendererCSS.domElement);
    

    /* *********************************************************
     * WebGL Scene Setup
     ********************************************************* */
    sceneGL = new THREE.Scene();
    loader = new THREE.JSONLoader();
    clock = new THREE.Clock;

    /* Create the renderer and add it to the container */
    rendererGL = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererGL.setClearColor(0x267c9c);
    rendererGL.setPixelRatio(window.devicePixelRatio);

    /* Add Stats to the project */
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    container.appendChild(rendererGL.domElement);

    var replayBtn = document.createElement('div'),
    docs = document.createElement('div');
    replayBtn.className = 'replayBtn';
    docs.className = 'docs';
    replayBtn.innerHTML = 'Replay Intro ->';
    docs.innerHTML = '# Drag the mouse to rotate scene';
    container.appendChild(docs);
    container.appendChild(replayBtn);

    replayBtn.addEventListener( 'click', onReplay, false );

    /* Create and position the camera */
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.set( 300, 0, -500 ); // (z/depth, y/up-down, x/left-right)

    /* Setup the input controls and constrict their movement accordingly */
    controls = new THREE.OrbitControls( camera, rendererCSS.domElement );


    // controls.minDistance	= 500; // Zoom In
    // controls.maxDistance	= 750; // Zoom Out
    // controls.minPolarAngle	= Math.PI/2; // Vertical Rotate Up
    controls.maxPolarAngle	= Math.PI/2; // Vertical Rotate Down
    // controls.minAzimuthAngle	= 1.25; // Horizontal Rotate Left
    // controls.maxAzimuthAngle	= 3.14; // Horizonal Rotate Right

    /* Create and add the lights*/
    light = new THREE.HemisphereLight( 0xffffff, 0x23799a, 1.6 );
    light.position.set( - 80, 500, 50 );
    sceneGL.add( light );

    var setGL = ['smartphone','floor'];

    for (var i=0; i<setGL.length; i++) {
	loader.load( "js/json/" + setGL[i] + ".json", addElementToScene);
    }


    
    // smooth the curve over this many points
    var numPoints = 50;
    globals.features = {};

    // Create the global objects from the features array
    for (var i=0; i<features.length; i++) {
	globals.features[features[i]] = {
	    spline: {},
	    line: {},
	    geometry: {}
	};
    }
    
    // Construct the spline, geometry, and line from the objects just created
    for (var key in globals.features) {
	var obj = globals.features[key];

	
	obj.geometry = new THREE.Geometry();
	var points = globals.features[key].spline.getPoints(numPoints);

	for(var i = 0; i < points.length; i++){
    	    obj.geometry.vertices.push(points[i]);
	}

	// Create a line material for assigning to the line geometry
	obj.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00f0 });
	obj.line = new THREE.Line(obj.geometry, obj.lineMaterial);

	// Hide the line
	if (key != 'open') {
	    // obj.line.material.opacity = 0;
	    // obj.line.material.transparent = true;
	    // obj.line.material.visible = false;
	}

	sceneGL.add(obj.line);
    }
    
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

function onReplay() {
    constructCSS(true);
};

function constructCSS(replay) {
    var setCSS = ['cmLoading','cmLoading_frames','security','performance','open'];

    /* Destroy all previous css elements */
    var selectedObj;
    for (var i=0; i<setCSS.length; i++){
	selectedObj = sceneCSS.getObjectByName(setCSS[i]);
	sceneCSS.remove(selectedObj);
    }

    /* Create new css elements*/
    var elm = [], div = {};    
    for (var i=0; i<setCSS.length; i++)  {
	elm[i] = document.createElement('div');
	elm[i].className = setCSS[i];

	/* Turn the div into a three.js oject */
	div[setCSS[i]] = new THREE.CSS3DObject(elm[i]);
	div[setCSS[i]].name = setCSS[i];

	div[setCSS[i]].position.x = 0;
	div[setCSS[i]].position.y = 10;
	div[setCSS[i]].position.z = 40;

	div[setCSS[i]].rotation.x = -Math.PI/1.09;

	if (setCSS[i] == 'security') { globals.security = div[setCSS[i]]; }
	else if (setCSS[i] == 'performance') { globals.performance = div[setCSS[i]]; }
	else if (setCSS[i] == 'open') { globals.open = div[setCSS[i]]; }

	sceneCSS.add(div[setCSS[i]]);
	animateCSS(setCSS[i], div, replay);
    }
}

function addElementToScene( geometry, materials  ) {
    materials[ 0 ].shading = THREE.FlatShading;
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );

    // Increase the size since CSS will be at a much larger scale
    mesh.scale.set(55,55,55);
    sceneGL.add(mesh);
}

function animateCSS(item, div, replay) {
    var speed = 950, delay = !replay ? 500 : 0;

    function beginAnimation(div) {
	div.element.style['-webkit-animation-duration']		= speed;
	div.element.style['animation-duration']			= speed;
	div.element.style['-webkit-animation-play-state']	= 'running';
	div.element.style['animation-play-state']		= 'running';
    }

    switch (item) {
    case "security":
	// Begin the security box slide out
	delay = delay - 650;
	var objName = 'security';
	if (replay) { beginFeatureAnim.security = false; } // reset the feature box animation
	setTimeout(function() {
	    beginAnimation(div[objName]);
	    setTimeout(function() {
		beginFeatureAnim.security = true;
	    	div[objName].element.className += ' security_animation';
	    }, featureDelay - 250);
	}, delay);
	
	break;
    case "performance":
	// Begin the performance box slide out
	delay = delay + 200;
	var objName = 'performance';
	if (replay) { beginFeatureAnim.performance = false; } // reset the feature box animation
	setTimeout(function() {
	    beginAnimation(div[objName]);
	    setTimeout(function() {
		beginFeatureAnim.performance = true;
	    	div[objName].element.className += ' performance_animation';
	    }, featureDelay + 20);
	}, delay);
	
	break;
    case "open":
	// Begin the performance box slide out
	delay = delay + 600;
	var objName = 'open';
	if (replay) { beginFeatureAnim.open = false; } // reset the feature box animation
	setTimeout(function() {
	    beginAnimation(div[objName]);
	    setTimeout(function() {
		beginFeatureAnim.open = true;
	    	div[objName].element.className += ' open_animation';
	    }, featureDelay + 220);
	}, delay);
	
	break;



	
    case "cmLoading_frames":
    	speed = speed + (speed/7);
	var objName = 'cmLoading_frames';
	var pos = {
	    moveStart:		{x:0, y:-30, z:10},
	    moveFinish:		{x:0, y:-30, z:-45},
	};
	
	setTimeout(function() {
	    var update = {
		moveOut:	function(){ div[item].position.z = pos.moveStart.z; }
	    };
	    var moveOut = new TWEEN.Tween(pos.moveStart).to(pos.moveFinish, speed)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(update.moveOut)
		.start();

	    beginAnimation(div[objName]);
	    setTimeout(function() {
	    	div[objName].element.className += ' cmLoading_frames_second';
	    },1000);
	}, delay);
	break;
    case "cmLoading":
	var objName = 'cmLoading';
	var pos = {
	    start: {x:0, y:-30, z:40},
	    finish: {x:0, y:-30, z:-40},
	    reverse: {x:0, y:-30, z:-20},
	    finale: {x:0, y:-30, z:-35}
	};
	
	setTimeout(function() {
	    var update = {
		flyOut:		function(){ div[item].position.z = pos.start.z; },
		reverse:	function(){ div[item].position.z = pos.finish.z; },
		finale:		function(){ div[item].position.z = pos.reverse.z; }
	    };

	    var flyOut	= new TWEEN.Tween(pos.start).to(pos.finish, speed)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(update.flyOut);

	    var reverse = new TWEEN.Tween(pos.finish).to(pos.reverse, speed/2)
		.easing(TWEEN.Easing.Cubic.InOut)
		.onUpdate(update.reverse);

	    var finale  = new TWEEN.Tween(pos.reverse).to(pos.finale, speed*3.5)
		.easing(TWEEN.Easing.Quadratic.Out)
		.yoyo(true)
		.repeat(Infinity)
		.onUpdate(update.finale);
	    
	    flyOut.chain(reverse.chain(finale)).start();
	    
	    beginAnimation(div[objName]);
	}, delay);
	break;
    default :
	break;
    };
}

function hideCanvas() {
    var el = document.createElement('div');
    el.className = 'sceneOverlay';
    var target = document.querySelector('.phoneContainer');

    target.parentElement.insertBefore(el, target);
}

function showCanvas(cb) {
    var target = document.querySelector('.sceneOverlay');
    target.className += ' fadeOut';
    // Clear the overlay after it's hidden
    setTimeout(function() {target.parentElement.removeChild(target); }, 150);

    if (typeof(cb) == "function") { cb(); }
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

    var locals = {
	// Due to the way this is built, there should be an object for each of the global splines.
	security	: { finalPos: -150 },
	performance	: { finalPos: -110 },
	open		: { finalPos: -110 }
    };


    // Find each spline on its path at this point in time, and assign it
    // to the equivlant cssobject
    var time = Date.now();
    var looptime = featureDelay;
    var t = ( time % looptime ) / looptime;

    for (var key in globals.features) {
	if (beginFeatureAnim[key]) {
	    // Grab the position of the spline at the proper point in time
	    locals[key].splinePos = globals.features[key].spline.getPointAt( t );
	    // Stop the animation after certain distance
	    if (locals[key].splinePos.z < locals[key].finalPos) { beginFeatureAnim[key] = false; }
	    // Update the css position
	    globals[key].position.copy( locals[key].splinePos );
	}
    }
}
