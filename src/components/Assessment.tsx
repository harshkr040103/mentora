import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Mode = 'personal' | 'organisation';

type Assessment = {
  mode: Mode;
  currentState: Record<string,string>;
  desiredState: Record<string,string>;
  strategy: Record<string,string>;
};

type Props = {
  mode?: Mode; // fallback to personal
  onFinish?: (assessment: Assessment) => void;
};

export default function Assessment({ mode = 'personal', onFinish }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  const [assessment, setAssessment] = useState<Assessment>({
    mode,
    currentState: {},
    desiredState: {},
    strategy: {},
  });

  // simple question sets depending on mode and step
  const questions = {
    personal: {
      1: [
        { key: 'clarity', q: 'Do you have a clear career direction?' },
        { key: 'time', q: 'Do you have time dedicated to growth?' },
      ],
      2: [
        { key: 'goal', q: 'What is your primary career goal (1-2 lines)?' },
        { key: 'timeline', q: 'What timeline do you expect for progress?' },
      ],
      3: [
        { key: 'constraints', q: 'What constraints limit your progress?' },
        { key: 'resources', q: 'Which resources are available to you?' },
      ],
    },
    organisation: {
      1: [
        { key: 'alignment', q: 'Is the team aligned on priorities?' },
        { key: 'productivity', q: 'How would you rate current productivity?' },
      ],
      2: [
        { key: 'outcome', q: 'What outcome does leadership expect?' },
        { key: 'metrics', q: 'Which KPIs will define success?' },
      ],
      3: [
        { key: 'process', q: 'Which processes are bottlenecks?' },
        { key: 'people', q: 'Are there skill gaps to address?' },
      ],
    },
  } as const;

  const stepQuestions = (questions as any)[mode][step] as { key: string; q: string }[];

  function handleAnswer(section: 'currentState' | 'desiredState' | 'strategy', key: string, value: string) {
    setAssessment((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  }

  function shortRecommendation(): string {
    // Very simple conditional recommendations based on answers
    if (step === 1) {
      const answers = assessment.currentState;
      if (mode === 'personal') {
        const clarity = (answers['clarity'] || '').toLowerCase();
        const time = (answers['time'] || '').toLowerCase();
        if (clarity.includes('no') || clarity.includes('not')) return 'You currently lack clarity; consider defining a 90-day focus.';
        if (time.includes('no') || time.includes('not')) return 'Time seems limited; build micro-habits to gain consistency.';
        return 'You have reasonable clarity and time — leverage small, consistent actions.';
      }
      // organisation
      const alignment = (answers['alignment'] || '').toLowerCase();
      const productivity = (answers['productivity'] || '').toLowerCase();
      if (alignment.includes('no') || alignment.includes('not')) return 'Team alignment is low; run a prioritisation workshop.';
      if (productivity.includes('low') || productivity.includes('poor')) return 'Productivity appears low; identify quick wins to unblock teams.';
      return 'Team seems reasonably aligned — amplify effective processes.';
    }

    if (step === 2) {
      const answers = assessment.desiredState;
      if (mode === 'personal') {
        const timeline = (answers['timeline'] || '').toLowerCase();
        if (timeline.includes('short') || timeline.includes('3') || timeline.includes('6')) return 'Ambitious timeline — recommend a focused 90-day plan.';
        return 'Longer timelines work well with incremental milestones.';
      }
      // organisation
      const metrics = (answers['metrics'] || '').toLowerCase();
      if (metrics) return 'Clear KPIs will help measure progress; align teams around them.';
      return 'Define measurable outcomes to track success.';
    }

    // step 3
    const strat = assessment.strategy;
    if (mode === 'personal') {
      if ((strat['constraints'] || '').length > 10) return 'Constraints identified — plan around them with small habit changes.';
      return 'Build incremental strategies combining skills, time and feedback.';
    }
    if ((strat['process'] || '').length > 10) return 'Process bottlenecks noted — start with a single process improvement pilot.';
    return 'Consider training and process changes focused on priority areas.';
  }

  function handleNextStep() {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    // finish
    if (onFinish) onFinish(assessment);
    else navigate('/');
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-2">Assessment — Step {step}</h2>
        <p className="text-sm text-slate-600 mb-6">{step === 1 ? 'Current State' : step === 2 ? 'Desired State' : 'Strategy & Constraints'}</p>

        <div className="space-y-4 mb-6">
          {stepQuestions.map((item) => (
            <div key={item.key} className="">
              <label className="text-sm font-medium text-slate-800">{item.q}</label>
              <input
                className="mt-2 block w-full rounded-md border py-2 px-3"
                value={
                  step === 1
                    ? assessment.currentState[item.key] || ''
                    : step === 2
                    ? assessment.desiredState[item.key] || ''
                    : assessment.strategy[item.key] || ''
                }
                onChange={(e) =>
                  handleAnswer(step === 1 ? 'currentState' : step === 2 ? 'desiredState' : 'strategy', item.key, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="text-sm font-medium mb-2">Quick recommendation</div>
          <div className="text-sm text-slate-700">{shortRecommendation()}</div>
        </div>

        <div className="flex justify-between">
          <button onClick={handleBack} className="px-4 py-2 border rounded-md">Back</button>
          <button onClick={handleNextStep} className="px-4 py-2 bg-sky-600 text-white rounded-md">{step < 3 ? 'Next' : 'Finish'}</button>
        </div>
      </div>
    </div>
  );
}
