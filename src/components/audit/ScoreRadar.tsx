import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  scores: {
    technical: number;
    content: number;
    aiVisibility: number;
    structure: number;
    metadata: number;
    readability: number;
    images: number;
    links: number;
    social: number;
    schema: number;
  };
}

export function ScoreRadar({ scores }: Props) {
  const data = {
    labels: [
      "Technical",
      "Content",
      "AI Visibility",
      "Structure",
      "Metadata",
      "Readability",
      "Images",
      "Links",
      "Social",
      "Schema",
    ],
    datasets: [
      {
        label: "Score",
        data: [
          scores.technical,
          scores.content,
          scores.aiVisibility,
          scores.structure,
          scores.metadata,
          scores.readability,
          scores.images,
          scores.links,
          scores.social,
          scores.schema,
        ],
        backgroundColor: "rgba(99, 215, 232, 0.18)",
        borderColor: "rgba(99, 215, 232, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(186, 130, 255, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  return (
    <Radar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { color: "rgba(255,255,255,0.4)", backdropColor: "transparent", stepSize: 25 },
            grid: { color: "rgba(255,255,255,0.1)" },
            angleLines: { color: "rgba(255,255,255,0.12)" },
            pointLabels: { color: "rgba(255,255,255,0.85)", font: { size: 12, weight: 500 } },
          },
        },
      }}
    />
  );
}
