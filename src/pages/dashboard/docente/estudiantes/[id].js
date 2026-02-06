"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import EmotionRadarChart from "@/components/charts/EmotionRadarChart";
import AttentionChart from "@/components/charts/AttentionCharts";

export default function EstudianteDetalle() {
  const { user } = useAuth("docente");
  const router = useRouter();
  const { id } = router.query;

  const [emotionData, setEmotionData] = useState([]);
  const [attentionData, setAttentionData] = useState([]);
  const [studentName, setStudentName] = useState("");

  const randomEmotionData = () =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 10);

  const randomAttentionData = () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 60);

  useEffect(() => {
    if (!id) return;
    const fetchStudent = async () => {
      try {
        const res = await fetch(`https://edumotion-backend1.onrender.com/student/${id}/`);
        if (!res.ok) return;
        const data = await res.json();
        setStudentName(data.fullname || data.username || "");
      } catch {
        setStudentName("");
      }
    };
    fetchStudent();

    const key = `student_charts_${id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEmotionData(parsed.emotion || []);
        setAttentionData(parsed.attention || []);
        return;
      } catch {
        // continue to regenerate
      }
    }

    const emotion = randomEmotionData();
    const attention = randomAttentionData();
    setEmotionData(emotion);
    setAttentionData(attention);
    localStorage.setItem(key, JSON.stringify({ emotion, attention }));
  }, [id]);

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Gráficos del estudiante {studentName ? `— ${studentName}` : `#${id}`}
          </h2>
          <button
            onClick={() => router.push("/dashboard/docente/estudiantes")}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            Volver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Emociones</h3>
            <EmotionRadarChart data={emotionData} />
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Atención</h3>
            <AttentionChart values={attentionData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
