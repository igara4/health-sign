"use client";

import { Line } from "react-chartjs-2";
import {
  ActiveElement,
  CategoryScale,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { FC } from "react";
import { useRouter } from "next/navigation";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

type Props = {
  scores: { id: string; date: string; score: number }[];
};

const ChartClient: FC<Props> = ({ scores }) => {
  const router = useRouter();

  const sortedScores = [...scores].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const logIdMap = Object.fromEntries(sortedScores.map((s) => [s.date, s.id]));

  const labels = sortedScores.map((s) => {
    const date = new Date(s.date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "スコア",
        data: sortedScores.map((s) => s.score),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length === 0) return;

      const index = elements[0].index;
      const clickedDate = sortedScores[index].date;
      const logId = logIdMap[clickedDate];

      if (logId) {
        router.push(`/conditions/${logId}/dailyLogDetail`);
      }
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="">
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartClient;
