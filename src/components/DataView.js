import React from 'react';
import { Table } from 'antd';

import useOntarioData from '../hooks/useOntarioData';
import 'antd/dist/antd.css';

const DataView = () => {
  // state = {
  //   data: [],
  // };

  // componentDidMount() {
  //   this.getFootprintsData();
  // }

  // getFootprintsData = () => {
  //   const url =
  //     'https://cn1aotmhx0.execute-api.us-east-1.amazonaws.com/default/getfootprints';
  //   axios({
  //     method: 'get',
  //     url: url,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }).then((data) => {
  //     let newDataArray = this.state.data.slice();
  //     let responseDataArray = data.data;
  //     responseDataArray.map((obj) => {
  //       newDataArray.push(obj);
  //     });
  //     return this.setState({ data: newDataArray });
  //   });
  // };

  // const dataSource = this.state.data.map((footprint, idx) => {
  //   return {
  //     key: idx,
  //     case_id: footprint.case_id,
  //     date: moment(footprint.date).format('ddd, ll'),
  //     time: footprint.time,
  //     latitude: footprint.latitude,
  //     longitude: footprint.longitude,
  //   };
  // });
  const { data, error } = useOntarioData();
  const columns = [
    { title: 'case_id', dataIndex: 'case_id' },
    { title: 'date', dataIndex: 'date' },
    { title: 'time', dataIndex: 'time' },
    { title: 'latitude', dataIndex: 'latitude' },
    { title: 'longitude', dataIndex: 'longitude' },
  ];

  console.log(data);
  console.log(error);

  return (
    <Table
      dataSource={[]}
      columns={columns}
      pagination={true} // buttons on bottom of table that show which page number to jump to
      className="table-column"
      size="large"
    />
  );
};

export default DataView;
