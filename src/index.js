
const UI_STATUSES_TO_VECHILE_STATUSES = {
    'Available': 'available',
    'Awaiting Landing Approval': 'in_progress',
    'Waiting For Drone Landing': 'charger_waiting',
    'Charging': 'docking_confirmation_received',
    'Awaiting Availabilty approval': 'ready',
};

const VECHILE_STATUSES_TO_UI_STATUSES = {};
for (let key of Object.keys(UI_STATUSES_TO_VECHILE_STATUSES)) {
    value = UI_STATUSES_TO_VECHILE_STATUSES[key];
    VECHILE_STATUSES_TO_UI_STATUSES[value] = key;
}

let STATION_ID_MAP = {};
const stations = require('./station-id-map');
for (let key in stations) {
    STATION_ID_MAP[key] = {};
    Object.assign(STATION_ID_MAP[key], stations[key]);
}
const { API } = require('dav-js');
const sky = require('./sky');
sky.init().catch(err => console.log(err));

const express = require('express');
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/stations', function (req, res, next) {
    new Promise(() =>getUpdatedStatusFromMissions());
    const stations = getAllStations();
    res.send(stations);
});

app.get('/waitingForDroneLanding/:stationId', function (req, res, next) {
    updateStationIsWaitingForDrone(req.params['stationId']);
    res.sendStatus(200);
});

app.get('/available/:stationId', function (req, res, next) {
    updateStationIsAvailable(req.params['stationId']);
    res.sendStatus(200);
});

app.listen(3003);

function getUpdatedStatusFromMissions() {
    const stations = getAllStations();
    const stationsArray = Promise.all(stations.map(async station => {
        const captain = await API.captains.getCaptain(station.davId);
        const newStation = {};
        Object.assign(newStation, station);
        switch (captain.status) {
            case 'contract_received':
                if (station.status === 'Available') {
                    newStation.status = 'Awaiting Landing Approval';
                }
                break;
            case 'in_progress':
                if (station.status == 'Available') {
                    newStation.status = 'Awaiting Landing Approval';
                }
                break;
            case 'docking_confirmation_received':
                newStation.status = 'Charging';
                break;
            case 'ready':
                if (station.status === 'Charging') {
                    newStation.status = 'Charging Finished, Awaiting Availabilty Approval';
                }    
                break;
        }
        return newStation;
    }));
    stationsMap = {};
    stationsArray.then((updatedStations) => {
        updatedStations.forEach(station => {
            stationsMap[station.id] = station;
        });
        STATION_ID_MAP = stationsMap;
        for (let stationId in STATION_ID_MAP) {
            let station = STATION_ID_MAP[stationId];
            station.missionId = sky.stationsByDavID[station.davId].missionId;
        }
    });
}

function getAllStations() {
    const stations = Object.values(STATION_ID_MAP);
    return stations;
}

function updateStationIsWaitingForDrone(id) {
    if (!!id && !!STATION_ID_MAP[id]) {
        let station = STATION_ID_MAP[id]
        mission = {mission_id: station.missionId, captain_id: station.davId};
        sky.updateStatus(mission, 'charger_waiting', 'charger_waiting')
        STATION_ID_MAP[id].status = 'Waiting For Drone Landing';
    }
}

function updateStationIsAvailable(id) {
    if (!!id && !!STATION_ID_MAP[id]) {
        // let station = STATION_ID_MAP[id]
        // mission = {mission_id: station.missionId, captain_id: station.davId};
        // sky.updateStatus(mission, 'ready', 'available')
        STATION_ID_MAP[id].status = 'Available';
        STATION_ID_MAP[id].missionId = null;
    }
}