// Standard ThreeJS scene requires some global variables
var stats, controls;
var camera, sceneGL, rendererGL, loader, clock, light; // WebGL scene objects
var sceneCSS, rendererCSS; // CSS scene objects
var beginFeatureAnim = {}, featureDelay = 1500;
var globals = {
    features: {
	security:	{ spline: {}, line: {}, geometry: {} },
	performance:	{ spline: {}, line: {}, geometry: {} },
	open:		{ spline: {}, line: {}, geometry: {} },
	customizable:	{ spline: {}, line: {}, geometry: {} }
    },
    controls: {
	sceneChanged: false
    }
};

hideCanvas();
init();

var launchAnim = function () {
    // Clear the overlay on top of the scene
    var target = document.querySelector('.sceneOverlay');
    target.classList.add('fadeOut');

    // Since the object is overlapping the scene, remove it after the animation
    // so the underlying scene can be interacted with
    setTimeout(function() {
        target.parentElement.removeChild(target);
    }, 150);

    function initAnim() {
        requestAnimationFrame(initAnim);
        // Using the elapsed seconds since the last call to the clock update the animtion
        THREE.AnimationHandler.update( clock.getDelta() );

        render(); // Render the scene 

        // Update the stats, tweening and controls
        stats.update();
        TWEEN.update();
        controls.update();
    }
    initAnim(); // Initialize the animation

    constructCSS(true); // Create the various css elements
};

function init() {
    /*
     * This funciton is responsible for building and adding the various renderers and 3D
     * objects used in the scene. It also sets up eventlisteners for interaction as well as
     * resizing windows.
     */
    
    globals.container = document.querySelector('.phoneContainer');

    /* *********************************************************
     * CSS Scene Setup
     ********************************************************* */
    sceneCSS = new THREE.Scene();
    constructCSS();
    
    /* Create the renderer and add it to the container */
    rendererCSS = new THREE.CSS3DRenderer();
    rendererCSS.setSize( globals.container.clientWidth, globals.container.clientHeight );
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
    document.querySelector('.stats_container').appendChild(stats.domElement);

    globals.container.appendChild(rendererGL.domElement);

    /* Create and position the camera */
    camera = new THREE.PerspectiveCamera(45, globals.container.clientWidth / globals.container.clientHeight, 1, 10000);

    if (window.innerWidth < 650) {
	// (x, y, z)
	camera.position.set( 600, 0, -800 );
	rendererCSS.setSize( globals.container.clientWidth, globals.container.clientHeight * .95 );
    } else {
	camera.position.set( 150, 0, -400 );
    }
    

    /* Setup the input controls and constrict their movement accordingly */
    controls = new THREE.OrbitControls( camera, rendererCSS.domElement );
    controls.minPolarAngle	= 0; // Vertical Rotate Up
    controls.maxPolarAngle	= Math.PI/2; // Vertical Rotate Down


    /* Create and add the lights*/
    light = new THREE.HemisphereLight( 0xffffff, 0x23799a, 1.6 );
    light.position.set( - 80, 500, 50 );
    sceneGL.add( light );


    // Add the smartphone and floor (shadow) to the scene
    var setGL = ['smartphone','floor'];
    for (var i=0; i<setGL.length; i++) {
	loader.load( "js/json/" + setGL[i] + ".json", addElementToScene);
    }



    /* *********************************************************
     * Create and add the 4 splines to the scene
     ********************************************************* */    
    // smooth the curve over this many points
    var numPoints = 50;
    // Add New spline
    globals.features['security'].spline = new THREE.CatmullRomCurve3([
	// --------------(X,  Y,  Z)
        new THREE.Vector3(-5, 55, 0),		// Point 1
        new THREE.Vector3(-5, 60, -120),	// Point 2
        new THREE.Vector3(-5, 148, -155)	// Point 3
    ]);
    globals.features['performance'].spline = new THREE.CatmullRomCurve3([
	// --------------(X,  Y,  Z)
        new THREE.Vector3(0, -10, 0),		// Point 1
        new THREE.Vector3(5, 10, -120),		// Point 2
        new THREE.Vector3(15, 20, -155)		// Point 3
    ]);
    globals.features['open'].spline = new THREE.CatmullRomCurve3([
	// --------------(X,  Y,  Z)
        new THREE.Vector3(5, -15, 0),		// Point 1
        new THREE.Vector3(25, -30, -80),	// Point 2
        new THREE.Vector3(55, -115, -155)	// Point 3
    ]);
    globals.features['customizable'].spline = new THREE.CatmullRomCurve3([
	// --------------(X,  Y,  Z)
        new THREE.Vector3(-25, -15, 0),		// Point 1
        new THREE.Vector3(-75, -40, -120),	// Point 2
        new THREE.Vector3(-105, -110, -175)	// Point 3
    ]);

    globals.features['security'].lineMaterial=new THREE.LineBasicMaterial({ color: 0xf4a919 });
    globals.features['performance'].lineMaterial=new THREE.LineBasicMaterial({color:0x4a09db});
    globals.features['open'].lineMaterial = new THREE.LineBasicMaterial({ color: 0x20db09 });
    globals.features['customizable'].lineMaterial=new THREE.LineBasicMaterial({color:0xe01111});

    // Construct the spline, geometry, and line from the objects just created
    for (var key in globals.features) {
	var obj = globals.features[key];

	var points = globals.features[key].spline.getPoints(numPoints);

	obj.geometry = new THREE.Geometry();
	for(var i = 0; i < points.length; i++){
    	    obj.geometry.vertices.push(points[i]);
	}

	obj.line = new THREE.Line(obj.geometry, obj.lineMaterial);

	// Hide the line
	obj.line.material.opacity = 0;
	obj.line.material.transparent = true;
	obj.line.material.visible = false;

	sceneGL.add(obj.line);
    }


    
    /* *********************************************************
     * Additional elements and event listeners
     ********************************************************* */

    var replayBtn = document.createElement('div'),
    docs = document.createElement('div');
    replayBtn.className = 'replayBtn';
    docs.className = 'docs';
    replayBtn.innerHTML = 'Replay Intro ->';
    docs.innerHTML = '# Drag the mouse to rotate scene';
    globals.container.appendChild(docs);
    globals.container.appendChild(replayBtn);

    document.querySelector('.css3dobject').addEventListener('mousedown', function() { globals.controls.sceneChanged = true; }, false);
    
    replayBtn.addEventListener( 'click', constructCSS, false );
    
    
    /* Set all the sizes initially and on resize*/
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    /*
     * This function is responsible for updating the camera's aspect ratio and projection matrix.
     * It will also update the WebGL and CSS3D renderers. A lower limit is set on the scene
     * of 650px, and if this limit is reached the height becomes responsive to the window.
     */
    
    camera.aspect = globals.container.clientWidth / globals.container.clientHeight;
    camera.updateProjectionMatrix();

    var containerHeight = globals.container.clientHeight;
    
    rendererGL.setSize(globals.container.clientWidth, containerHeight);
    rendererCSS.setSize(globals.container.clientWidth, containerHeight);

    // Resize height for smaller screens
    if (window.innerWidth < 650) { containerHeight = globals.container.clientHeight * .95; }
}

