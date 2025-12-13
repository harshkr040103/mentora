import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentora } from '../context/MentoraContext';

type Mode = 'personal' | 'organisation';

type Props = {
  mode: Mode;
  onNext?: (selectedGoals: string[]) => void;
};

const PERSONAL_GOALS = [
  'Career clarity',
  'Skill development',
  'Consistency & discipline',
  'Confidence & mindset',
];

const ORG_GOALS = [
  'Team productivity',
  'Leadership development',
  'Process optimisation',
  'Employee growth',
];

export default function GoalSelection({ mode, onNext }: Props) {
  const navigate = useNavigate();
  const options = mode === 'personal' ? PERSONAL_GOALS : ORG_GOALS;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(goal: string) {
    setSelected((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  function handleNext() {
    const { setGoals } = useMentora();
    setGoals(selected);
    if (onNext) {
      onNext(selected);
      return;
    }
    navigate('/onboarding/assessment');
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Select your goals</h2>
        <p className="text-sm text-slate-600 mb-6">Pick one or more goals to focus on. You can update these later.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {options.map((goal) => {
            const active = selected.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggle(goal)}
                className={`text-left p-4 rounded-lg border transition-shadow hover:shadow-sm bg-white ${
                  active ? 'border-sky-500 shadow-md' : 'border-slate-200'
                }`}
                aria-pressed={active}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{goal}</div>
                    <div className="text-xs text-slate-500 mt-1">&nbsp;</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {active ? '✓' : '+'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-60"
          >
            Next — Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
