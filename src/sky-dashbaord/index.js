import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// const captainSkyUrl = 'http://'+process.env.CAPTAIN_HOST+':'+process.env.CAPTAIN_PORT;
const captainSkyUrl = '';

function droneTypesString(droneTypesArray) {
  let droneTypesString = '';
  droneTypesArray.forEach(droneType => {
    switch (droneType) {
      case 'mavic': droneTypesString += ', DJI Mavic Air';
        break;
      case 'matrice': droneTypesString += ', DJI Matrice 100';
        break;
      case 'phantom': droneTypesString += ', DJI Phantom 4';
        break;
    }
  });
  droneTypesString = droneTypesString.slice(2);
  return droneTypesString;
}

function Station(props) {
  let stationClasses = 'station-box';
  if(props.status === 'Awaiting Landing Approval') {
    stationClasses += ' awaiting';
  } else if(props.status === 'Charging') {
    stationClasses += ' charging';
  }

  return (
    <div className="col-sm-4">
      <h4 className="station-name">{props.name}</h4>
      <div className={stationClasses}>
        <p>Station ID: <b>{props.id}</b></p>
        <p>Location: {props.longitude}, {props.latitude}</p>
        <p>Supported Drone Types: </p>
        <p>{droneTypesString(props.droneTypes)}</p>
        <p>Status: <span>{props.status}</span></p>
        <a onClick={props.handleClick}>APPROVE</a>
      </div>
    </div>
  );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.updateAllStations();
    setInterval(() => this.updateAllStations(), 1000);
  }

  updateAllStations() {
    fetch(captainSkyUrl+'/stations').then(res => res.json()).then(
      stationsData => this.setState({stations: stationsData})
    );
  }
  
  updateStationStatus(station) {
    if (station.status != 'Awaiting Landing Approval') {
      console.log("station with unchanged status: "+station.status);
      return;
    }
    const stations = this.state.stations.slice();
    for (let iterStation of stations) {
      if (iterStation.id === station.id) {
        if (station.status == 'Awaiting Landing Approval') {
          iterStation.status = 'Waiting For Drone Landing';
          fetch(captainSkyUrl+'/waitingForDroneLanding/'+station.id);
        }
        
        this.setState({stations: stations});
        break;
      }
    }
  }

  render() {
    if (!!this.state && !!this.state.stations) {
      return (
        <div className="container" id="stations">
          <div className="row">
            {this.state.stations.map(station =>
              <Station id={station.id} name={station.name} latitude={station.location.latitude} longitude={station.location.longitude}
               droneTypes={station.drone_types} status={station.status} handleClick={() => this.updateStationStatus(station)}/>
            )}         
          </div>
        </div>
      ); 
    }
    return (
      <div className="container" id="stations">
        <div className="row"/>
      </div>
    );
  }
}

const chargingStations = document.querySelector('#stations')
ReactDOM.render(<Dashboard />, chargingStations)