import React from 'react';
import { useMentora } from '../context/MentoraContext';

type Mode = 'personal' | 'organisation';

type Props = {
  mode?: Mode;
  goals?: string[];
  recommendations?: string[];
  onDownload?: () => void; // hook only
};

export default function Roadmap({ mode, goals, recommendations, onDownload }: Props) {
  const ctx = useMentora();
  const useMode = mode ?? ctx.mode;
  const useGoals = goals ?? ctx.goals;
  const useRecs = recommendations ?? ctx.recommendations;
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Roadmap</h2>
          <p className="text-sm text-slate-600">{mode === 'personal' ? 'Personal 30/60/90 day plan' : 'Team roadmap and recommended actions'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onDownload?.()}
            className="px-3 py-2 bg-sky-600 text-white rounded-md text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      {useGoals.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-slate-700 mb-2">Selected Goals</div>
          <ul className="list-disc list-inside text-sm text-slate-600">
            {useGoals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        {useMode === 'personal' ? (
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold">30-Day: Foundations</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Define a single focused outcome for the next 30 days.</li>
                <li>Establish daily micro-habits (15–30 mins) related to your top goal.</li>
                <li>Set weekly check-ins to track progress.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold">60-Day: Acceleration</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Double down on the highest-impact routines and measure outcomes.</li>
                <li>Seek feedback and iterate on learning approach.</li>
                <li>Introduce a focused practice block (2–3x/week).</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold">90-Day: Scale</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Consolidate wins into a repeatable system.</li>
                <li>Set milestones for next quarter based on measurable results.</li>
                <li>Plan next-sprint goals and accountability partner.</li>
              </ul>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold">Team Actions</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Run weekly short syncs to surface blockers and progress.</li>
                <li>Define clear owners for top 3 priorities.</li>
                <li>Set short-term KPIs and a weekly dashboard.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold">Leadership Actions</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Introduce leadership 1:1s and growth plans.</li>
                <li>Run alignment workshops to clarify vision and priorities.</li>
                <li>Set a coaching cadence for key leads.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold">Process Actions</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li>Identify one process pilot to reduce cycle time.</li>
                <li>Document async norms and communication expectations.</li>
                <li>Measure impact with clear KPIs and a review cadence.</li>
              </ul>
            </section>
          </div>
        )}
      </div>

      {useRecs.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <div className="text-sm font-medium mb-2">Recommendations</div>
          <ul className="list-disc list-inside text-sm text-slate-700">
            {useRecs.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
