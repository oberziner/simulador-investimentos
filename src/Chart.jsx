import React from 'react';
import { Line  } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'
import f from './format';
import { isBusinessDay } from './simulation/dates';

const data = ({investments}) => {
  const datasets = investments.map(i => ({
    label: i.id,
    fill: false,
    data: i.steps
    .filter((step) => isBusinessDay(step.date))
    .map(step => ({
      x: step.date,
      y: step.value,
    })),
  }))

  return {
    datasets: datasets
  }
};

const options = {
  maintainAspectRatio: false,
  animation: {
                duration: 0 // general animation time
            
  },
  hover: {
                animationDuration: 0 // duration of animations when hovering an item
            
  },
          responsiveAnimationDuration: 0, // animation duration after a resize
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      title: function(tooltipItem, data) {
        var xValue = data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].x;
        return f.formatDate(xValue);
      }
    }
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
  },
  scales: {
    xAxes: [{
      type: 'time',
      distribution: 'series',
      offset: true,
      ticks: {
        source: 'data',
        autoSkip: true,
        autoSkipPadding: 75,
        maxRotation: 0,
        sampleSize: 100
      },
    }],
    yAxes: [{
      gridLines: {
        drawBorder: false
      },
      scaleLabel: {
        display: true,
        labelString: 'Valor'
      }
    }]
  },
};

const Chart = ( investments ) => (
  <div style={{margin: "10px", width: "95%"}}> 
    <div style={{backgroundColor: "rgba(255, 255, 255, 0.6)"}}>
      <Line
        width={100}
        height={400}
        options={options}
        data={data(investments)} 
      />
    </div>
  </div>
);

export default Chart;