function constructCSS(replay) {
    /*
     * This function creates the various html objects in the scene which can be interacted with
     * and styled appropriately
     *
     * @replay[bool]: If the scene needs to be replayed set to true
     *
     */
    
    var setCSS = ['cmLoading','cmLoading_frames','security','performance','open','customizable'];

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

	globals[setCSS[i]] = div[setCSS[i]];

	sceneCSS.add(div[setCSS[i]]);
	animateCSS(setCSS[i], div, replay);

    	// Add hover effects
	elm[i].addEventListener('mouseover', function() { this.classList.add('feature_hover'); }, false);
	elm[i].addEventListener('mouseout', function() { this.classList.remove('feature_hover'); }, false);

	elm[i].addEventListener('click', showFeatureInfo, false);
    }
}

function showFeatureInfo(src) {
    /*
     * This function handles the class switching for cycling through the various
     * features on the side window each time a feature is clicked in the scene
     *
     * @src[click]: The mouse event from the click listener
     */

    // Get the parent object for each description in the dom
    var desc = document.querySelector('.description span');

    // Fade out the introduction, if its still present
    var intro = document.getElementById('introduction');
    if (!intro.classList.contains('fadeOut')) {
	intro.classList.add('fadeOut');
	intro.addEventListener("animationend", showNextDesc, false);
    } else {
	// Fade out the each feature description instead so the correct one can be
        // faded in
	for (var i=0; i<desc.children.length; i++) {
    	    if (desc.children[i].classList.contains('fadeIn')) {
		desc.children[i].classList.remove('fadeIn');
		desc.children[i].classList.add('fadeOut');
		desc.children[i].addEventListener("animationend", showNextDesc, false);
    	    }
	}
    }

    function showNextDesc() {
        // This function simply shows the correct feature after all the other
        // features are hidden
	for (var i = 0; i<desc.children.length; i++) {
	    // Hide all previous elements to ensure that they dont stack
	    desc.children[i].classList.add('hide');
	    // Detach all previous events
	    desc.children[i].removeEventListener('animationend', showNextDesc);
	}

	// Update the various features based on which one was clicked
        var featureClass = src.target.className.split(" ");
        for(var i=0; i<featureClass.length; i++) {
            switch(featureClass[i]) {
            case "security":
	        desc.children.security.classList.remove('hide');
	        desc.children.security.classList.remove('fadeOut');
	        desc.children.security.classList.add('fadeIn');
                break;
            case "performance":
	        desc.children.performance.classList.remove('hide');
	        desc.children.performance.classList.remove('fadeOut');
	        desc.children.performance.classList.add('fadeIn');
                break;
            case "open":
	        desc.children.open.classList.remove('hide');
	        desc.children.open.classList.remove('fadeOut');
	        desc.children.open.classList.add('fadeIn');
                break;
            case "customizable":
	        desc.children.customizable.classList.remove('hide');
	        desc.children.customizable.classList.remove('fadeOut');
	        desc.children.customizable.classList.add('fadeIn');
                break;
            default:
                break;
            }
        }
    }
}

