"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PasoCurso from "./PasoCurso";
import PasoModulos from "./PasoModulos";
import PasoClases from "./PasoClases";

export default function CrearClase() {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);
  const [modulosCreados, setModulosCreados] = useState([]);

  return (
    <MainLayout>
      <div className="p-10 bg-gray-100 min-h-screen">
        {step === 1 && (
          <PasoCurso
            setCourseId={setCourseId}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PasoModulos
            courseId={courseId}
            setModulos={setModulosCreados}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <PasoClases
            courseId={courseId}
            modulos={modulosCreados}
            onFinish={() =>
              alert("🎉 Curso creado exitosamente")
            }
          />
        )}
      </div>
    </MainLayout>
  );
}
