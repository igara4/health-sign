"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
} from "chart.js";

const ChartClient = dynamic(() => import("./chart-client"), { ssr: false });

type Props = {
  scores: { id: string; date: string; score: number }[];
};

const ChartClientWrapper = ({ scores }: Props) => {
  const [pluginReady, setPluginReady] = useState(false);
  useEffect(() => {
    (async () => {
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
      ChartJS.register(
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        zoomPlugin
      );
      setPluginReady(true);
    })();
  }, []);

  if (!pluginReady) return null;

  return <ChartClient scores={scores} />;
};

export default ChartClientWrapper;