function addElementToScene( geometry, materials  ) {
    /*
     * This function is responsible for adding the textures and geometry to the scene
     *
     * @geometry[obj]: The 3JS geometry
     * @materials[arr]: The array of texture objects
     *
     */

    materials[ 0 ].shading = THREE.FlatShading;
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );

    // Increase the size since CSS will be at a much larger scale
    mesh.scale.set(55,55,55);
    sceneGL.add(mesh);
}





function animateCSS(item, div, replay) {
    /*
     * This function handles queueing up the various CSS animation for the
     * different html objects
     *
     * @item[str]: the name of the feature box that will be animated
     * @div[obj]: An object containing the various threeJS CSS3D objects
     * @replay[bool]: Set to true if this is not the initial play through
     */

    // Set some basic defaults
    var speed = 950, delay = !replay ? 500 : 0;

    function beginCSSAnimation(div) {
        // Update the CSS timing on the item, and start the animations
	div.element.style['-webkit-animation-duration']		= speed;
	div.element.style['animation-duration']			= speed;
	div.element.style['-webkit-animation-play-state']	= 'running';
	div.element.style['animation-play-state']		= 'running';
    }

    function delayAnimation(itm, d, ftrDelay) {
        // Stage the CSS animation and the spline animation
	if (replay) { beginFeatureAnim[itm] = false; } // reset this feature box animation
	setTimeout(function() {
	    beginCSSAnimation(div[itm]);
	    setTimeout(function() {
		beginFeatureAnim[itm] = true;
	    	div[itm].element.className += ' feature_animation';
                if (itm == 'security') { document.querySelector('.description span').className += ' desc_animation'; }
	    }, ftrDelay);
	},d);
    }

    switch (item) {
    case "security":
        delayAnimation(item, delay - 650, featureDelay - 250);
	break;
    case "performance":
        delayAnimation(item, delay + 200, featureDelay + 20);
	break;
    case "open":
        delayAnimation(item, delay + 600, featureDelay + 220);
	break;
    case "customizable":
        delayAnimation(item, delay + 850, featureDelay + 520);
	break;
    case "cmLoading_frames":
        // Since this is not animated along a spline, but is instad a looping animation
        // we'll handle it individually
    	speed = speed + (speed/7);
	var pos = {
	    moveStart:  {x:0, y:-30, z:10},
	    moveFinish:	{x:0, y:-30, z:-45},
	};
	
	setTimeout(function() {
	    var update = {
		moveOut:	function(){ div[item].position.z = pos.moveStart.z; }
	    };
	    var moveOut = new TWEEN.Tween(pos.moveStart).to(pos.moveFinish, speed)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(update.moveOut)
		.start();

	    beginCSSAnimation(div[item]);
	    setTimeout(function() {
	    	div[item].element.className += ' cmLoading_frames_second';
	    },1000);
	}, delay);
	break;
    case "cmLoading":
        // Since this is not animated along a spline, but is instad a looping animation
        // we'll handle it individually
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
	    
	    beginCSSAnimation(div[item]);
	}, delay);
	break;
    default :
	break;
    };
}

function hideCanvas() {
    /*
     * As the name indicates, this function is responsible for hiding the
     * scene. It does this by creating an overlay and placing it before the
     * scene.
     */
    var el = document.createElement('div');
    el.className = 'sceneOverlay';
    var target = document.querySelector('.phoneContainer');

    target.parentElement.insertBefore(el, target);
}

function render() {
    /*
     * Render the scene using the CSS3DRender and the webGL renderer. Also,
     * moves the camera along it's path and the various HTML objects along
     * their spline.
     */
    
    rendererCSS.render(sceneCSS, camera);
    rendererGL.render( sceneGL, camera );

    var locals = {
	security: {},
	performance: {},
	open: {},
	customizable: {}
    };

    // Move the camera a bit if the user hasn't interacted with it.
    if (!globals.controls.sceneChanged) {
	if (camera.position.z > -500) {
	    camera.position.z -= 2;
	    camera.position.x += 3.25;
	}
    }


    // Find each spline on its path at this point in time, and assign it
    // to the equivlant cssobject
    var time = Date.now();
    var t = ( time % featureDelay ) / featureDelay;

    for (var key in globals.features) {
	if (beginFeatureAnim[key]) {
	    // Grab the position of the spline at the proper point in time
	    locals[key].splinePos = globals.features[key].spline.getPointAt( t );
	    // Stop the animation after certain distance
	    var points = globals.features[key].spline.points;
	    var buffer = points[points.length-1].z + 5;
	    if (locals[key].splinePos.z < buffer) { beginFeatureAnim[key] = false; }

	    // Update the css position
	    globals[key].position.copy( locals[key].splinePos );
	}
    }
}
