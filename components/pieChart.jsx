import { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

function pieChart(data1, data2, data3, data4 = -1) {
  Chart.register(...registerables);

  useEffect(() => {
    var ctx = document.getElementById('myChart').getContext('2d');
    if (data4 === -1) {
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [data1.name, data2.name, data3.name],
          datasets: [
            {
              data: [data1.sum, data2.sum, data3.sum],
              borderColor: ['#3cba9f', '#ffa500', '#c45850'],
              backgroundColor: [
                'rgb(60,186,159,0.5)',
                'rgb(255,165,0,0.5)',
                'rgb(196,88,80,0.5)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                display: false,
              },
            ],
            yAxes: [
              {
                display: false,
              },
            ],
          },
        },
      });
    } else {
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [data1.name, data2.name, data3.name, data4.name],
          datasets: [
            {
              data: [data1.sum, data2.sum, data3.sum, data4.sum],
              borderColor: ['#3cba9f', '#ffa500', '#c45850'],
              backgroundColor: [
                'rgb(60,186,159,0.5)',
                'rgb(255,165,0,0.5)',
                'rgb(196,88,80,0.5)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                display: false,
              },
            ],
            yAxes: [
              {
                display: false,
              },
            ],
          },
        },
      });
    }
  }, []);
  return (
    <>
      <div className="flex mx-auto my-auto">
        <div className="border-gray-400 pt-0 rounded-xl m-auto pb-2">
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </>
  );
}
export default pieChart;
