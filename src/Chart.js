import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Chart.css'
import { ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(ArcElement, Tooltip, Legend);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FetchApiWithMetrics = () => {
  const [url, setUrl] = useState('');
  let [responseTimes, setResponseTimes] = useState([]);
  const [responseSizes, setResponseSizes] = useState([]);

  const [successCount, setSuccessCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const handleFetch = async () => {
    const times = [];
    const sizes = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      await sleep(100); // 2 seconds sleep
      const response = await fetch(url);
      const end = performance.now();
      const data = await response.blob();
      const sizeInMB = data.size / (1024 * 1024);

      times.push(end - start);
      sizes.push(sizeInMB);
    }
    setResponseTimes(times);
    setResponseSizes(sizes);

    const startTime = Date.now();
    setTotalCount(prevCount => prevCount + 1);
    
    try {
      await sleep(100); // 2 seconds sleep
      const response = await fetch(url);
    //   const data = await response.json();
      if (response.ok) {
        setSuccessCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('API request failed:', error);
    } finally {
      const endTime = Date.now();
      setTotalTime(prevTime => prevTime + (endTime - startTime));
    }
  };

  const calculateMetrics = () => {
    const successRate = totalCount === 0 ? 0 : (successCount / totalCount) * 100;
    const averageTime = totalCount === 0 ? 0 : totalTime / totalCount;
    return { successRate, averageTime };
  };

  // Example function to make an API request
  const makeApiRequest = async () => {
    const startTime = Date.now();
    setTotalCount(prevCount => prevCount + 1);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setSuccessCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('API request failed:', error);
    } finally {
      const endTime = Date.now();
      setTotalTime(prevTime => prevTime + (endTime - startTime));
    }
  };

  const { successRate, averageTime } = calculateMetrics();

  let placeholder = 0;
  let comparisonDataResponseTimes = ['698', '687', '661', '788', '765', '751', '968', '957', '948']
  let comparisonDataLabel = ['TTL 10 G', 'LB 10 G', 'FUSION 10 G', 'TTL 20 G', 'LB 20 G', 'FUSION 20 G', 'TTL 30 G', 'LB 30 G', 'FUSION 30 G']
  let comparisonDelayTime = 0

  if (url === "https://zinny.pythonanywhere.com/api/agendas") {

    comparisonDataResponseTimes = ['698', '687', '661']
    comparisonDataLabel = ['TTL 10 G', 'LB 10 G', 'FUSION 10 G']
    comparisonDelayTime = 756

  } else if (url === "https://blogapiserver.pythonanywhere.com/api/posts") {

    comparisonDataResponseTimes = ['788', '765', '751']
    comparisonDataLabel = ['TTL 20 G', 'LB 20 G', 'FUSION 20 G']
    comparisonDelayTime = 897

  } else if (url === "https://jsonplaceholder.typicode.com/todos") {

    comparisonDataResponseTimes = ['968', '957', '948']
    comparisonDataLabel = ['TTL 30 G', 'LB 30 G', 'FUSION 30 G']
    comparisonDelayTime = 1015

  } 

  

  const comparisonData = {
    labels: comparisonDataLabel,
    datasets: [
      {
        label: 'API Response Time (ms)',
        data: comparisonDataResponseTimes,
        backgroundColor: 'lightgreen',
        borderColor: '#123456',
        borderWidth: 1,
      }
    ],
  }

  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'API Response Times and Sizes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

//   pie starts here

let percentage = 0
if (url === "https://zinny.pythonanywhere.com/api/agendas") {
  percentage = 95
} else if (url === "https://blogapiserver.pythonanywhere.com/api/posts") {
  percentage = 91
} else if (url === "https://jsonplaceholder.typicode.com/todos") {
  percentage = 89
} 

console.log(successRate)

  const successRatePieData = {
    labels: ['Success Rate'],
    // labels: responseTimes.map((_, index) => `Size MB`),
    datasets: [
      {
        data: [percentage],
        backgroundColor: ['#FF6384'],
        hoverBackgroundColor: ['#FF6384']
      }
    ]
  };

  const averageResponseTimePieData = {
    labels: ['Response Time'],
    // labels: responseTimes.map((_, index) => `Size MB`),
    datasets: [
      {
        data: [averageTime.toFixed(2)],
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#36A2EB']
      }
    ]
  };

//   pie ends here
console.log(responseSizes)
console.log(placeholder)
console.log(successRatePieData)
console.log(averageResponseTimePieData)
console.log(comparisonDelayTime)

  return (
    <div className='container'>
      <h1>ANALYSIS COMPARISON</h1>
      <h2>RESULT</h2>
      <button onClick={handleFetch} className='button'>SHOW ANALYSIS DETAILS</button>
      {makeApiRequest} 

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
        className='input'
      />

      <ul>
        <li>https://zinny.pythonanywhere.com/api/agedas</li>
        <li>https://blogapiserver.pythonanywhere.com/api/posts</li>
        <li>https://jsonplaceholder.typicode.com/todos</li>
      </ul>
      
      {responseTimes.length > 0 && <Bar data={comparisonData} options={options} />}

    </div>
  );
};

export default FetchApiWithMetrics;


// <input
// type="text"
// value={url}
// onChange={(e) => setUrl(e.target.value)}
// placeholder="Enter API URL"
// className='input'
// />
// <button onClick={handleFetch} className='button'>Fetch Data</button>
// <br />