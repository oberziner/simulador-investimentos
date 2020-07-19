import React from 'react';
import { Line  } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'
import f from './format';
import { isBusinessDay } from './simulation/dates';

const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
const colorNames = Object.keys(chartColors);

const data = ({investments}) => {
  const datasets = investments.map((investment, index) => ({
    label: investment.id,
    fill: false,
    backgroundColor: chartColors[colorNames[index % colorNames.length]],
    borderColor: chartColors[colorNames[index % colorNames.length]],
    data: investment.steps
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
    animationDuration: 0 // duration of animations when hovering an item
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

let render = true;
let lastRender = Date.now()

const plugins = [{
  beforeRender : (args) => {
    const now = Date.now();
    if ((now - lastRender) > 100) {
      lastRender = now;
      return true;
    }
    return false;

  },
  beforeEvent: (args, e) => {
    if (e.type === 'click') {
      render = !render;

    }
    return render;
  }
  
}];

const Chart = ( investments ) => (
  <div style={{margin: "10px", width: "95%"}}> 
    <div style={{backgroundColor: "rgba(255, 255, 255, 0.6)"}}>
      <Line
        width={100}
        height={400}
        options={options}
        plugins={plugins}
        data={data(investments)} 
      />
    </div>
  </div>
);

export default Chart;
