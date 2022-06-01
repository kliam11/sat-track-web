Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTcxZGM4Ny0yYTEyLTQxMzQtYWU1Ni05MzQwMWU4MjZhMGIiLCJpZCI6OTE4MTYsImlhdCI6MTY1MTUwODc1MH0.6x3FAwaHRjf7iupLOuh4YVwCVVPa5iLnmGrYVWsDSv4';  

var satcatXhttp; 
var paramsXhttp; 
var dateXhttp; 

var date; 
var satArr = []; 
var vi; 

const timestepInSeconds = 120;
const totalSeconds = 86400; 

var errorMessages = []; 

window.onload = function(){
    getDate(); 
    setTimeout(()=>{ // wait for date, can't do anything wihtout proper timing...
        vi = initGlobe();  
        initClock(vi);  
        initListeners(); 
        getParams('/params'); 
        getSatcat('/satcat'); 
    }, 2000); 
    if(errorMessages.length!==0) showError(); 
};


// REQUEST FUNCTIONS 

function getSatcat(url) {
    satcatXhttp = new XMLHttpRequest();
    satcatXhttp.open('GET', url, true);
    satcatXhttp.setRequestHeader('Accept', 'application/json'); 
    satcatXhttp.send();
    satcatXhttp.onreadystatechange = processSatcat; 
}
function getParams(url) {
    paramsXhttp = new XMLHttpRequest();
    paramsXhttp.open('GET', url, true);
    paramsXhttp.setRequestHeader('Accept', 'application/json'); 
    paramsXhttp.send();
    paramsXhttp.onreadystatechange = processParams; 
}
function getDate() {
    dateXhttp = new XMLHttpRequest();
    dateXhttp.open('GET', '/date', true);
    dateXhttp.setRequestHeader('Accept', 'application/json'); 
    dateXhttp.send();
    dateXhttp.onreadystatechange = processDate; 
}

function processSatcat(){ 
    if (satcatXhttp.readyState === XMLHttpRequest.DONE && satcatXhttp.status === 200) {
        initSatcat(JSON.parse(satcatXhttp.responseText)); 
	} 
    else if (satcatXhttp.readyState === XMLHttpRequest.DONE && satcatXhttp.status === 201){ 
        errorMessages.push('<br>201 backup SATCAT'); 
        initSatcat(JSON.parse(satcatXhttp.responseText)); 
    }
    else if (satcatXhttp.readyState === XMLHttpRequest.DONE && satcatXhttp.status === 429){ 
        errorMessages.push('<br>429 too many API requests'); 
    }
    else if (satcatXhttp.readyState === XMLHttpRequest.DONE && satcatXhttp.status === 403){ 
        errorMessages.push('<br>403 backup SATCAT data not available'); 
    }
    else if (satcatXhttp.readyState === XMLHttpRequest.DONE && satcatXhttp.status === 404){ 
        errorMessages.push('<br>404 SATCAT data not available'); 
    }
    else {
        errorMessages.push('<br>500 Server error'); 
	}
}
function processParams(){ 
    if (paramsXhttp.readyState === XMLHttpRequest.DONE && paramsXhttp.status === 200) {
        initSatellites(JSON.parse(paramsXhttp.responseText));   
	} 
    else if (paramsXhttp.readyState === XMLHttpRequest.DONE && paramsXhttp.status === 201){ 
        errorMessages.push('<br>201 backup orbital data'); 
        initSatellites(JSON.parse(paramsXhttp.responseText));
    }
    else if (paramsXhttp.readyState === XMLHttpRequest.DONE && paramsXhttp.status === 429){ 
        errorMessages.push('<br>429 too many API requests'); 
    }
    else if (paramsXhttp.readyState === XMLHttpRequest.DONE && paramsXhttp.status === 403){ 
        errorMessages.push('<br>403 backup orbital data not available'); 
    }
    else if (paramsXhttp.readyState === XMLHttpRequest.DONE && paramsXhttp.status === 404){ 
        errorMessages.push('<br>404 Orbital data not available'); 
    }
    else {
        errorMessages.push('<br>500 Server error'); 
	}
}
function processDate(){ 
    if (dateXhttp.readyState === XMLHttpRequest.DONE && dateXhttp.status === 200) {
        date = JSON.parse(dateXhttp.responseText)['date']; 
        // issue: could get bad date yet good data, so it woud be out of sync ... 
	} 
    else if (dateXhttp.readyState === XMLHttpRequest.DONE && dateXhttp.status === 201){ 
        errorMessages.push('<br>201 backup UTC Date<br>'); 
        date = dateXhttp.responseText['date']; 
    }
    else if (dateXhttp.readyState === XMLHttpRequest.DONE && dateXhttp.status === 429){ 
        errorMessages.push('<br>429 too many API requests'); 
    }
    else if (dateXhttp.readyState === XMLHttpRequest.DONE && dateXhttp.status === 403){ 
        errorMessages.push('<br>403 backup date not available'); 
    }
    else if (dateXhttp.readyState === XMLHttpRequest.DONE && dateXhttp.status === 404){ 
        errorMessages.push('<br>404 Date not available'); 
    }
    else {
        errorMessages.push('<br>500 Server error'); 
	}
}


// DISPLAY FUNCTIONS

function search(event){ 
    console.log(event); 
    if(event.key==='Enter'){ 
        let srch = document.getElementById('search'); 
        let query = srch.value.trim(); 
        for(sat of satArr){ 
            if(sat['SATNAME']===query || sat['NORAD_CAT_ID']===query){ 
                showOrbit(sat['entity']); 
                return 
            } 
        } 
        srch.classList.add('searchFailed'); 
        setTimeout(() => { 
            srch.classList.remove('searchFailed');
        }, 1000); 
    } 
}

