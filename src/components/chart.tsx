// components/DoughnutChart.tsx
'use client'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

type DoughnutChartProps = {
  title: string
  labels: string[]
  data: number[]
  colors?: string[]
}

export default function DoughnutChart({
  title,
  labels,
  data,
  colors = ['#3B82F6', '#F472B6', '#FCD34D', '#10B981', '#6366F1'],
}: DoughnutChartProps) {

      //  const [stats, setStats] = useState<any>(null)

  //    useEffect(() => {
  //   axios.get('https://node2-plum.vercel.app/api/user/getStats').then((res) => setStats(res.data))
  // }, [])

  // if (!stats) return <p className="p-6">Loading charts...</p>
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        }}
      />
    </div>
  )
}
