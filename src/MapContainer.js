import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';

import { Table, Row, Col } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import 'antd/dist/antd.css';
import * as moment from 'moment';
import { CSVLink } from 'react-csv';
import DateTimePickerModal from './components/DateTimePickerModal';
import useOntarioData from './hooks/useOntarioData';

var apiKey = 'AIzaSyA61clFhCrihwKKKsF8lz0SJ_jb32nhiXg';

const Marker = ({ children }) => children;

const MapContainer = (props) => {
  const [state, setState] = useState({
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

    patientId: props.patientId,
    showingInfoWindow: false,
    showModal: false,
    selectedPlace: {},
  });
  const { data } = useOntarioData();

  // When user clicks on the map, a red marker shows up
  const onMapClick = (mapProps, map, clickEvent) => {
    let markerLatLng = clickEvent.latLng;
    const latitude = markerLatLng.lat();
    const longitude = markerLatLng.lng();

    // if infowWindow is already open, close info window, else open modal
    if (state.showingInfoWindow) {
      setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    } else {
      setState({
        showModal: true,
        activeLat: latitude,
        activeLon: longitude,
        activeDate: moment(),
        activeTime: moment(),
      });
    }
  };

  // When user clicks on a red marker, an infobox pops up displaying the time for that marker
  // const superMarkerClick = (markerProps, marker, clickEvent) => {
  //   const latitude = markerProps.position.lat;
  //   const longitude = markerProps.position.lng;

  //   // grab footPrint in state that matches with lat/lng position
  //   const footPrint = data.features.filter((footprint) => {
  //     return (
  //       footprint.Reporting_PHU_Latitude === latitude &&
  //       footprint.Reporting_PHU_Longitude === longitude
  //     );
  //   });
  //   if (!footPrint) {
  //     console.log('notfound');
  //     return;
  //   }

  //   // update state with date/time and active marker
  //   setState({
  //     selectedPlace: markerProps,
  //     activeMarker: marker,
  //     showingInfoWindow: true,
  //     activeDate: moment(footPrint.date),
  //     activeTime: moment(footPrint.time),
  //   });
  // };

  // const displayFootprints = () => {
  //   return data.features.map((footprint, index) => {
  //     const { properties } = footprint;
  //     return (
  //       <Marker
  //         key={index}
  //         position={{
  //           lat: properties.Reporting_PHU_Latitude,
  //           lng: properties.Reporting_PHU_Longitude,
  //         }}
  //         onClick={superMarkerClick}
  //       />
  //     );
  //   });
  // };

  // When user clicks "save foot print" after inputing time data in modal
  const handleOk = () => {
    var { activeLat, activeLon, activeDate, activeTime } = state;

    // copy footprints so we don't modify state indirectly
    let newFootPrints = state.footPrints.slice();

    // add new footprint
    newFootPrints.push({
      lat: activeLat,
      lng: activeLon,
      date: activeDate.utc().toDate(),
      time: activeTime.utc().toDate(),
    });

    // update state
    return setState({
      footPrints: newFootPrints,
      showModal: false,
      activeLat: '',
      activeLon: '',
      activeTime: '',
      activeDate: '',
    });
  };

  // clear active lat/lon and turn modal off
  const handleCancel = () => {
    return setState({
      activeLat: '',
      activeLon: '',
      activeTime: '',
      activeDate: '',
      showModal: false,
      showingInfoWindow: false,
    });
  };

  // update footprint with new date/time
  const handleUpdate = (prop) => {
    const { activeDate, activeTime, activeMarker } = state;
    const latitude = activeMarker.position.lat();
    const longitude = activeMarker.position.lng();

    // shallow copy footprints array
    let newFootPrints = state.footPrints.slice();

    // grab footprint and index in newFootPrints that matches lat/lon
    let footPrint = newFootPrints.filter((footprint) => {
      return footprint.lat === latitude && footprint.lng === longitude;
    })[0];

    // update the footprint with the new date/times
    footPrint.date = activeDate;
    footPrint.time = activeTime;

    // update state to show new footprints with updated date/time
    return setState({
      footPrints: newFootPrints,
      showingInfoWindow: false,
      activeDate: '',
      activeTime: '',
      activeMarker: '',
    });
  };

  const handleDelete = () => {
    const { activeMarker } = state;
    const latitude = activeMarker.position.lat();
    const longitude = activeMarker.position.lng();

    // filter out selected footprint
    const newFootPrints = state.footPrints.filter((footprint) => {
      return footprint.lat !== latitude || footprint.lng !== longitude;
    });

    return setState(
      Object.assign({}, state, {
        footPrints: newFootPrints,
        showingInfoWindow: false,
      }),
    );
  };

  const deleteByIndex = (index) => {
    const newFootPrints = state.footPrints.slice();
    newFootPrints.splice(index, 1);
    return setState(
      Object.assign({}, state, {
        footPrints: newFootPrints,
      }),
    );
  };

  const toggleInfoTable = () => {
    var objData = document.getElementById('data');
    var objMap = document.getElementById('map');
    if (objMap.style.display === '') {
      objData.style.display = 'block';
      objMap.style.display = 'none';
    } else {
      objData.style.display = '';
      objMap.style.display = '';
    }
  };

  const dataSource = data.features.map((footprint, idx) => {
    const { properties } = footprint;
    const formattedDate = moment(footprint.ACCURATE_EPISODE_DATE).format(
      'ddd, ll',
    ); // Thu, Mar 26, 2020 format
    const formattedTime = moment(footprint.ACCURATE_EPISODE_DATE).format(
      'hh:mm:ss A',
    ); // 08:05:46 PM format
    return {
      key: idx,
      patient_id: properties._id,
      date: formattedDate,
      time: formattedTime,
      latitude: properties.Reporting_PHU_Latitude,
      longitude: properties.Reporting_PHU_Longitude,
    };
  });

  // massage data
  const clusterPoints = data.features.map((footprint) => {
    const { properties } = footprint;

    return {
      type: 'Feature',
      properties: {
        cluster: false,
        id: properties._id,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          properties.Reporting_PHU_Longitude,
          properties.Reporting_PHU_Latitude,
        ],
      },
    };
  });

  // get map bounds
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  // get clusters
  const { clusters } = useSupercluster({
    points: clusterPoints,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
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
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          className="ant-typography ant-typography-danger"
          onClick={() => deleteByIndex(record.key)}
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
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultCenter={{ lat: props.initialLat, lng: props.initialLon }}
            defaultZoom={9}
            yesIWantToUseGoogleMapApiInternals
            onClick={onMapClick}
            onChange={({ zoom, bounds }) => {
              setZoom(zoom);
              setBounds([
                bounds.nw.lng,
                bounds.se.lat,
                bounds.se.lng,
                bounds.nw.lat,
              ]);
            }}
          >
            {clusters.map((cluster) => {
              const [longitude, latitude] = cluster.geometry.coordinates;
              const {
                cluster: isCluster,
                point_count: pointCount,
              } = cluster.properties;

              let color = pointCount > 100 ? 'orange' : 'green';
              color = pointCount > 300 ? 'red' : color;

              if (isCluster) {
                return (
                  <Marker
                    key={`cluster-${cluster.id}`}
                    lat={latitude}
                    lng={longitude}
                  >
                    <div
                      className={`cluster-marker ${color}-marker`}
                      style={{
                        width: `${
                          30 + (pointCount / clusterPoints.length) * 20
                        }px`,
                        height: `${
                          30 + (pointCount / clusterPoints.length) * 20
                        }px`,
                      }}
                      onClick={() => {}}
                    >
                      {pointCount}
                    </div>
                  </Marker>
                );
              }

              return (
                <Marker
                  key={`footprint-${cluster.properties.id}`}
                  lat={latitude}
                  lng={longitude}
                >
                  <button className="crime-marker">
                    <img src="/custody.svg" alt="crime doesn't pay" />
                  </button>
                </Marker>
              );
            })}
          </GoogleMapReact>

          <DateTimePickerModal
            visible={state.showModal || state.showingInfoWindow}
            onOk={state.showModal ? handleOk : handleUpdate}
            onCancel={handleCancel}
            onDelete={handleDelete}
            editMode={state.showModal}
            date={state.activeDate}
            time={state.activeTime}
            onDateChange={(activeDate) => setState({ activeDate })}
            onTimeChange={(activeTime) => setState({ activeTime })}
          />
        </Col>
        <Col flex={2} id="data" className="data">
          {/* Table outside of map that shows info from state  */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="page-title"
            href="https://data.ontario.ca/dataset/confirmed-positive-cases-of-covid-19-in-ontario/resource/455fd63b-603d-4608-8216-7d8647f43350"
          >
            Confirmed positive cases of COVID-19 in Ontario
          </a>
          <p className="page-subtitle">Last updated April 4, 2020</p>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={true} // buttons on bottom of table that show which page number to jump to
            className="table-column"
            size="small"
          />
          <CSVLink data={dataSource} className="download-csv">
            Save to CSV
          </CSVLink>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="data-link"
            href="https://data.ontario.ca/dataset/confirmed-positive-cases-of-covid-19-in-ontario/resource/455fd63b-603d-4608-8216-7d8647f43350"
          >
            Data provided by Ontario.ca
          </a>
        </Col>
      </Row>
      <div className="burger">
        <button onClick={toggleInfoTable}>...</button>
      </div>
    </div>
  );
};

export default MapContainer;