function showDate(){ 
    
}

function showOrbit(entity){ 
    try{ 
        if(!entity.path.show._value) entity.path.show = true; 
        else entity.path.show = false; 
    } catch {}
}

function showInfo(entity){ 
    document.getElementById('toggle-data').classList.toggle('showHide');
}

function showSatcat(){ 
    document.getElementById('satcat-info').classList.toggle('showHide'); 
}


// ERROR DISPLAY FUNCTIONS 

function showError(){ 
    let err = 'ERROR/Warning'; 
    for(msg of errorMessages){ 
        err += msg; 
    } 
    err += '<br>Results may not reflect real conditions'; 
    document.getElementById('error').innerHTML = err; 

    document.getElementById('search').classList.add('showHide'); 
    document.getElementById('error').classList.toggle('showHide'); 
    setTimeout(function(){ 
        document.getElementById('error').classList.toggle('showHide'); 
        document.getElementById('search').classList.remove('showHide'); 
    }, 15000); 
}

// INIT FUNCTIONS 

function initSatellites(params){ 
    for(sat of params){ 
        if(sat.positions.length!==0) sat['entity'] = initOrbits(sat['positions'][0], parseInt(sat['period']), sat['type'], sat['SATNAME']); 
        else sat['entity'] = undefined; 
        satArr.push(sat); 
    }
}

function initOrbits(pData, period, type, satName){ 
    const positionsOverTime = new Cesium.SampledPositionProperty();
    let j = 0; 
    for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
        const start = Cesium.JulianDate.fromDate(new Date(date)); 
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        positionsOverTime.addSample(time, {x:pData[j].x*1000, y:pData[j].y*1000, z:pData[j].z*1000});
        j++;
    }
    return vi.entities.add({ 
        point: { pixelSize: 5, color: assignColor(type)}, 
        position: positionsOverTime,  
        path: { 
            width: .5,
            material: Cesium.Color.WHITE,
            trailTime: period*60,
            leadTime: period*60,
            show: false
        }, 
        name: satName, 
        description: '<p>This is a satellite. The description will go here once a web scraping method is developed.</p><hr> <table><tr><th scope="col">Lat</th><th scope="col">Lon</th><th scope="col">Height</th></tr> <tr><td>'+  +'</td></tr></table>'
    }); 

    /*<table id="satcat-info" class="table showHide">
                <tr>
                    <th scope="col">INTLDES</th>
                    <th scope="col">NORAD CAT ID</th>
                    <th scope="col">Object type</th>
                    <th scope="col">Sat name</th>
                    <th scope="col">Country</th>
                    <th scope="col">Launch</th>
                    <th scope="col">Site</th>
                    <th scope="col">Period</th>
                    <th scope="col">Inclination</th>
                    <th scope="col">Apogee</th>
                    <th scope="col">Perigee</th>
                    <th scope="col">Launch year</th>
                    <th scope="col">Export?</th>
                </tr>
            </table>*/
}

function assignColor(type){ 
    if(type==='PAYLOAD') return Cesium.Color.RED; 
    if(type==='DEBRIS') return Cesium.Color.GRAY; 
    else return Cesium.Color.BLUE; 
}

function initSatcat(satcatArr){ 
    let dataAdd = '<tr>'; 
    for(sat of satcatArr){ 
        dataAdd = '<td>'+sat['INTLDES']+'</td>'; 
        dataAdd += '<td>'+sat['NORAD_CAT_ID']+'</td>'; 
        dataAdd += '<td>'+sat['OBJECT_TYPE']+'</td>'; 
        dataAdd += '<td>'+sat['SATNAME']+'</td>'; 
        dataAdd += '<td>'+sat['COUNTRY']+'</td>'; 
        dataAdd += '<td>'+sat['LAUNCH']+'</td>'; 
        dataAdd += '<td>'+sat['SITE']+'</td>'; 
        dataAdd += '<td>'+sat['PERIOD']+'</td>'; 
        dataAdd += '<td>'+sat['INCLINATION']+'</td>'; 
        dataAdd += '<td>'+sat['APOGEE']+'</td>'; 
        dataAdd += '<td>'+sat['PERIGEE']+'</td>'; 
        dataAdd += '<td>'+sat['LAUNCH_YEAR']+'</td>'; 
        dataAdd += '<td><input type="checkbox" id="" name="" value=""></td></tr>'; 
        document.getElementById('satcat-info').innerHTML += dataAdd; 
    }
}

function initListeners(){ 
    document.getElementById('satcatBtn').addEventListener('click', showSatcat); 
    document.getElementById('search').addEventListener('keypress', search); 
    vi.selectedEntityChanged.addEventListener(showOrbit); 
}

function initGlobe(){ 
    const viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
          }),
          baseLayerPicker: false, geocoder: false,
          navigationHelpButton: false, sceneModePicker: false,
          requestRenderMode : false, maximumRenderTimeChange : .5, 
          animation: false, timeline: false, fullscreenButton: false
    });
    viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3954 })
    );
    viewer._cesiumWidget._creditContainer.parentNode.removeChild(
        viewer._cesiumWidget._creditContainer);
    viewer.scene.globe.enableLighting = true;
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000000;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 500000000;
    
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    return viewer; 
} 

function initClock(viewer){ 
    const start = Cesium.JulianDate.fromDate(new Date(date));
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date()); 
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
}



