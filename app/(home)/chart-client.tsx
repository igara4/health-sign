"use client";

import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {
  ActiveElement,
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

ChartJS.register(LineElement, LinearScale, PointElement, TimeScale);

type Props = {
  scores: { id: string; date: string; score: number }[];
};

const ChartClient: FC<Props> = ({ scores }) => {
  const router = useRouter();

  const sortedScores = [...scores].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const logIdMap = Object.fromEntries(sortedScores.map((s) => [s.date, s.id]));

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

  const currentDate = new Date();
  const twoWeekAgo = new Date();
  twoWeekAgo.setDate(currentDate.getDate() - 14); //直近２週間のデータを初期表示

  const initialMinDate = twoWeekAgo;
  const initialMaxDate = currentDate;

  const fullMinDate =
    sortedScores.length > 0 ? new Date(sortedScores[0].date) : undefined;
  const fullMaxDate =
    sortedScores.length > 0
      ? new Date(sortedScores[sortedScores.length - 1].date)
      : undefined;

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
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: sortedScores.length > 7 },
          pinch: { enabled: sortedScores.length > 7 },
          mode: "x",
        },
        pan: {
          enabled: sortedScores.length > 7,
          mode: "x",
          threshold: 5,
        },
        limits:
          fullMinDate && fullMaxDate
            ? {
                x: {
                  min: fullMinDate.getTime(),
                  max: fullMaxDate.getTime(),
                  minRange: 1000 * 60 * 60 * 24 * 7, //最小7日文までのズームを設定
                },
              }
            : undefined,
      },
    },
    scales: {
      x: {
        type: "time",
        ...(initialMinDate &&
          initialMaxDate && {
            min: initialMinDate.toISOString(),
            max: initialMaxDate.toISOString(),
          }),
        time: {
          unit: "day",
          tooltipFormat: "MM/dd",
          displayFormats: {
            day: "MM/dd",
          },
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
