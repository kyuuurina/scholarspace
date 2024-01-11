import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreChartProps {
  name: string;
  score: number;
}
const ScoreChart: React.FC<ScoreChartProps> = ({ name, score }) => {
  const data = {
    labels: [`${name} Score`, `Non-${name} Score`],
    datasets: [
      {
        label: `${name} Score`,
        data: [score, 100 - score],
        backgroundColor: ["#935FEF", "#D1D5DB"],
        borderColor: ["#935FEF", "#D1D5DB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-40 w-40">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ScoreChart;
