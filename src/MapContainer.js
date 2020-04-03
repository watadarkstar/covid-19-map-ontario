import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

import { Table, Row, Col } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import 'antd/dist/antd.css';
import * as moment from 'moment';
import { CSVLink } from 'react-csv';
import DateTimePickerModal from './components/DateTimePickerModal';

var apiKey = 'AIzaSyA61clFhCrihwKKKsF8lz0SJ_jb32nhiXg';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footPrints: [],
      // footPrints: [{lat: 43.65509405622337, lng: -79.38795019216536, date: 'Tue Mar 03 2020', time: '04:04:05 GMT-0400 (Eastern Daylight Time)'}, {lat: 43.64756139911764, lng: -79.41372555024623, date: 'Tue Mar 03 2020', time: '04:04:05 GMT-0400 (Eastern Daylight Time)'}, {lat: 43.64420752674433, lng: -79.39767521150111, date: 'Tue Mar 03 2020', time: '04:04:05 GMT-0400 (Eastern Daylight Time)'} ],
      activeDate: '',
      activeLon: '',
      activeLat: '',
      activeTime: '',
      activeMarker: {
        lat: '',
        lon: '',
        date: '',
        time: '',
      },

      patientId: this.props.patientId,
      showingInfoWindow: false,
      showModal: false,
      selectedPlace: {},
    };

    this.postData = this.postData.bind(this);
  }

  // When user clicks on the map, a red marker shows up
  onMapClick = (mapProps, map, clickEvent) => {
    let markerLatLng = clickEvent.latLng;
    const latitude = markerLatLng.lat();
    const longitude = markerLatLng.lng();

    // if infowWindow is already open, close info window, else open modal
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    } else {
      this.setState({
        showModal: true,
        activeLat: latitude,
        activeLon: longitude,
        activeDate: moment(),
        activeTime: moment(),
      });
    }
  };

  // When user clicks on a red marker, an infobox pops up displaying the time for that marker
  superMarkerClick = (markerProps, marker, clickEvent) => {
    const latitude = markerProps.position.lat;
    const longitude = markerProps.position.lng;

    // grab footPrint in state that matches with lat/lng position
    const footPrint = this.state.footPrints.filter((footprint) => {
      return footprint.lat === latitude && footprint.lng === longitude;
    })[0];

    // update state with date/time and active marker
    this.setState({
      selectedPlace: markerProps,
      activeMarker: marker,
      showingInfoWindow: true,
      activeDate: moment(footPrint.date),
      activeTime: moment(footPrint.time),
    });
  };

  displayFootprints = () => {
    return this.state.footPrints.map((footprint, index) => {
      return (
        <Marker
          key={index}
          position={{
            lat: footprint.lat,
            lng: footprint.lng,
          }}
          onClick={this.superMarkerClick}
        />
      );
    });
  };

  // When user clicks "save foot print" after inputing time data in modal
  handleOk = () => {
    var { activeLat, activeLon, activeDate, activeTime } = this.state;

    // copy footprints so we don't modify state indirectly
    let newFootPrints = this.state.footPrints.slice();

    // add new footprint
    newFootPrints.push({
      lat: activeLat,
      lng: activeLon,
      date: activeDate.utc().toDate(),
      time: activeTime.utc().toDate(),
    });

    // update state
    return this.setState({
      footPrints: newFootPrints,
      showModal: false,
      activeLat: '',
      activeLon: '',
      activeTime: '',
      activeDate: '',
    });
  };

  // clear active lat/lon and turn modal off
  handleCancel = () => {
    return this.setState({
      activeLat: '',
      activeLon: '',
      activeTime: '',
      activeDate: '',
      showModal: false,
      showingInfoWindow: false,
    });
  };

  // update footprint with new date/time
  handleUpdate = (prop) => {
    const { activeDate, activeTime, activeMarker } = this.state;
    const latitude = activeMarker.position.lat();
    const longitude = activeMarker.position.lng();

    // shallow copy footprints array
    let newFootPrints = this.state.footPrints.slice();

    // grab footprint and index in newFootPrints that matches lat/lon
    let footPrint = newFootPrints.filter((footprint) => {
      return footprint.lat === latitude && footprint.lng === longitude;
    })[0];

    // update the footprint with the new date/times
    footPrint.date = activeDate;
    footPrint.time = activeTime;

    // update state to show new footprints with updated date/time
    return this.setState({
      footPrints: newFootPrints,
      showingInfoWindow: false,
      activeDate: '',
      activeTime: '',
      activeMarker: '',
    });
  };

  handleDelete = () => {
    const { activeMarker } = this.state;
    const latitude = activeMarker.position.lat();
    const longitude = activeMarker.position.lng();

    // filter out selected footprint
    const newFootPrints = this.state.footPrints.filter((footprint) => {
      return footprint.lat !== latitude || footprint.lng !== longitude;
    });

    return this.setState(
      Object.assign({}, this.state, {
        footPrints: newFootPrints,
        showingInfoWindow: false,
      }),
    );
  };

  deleteByIndex = (index) => {
    const newFootPrints = this.state.footPrints.slice();
    newFootPrints.splice(index, 1);
    return this.setState(
      Object.assign({}, this.state, {
        footPrints: newFootPrints,
      }),
    );
  };

  componentDidMount() {
    console.log('patient id: ' + this.props.patientId);
  }

  toggleInfoTable() {
    var objData = document.getElementById('data');
    var objMap = document.getElementById('map');
    if (objMap.style.display == '') {
      objData.style.display = 'block';
      objMap.style.display = 'none';
    } else {
      objData.style.display = '';
      objMap.style.display = '';
    }
  }

  postData() {
    const footPrintWithCaseID = this.state.footPrints.map((obj) => {
      let row = {};
      row.case_id = this.props.patientId;
      row.date = obj.date;
      row.time = moment(obj.time).format('hh:mm:ss A');
      row.latitude = obj.lat;
      row.longitude = obj.lng;

      return row;
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(footPrintWithCaseID),
    };
    console.log(JSON.stringify(footPrintWithCaseID));
    fetch(
      ' https://cn1aotmhx0.execute-api.us-east-1.amazonaws.com/default/savetimeline',
      requestOptions,
    )
      .then((response) => {
        response.json();
        window.location.href = '/dataview';
      })
      //.then((json) => {alert(JSON.stringify(requestOptions)); window.location.reload(false)})
      .catch((error) => {
        console.error('Something went wrong:', error);
      });
  }

  render() {
    // format datasource for rendering table (datasource is an arr of objects)
    const dataSource = this.state.footPrints.map((footprint, idx) => {
      const formattedDate = moment(footprint.date).format('ddd, ll'); // Thu, Mar 26, 2020 format
      const formattedTime = moment(footprint.time).format('hh:mm:ss A'); // 08:05:46 PM format
      return {
        key: idx,
        patient_id: this.state.patientId,
        date: formattedDate,
        time: formattedTime,
        // city: // to add later
        latitude: footprint.lat.toFixed(6),
        longitude: footprint.lng.toFixed(6),
      };
    });

    const columns = [
      { title: 'patient_id', dataIndex: 'patient_id' },
      { title: 'date', dataIndex: 'date' },
      { title: 'time', dataIndex: 'time' },
      { title: 'latitude', dataIndex: 'latitude' },
      { title: 'longitude', dataIndex: 'longitude' },
      {
        title: '',
        render: (_, record) => (
          <a
            className="ant-typography ant-typography-danger"
            onClick={() => this.deleteByIndex(record.key)}
          >
            <DeleteFilled />
          </a>
        ),
      },
    ];

    return (
      <div className="outer-wrap">
        <Row>
          <Col flex={3} id="map" className="map">
            <Map
              google={this.props.google}
              initialCenter={{
                lat: this.props.initialLat, //change this to be set based on location input on form prior to map
                lng: this.props.initialLon,
              }}
              onClick={this.onMapClick}
            >
              {this.displayFootprints()}
            </Map>

            <DateTimePickerModal
              visible={this.state.showModal || this.state.showingInfoWindow}
              onOk={this.state.showModal ? this.handleOk : this.handleUpdate}
              onCancel={this.handleCancel}
              onDelete={this.handleDelete}
              editMode={this.state.showModal}
              date={this.state.activeDate}
              time={this.state.activeTime}
              onDateChange={(activeDate) => this.setState({ activeDate })}
              onTimeChange={(activeTime) => this.setState({ activeTime })}
            />
          </Col>
          <Col flex={2} id="data" className="data">
            {/* Table outside of map that shows info from state  */}
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false} // buttons on bottom of table that show which page number to jump to
              className="table-column"
              size="small"
            />

            <CSVLink data={dataSource} className="download-csv">
              Save to CSV
            </CSVLink>
            <div>
              <button className="save-button" onClick={this.postData}>
                Save and Exit
              </button>
            </div>
          </Col>
        </Row>
        <div className="burger">
          <button onClick={this.toggleInfoTable}>...</button>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey,
})(MapContainer);
