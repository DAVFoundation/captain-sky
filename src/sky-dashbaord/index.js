import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const captainSkyUrl = 'http://localhost:3003';

function Station(props) {
  let stationClasses = 'station-box';
  if(props.status === 'Awaiting Landing Approval' || props.status === 'Charging Finished, Awaiting Availabilty Approval') {
    stationClasses += ' awaiting';
  } else if(props.status === 'Charging') {
    stationClasses += ' charging';
  }

  return (
    <div className="col-sm-4">
      <h4 className="station-name">{props.name}</h4>
      <div className={stationClasses}>
        <p>Station ID: <b>{props.id}</b></p>
        <p>Location: <b>{props.longitude}, {props.latitude}</b></p>
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
    if (station.status != 'Awaiting Landing Approval' && station.status != 'Charging Finished, Awaiting Availabilty Approval') {
      console.log("station with unchanged status: "+station.status);
      return;
    }
    const stations = this.state.stations.slice();
    for (let iterStation of stations) {
      if (iterStation.id === station.id) {
        if (station.status == 'Awaiting Landing Approval') {
          iterStation.status = 'Waiting For Drone Landing';
          fetch(captainSkyUrl+'/waitingForDroneLanding/'+station.id);
        } else {
          iterStation.status = 'Available';
          fetch(captainSkyUrl+'/available/'+station.id);
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
              <Station id={station.id} name={station.name} longitude={station.location.longitude} latitude={station.location.latitude}
              status={station.status} handleClick={() => this.updateStationStatus(station)}/>
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