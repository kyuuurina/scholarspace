import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreChartProps {
  score: number;
}
const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = {
    labels: ["Collaborativity Score", "Remaining Score"],
    datasets: [
      {
        label: "Collaborativity Score",
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
