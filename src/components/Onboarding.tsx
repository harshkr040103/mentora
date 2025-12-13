import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentora } from '../context/MentoraContext';

type Mode = 'personal' | 'organisation';

const OPTIONS: { id: Mode; title: string; desc: string; icon: string }[] = [
  {
    id: 'personal',
    title: 'Personal Growth',
    desc: 'Improve skills, set goals, and track your progress',
    icon: '🌱',
  },
  {
    id: 'organisation',
    title: 'Organisational / Team Growth',
    desc: 'Scale learning, align teams, and boost performance',
    icon: '🏢',
  },
];

type Props = {
  onNext?: (mode: Mode) => void;
};

export default function Onboarding({ onNext }: Props) {
  const [selected, setSelected] = useState<Mode | null>(null);
  const navigate = useNavigate();

  function handleSelect(mode: Mode) {
    setSelected(mode);
    const { setMode } = useMentora();
    setMode(mode);
    if (onNext) {
      onNext(mode);
      return;
    }
    navigate('/onboarding/goals');
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">How do you want to use Mentora?</h2>

        <p className="text-sm text-slate-600 mb-8">Choose one option to continue — you can change this later.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`text-left p-6 rounded-lg border transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white ${
                  active ? 'border-sky-500 shadow-lg' : 'border-slate-200'
                }`}
                aria-pressed={active}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl leading-none">{opt.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-slate-900">{opt.title}</h3>
                      {active && <span className="text-sm text-sky-600">Selected</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{opt.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
