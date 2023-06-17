import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreChartProps {
    score: number;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
    const data = {
        labels: ["Collaborativity Score", "Remaining Score"],
        datasets: [
            {
                label: "Collaborativity Score",
                data: [score, 100 - score],
                backgroundColor: ["#8B5CF6", "#D1D5DB"],
                borderColor: ["#8B5CF6", "#D1D5DB"],
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
        <div className="w-40 h-40">
            <Doughnut data={data} options={options} />
        </div>
    );
}
