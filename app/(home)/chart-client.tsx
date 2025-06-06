"use client";

import "chartjs-adapter-date-fns";
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
  TimeScale,
} from "chart.js";
import { FC } from "react";
import { useRouter } from "next/navigation";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale
);

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
    datasets: [
      {
        label: "スコア",
        data: sortedScores.map((s) => ({
          x: s.date,
          y: s.score,
        })),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    onHover: (event, elements) => {
      const target = event.native
        ? (event.native.target as HTMLCanvasElement)
        : null;
      if (!target) return;

      if (elements.length) {
        target.style.cursor = "pointer";
      } else {
        target.style.cursor = "default";
      }
    },
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
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MM/dd HH:mm",
          displayFormats: {
            minute: "MM/dd HH:mm",
          },
        },
        title: {
          display: true,
          text: "日時",
        },
      },
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
