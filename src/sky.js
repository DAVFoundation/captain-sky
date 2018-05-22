const {
  getVehicle: apiGetVehicle,
  addNewVehicle: apiAddNewVehicle,
  updateVehicle: apiUpdateVehicle
} = require('./missioncontrol/vehicles');
const geolib = require('geolib');
const { DavSDK, API } = require('dav-js');
const Rx = require('rxjs/Rx');
const stations = require('./station-id-map');
const mnemonic = require('../mnemonic');

class Sky {
  constructor() {
    this.stationsBySkyId = {};
    this.stationsByDavID = {};
  }

  async init() {
    this.stationsBySkyId = stations;
    Object.values(stations)
      .map( async station => {
        await this.initStationSDK(station);
        this.stationsByDavID[station.davId] = station;
      });

    
  }

  async initStationSDK(station) {
    station.needs = [];
    station.bids = [];
    station.sdk = new DavSDK(station.davId, station.davId, mnemonic);
    await station.sdk.initCaptain({
      id: station.davId,
      model: 'SKY-' + station.name,
      icon: `https://lorempixel.com/100/100/abstract/?${station.davId}`,
      coords: {
        long: station.location.longitude,
        lat: station.location.latitude
      },
      max_charging_velocity: station.max_charging_velocity,
      missions_completed: 0,
      missions_completed_7_days: 0,
      status: 'available'
    });
    let isRegistered = await station.sdk.isRegistered();
    if (isRegistered) {
      let missionContract = station.sdk.mission().contract();
      missionContract.subscribe(
        mission => this.onContractCreated(station, mission),
        err => console.log(err),
        () => console.log('')
      );
    }
    const charging = station.sdk.needs().forType('drone_charging', {
      ...station.location,
      radius: 10e10,
      ttl: 120 // TTL in seconds
    });

    charging.subscribe(
      need => this.onNeed(station, need),
      err => console.log(err),
      () => console.log('')
    );
  }

  async dispose() {
  }

  async beginMission(vehicleId, missionId) {
    this.stationsByDavID[vehicleId]['missionId'] = missionId;
    
    const missionUpdates = Rx.Observable.timer(0, 1000)
      .mergeMap(async () => {
        let mission = await API.missions.getMission(missionId);
        let vehicle = await API.captains.getCaptain(mission.captain_id);
        return { mission, vehicle };
      })
      .distinctUntilChanged(
        (state1, state2) =>
          state1.mission.status === state2.mission.status &&
          state1.vehicle.status === state2.vehicle.status
      )
      .subscribe(
        async state => {
          try {
            switch (state.mission.status) {
              case 'awaiting_signatures':
                break;
              case 'in_progress':
                await this.onInProgress(
                  state.mission,
                  state.vehicle
                );
                break;
              case 'in_mission':
                await this.onInMission(
                  state.mission,
                  state.vehicle
                );
                break;
              case 'confirmed':
                setTimeout(async () => {
                  await this.updateStatus(state.mission, 'completed', 'available');
                }, 3000);
                await API.missions.updateMission(state.mission.mission_id, {
                  status: 'completed',
                  captain_id: state.vehicle.id
                });
                break;
              case 'completed':
                missionUpdates.unsubscribe();
                break;
              default:
                console.log(`bad mission.status ${state.mission}`);
                break;
            }
          } catch (error) {
            console.error(error);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  async onInProgress(mission, captain) {
    await API.missions.updateMission(mission.mission_id, {
      status: 'in_mission',
      captain_id: captain.id
    });

    await this.onInMission(mission, captain);
  }

  async onInMission(mission, captain) {
    // await apiUpdateVehicle(vehicle);
    switch (captain.status) {
      
      case 'contract_received':
        this.updateStatus(mission, 'in_progress', 'in_progress');
        break;
      case 'in_progress':
        // setTimeout(async () => {
        //   await this.updateStatus(mission, 'charger_waiting', 'charger_waiting');
        // }, 3000);
        break;
      case 'charger_waiting':
        // setTimeout(async () => {
        //   await this.updateStatus(mission, 'charger_waiting', 'charger_waiting');
        // }, 3000);
        break;
      case 'docking_confirmation_received':
        // setTimeout(async () => {
        //   await this.updateStatus(mission, 'ready', 'ready');
        // }, 20000);
      break;
      case 'ready':
        break;
      case 'available':
        // await API.missions.updateMission(mission.mission_id, {
        //   status: 'completed',
        //   captain_id: captain.id
        // });
        break;
      default:
        console.log(`bad captain.status ${captain}`);
        break;
    }
  }

  async updateStatus(mission, missionStatus, vehicleStatus) {
    await API.missions.updateMission(mission.mission_id, {
      mission_status: missionStatus,
      vehicle_status: vehicleStatus,
      captain_id: mission.captain_id
    });
  }

  async onNeed(station, need) {
    if (station.needs.includes(need.id)) {
      return;
    }
    
    const distance = geolib.getDistance(
      { latitude: station.location.latitude, longitude: station.location.longitude },
      { latitude: need.need_location_latitude, longitude: need.need_location_longitude },
      // { latitude: pt1.lat, longitude: pt1.lon },
      1, 1
    );

    const bidInfo = {
      captain_id: station.davId,
      price: station.price,
      price_type: 'flat',
      price_description: 'Flat fee',
      distance: Math.floor(distance / 1000),
      ttl: 120 // TTL in seconds
    };

    console.log(`created bid ${need.id}`);
    const bid = station.sdk.bid().forNeed(need.id, bidInfo);
    bid.subscribe(
      (bid) => this.onBidAccepted(station, bid),
      () => console.log('Bid completed'),
      err => console.log(err)
    );
  }

  onBidAccepted(station, bid) {
    if (station.bids.includes(bid.id)) {
      return;
    }
    station.bids.push(bid.id);
  }

  onContractCreated(drone, mission) {
    this.beginMission(mission.captain_id, mission.mission_id);
  }
}

module.exports = new Sky();
