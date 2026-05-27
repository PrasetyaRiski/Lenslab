import { Role } from "@prisma/client";
import { CameraSimulator } from "@/components/student/camera-simulator";
import { requireRole } from "@/lib/auth";

export default async function SimulatorPage() {
  await requireRole([Role.STUDENT]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.75rem] border border-zinc-800 bg-[linear-gradient(135deg,#111113,#050505)] px-5 py-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-300">Jurnalistik DSLR Lab</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Simulasi Kamera DSLR</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Latih mode dial, exposure triangle, autofocus, drive mode, metering, dan live view dengan tampilan kamera EOS-style yang lebih realistis.
        </p>
      </div>
      <CameraSimulator />
    </div>
  );
}
