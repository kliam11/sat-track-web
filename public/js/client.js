var xhttp; 

// Public-client Cesium globe token 
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTcxZGM4Ny0yYTEyLTQxMzQtYWU1Ni05MzQwMWU4MjZhMGIiLCJpZCI6OTE4MTYsImlhdCI6MTY1MTUwODc1MH0.6x3FAwaHRjf7iupLOuh4YVwCVVPa5iLnmGrYVWsDSv4';  

document.cookie = 'SameSite=Strict';

window.onload = function(){
    initClock(initGlobe(0), 0); 
    getData();
      
}; 

function getData() {
    xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/data', true);
    xhttp.setRequestHeader('Accept', 'application/json'); 
    xhttp.send();
    xhttp.onreadystatechange = processData; 
}

function processData(){ 
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        document.getElementById('date').innerHTML = 'Date of data set: '; 
		document.getElementById('date').classList.remove('error');  
	} else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 429){ 
        document.getElementById('date').innerHTML = 'Too many data requests. Try again in one minute.'; 
		document.getElementById('date').classList.add('error');
    } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 404){ 
        document.getElementById('date').innerHTML = 'Data could not be retrieved. Contact owner for support.'; 
		document.getElementById('date').classList.add('error');
    } else {
		document.getElementById('date').innerHTML = 'Fatal error. Contact owner for support.'; 
        document.getElementById('date').classList.add('error');  
	}
}

function createOrbits(){ 
    /* 
    let entity = this.viewer.entities.add({
        position: undefined,
        point: {
        pixelSize: 4,
        color: Cesium.Color.YELLOW
        },
        path: {
        width: 1,
        material: Cesium.Color.YELLOW,
        trailTime: 1,
        leadTime: 1000,
        show: true
        }
    })

    */ 
}

function clickSatellite(){ 

}

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
function initGlobe(key){ 
    const viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
          url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        }), 
        baseLayerPicker: false, fullscreenButton: false, geocoder: false,
        homeButton: false, sceneModePicker: false, navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false
    });  
    const layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3 })
    );
    viewer.scene.globe.enableLighting = true;
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000000;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 100000000;
    return viewer; 
} 

// Initialize time
function initClock(viewer, date){ 
    const totalSeconds = 86400;
    const start = Cesium.JulianDate.fromDate(new Date());
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    viewer.clock.multiplier = 40;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    viewer.entities.add({
        position: 0,
        point: { pixelSize: 5, color: Cesium.Color.RED }
      });
}

