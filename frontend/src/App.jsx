import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [chartData, setChartData] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch data from express
    fetch('http://localhost:3000/api/top-mediums')
      .then(res => res.json())
      .then(data => {
        // convert string count to numbers
        const formattedData = data.map(item => ({
          medium: item.medium,
          total: parseInt(item.total_items, 10)
        }));
        setChartData(formattedData);
      });
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Top Art Mediums</h2>
      <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ left: 150 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="medium" width={150} />
            <Tooltip />
            <Bar dataKey="total" fill="#318" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

