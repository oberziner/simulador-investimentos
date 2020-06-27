import React from 'react';
import { Line  } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const options = {
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        enabled: true,
        mode: 'x',
      }
    }
  }
};

const Chart = ({ investments, }) => (
  <div style={{margin: "10px", width: "1500px"}}> 
    <div style={{backgroundColor: "rgba(255, 255, 255, 0.6)"}}>
      <Line
        width={100}
        height={250}
        options={options}
        data={data} 
      />
    </div>
  </div>
);

export default Chart;
