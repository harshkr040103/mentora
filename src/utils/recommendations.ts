export type Mode = 'personal' | 'organisation';

export type Assessment = {
  currentState?: Record<string, string>;
  desiredState?: Record<string, string>;
  strategy?: Record<string, string>;
};

function textIncludes(value: string | undefined, keywords: string[]) {
  if (!value) return false;
  const v = value.toLowerCase();
  return keywords.some((k) => v.includes(k));
}

/**
 * Return simple, rule-based recommendations based on mode, goals and assessment.
 */
export function getRecommendations(mode: Mode, goals: string[] = [], assessment: Assessment = {}) {
  const recs: string[] = [];

  const cur = assessment.currentState || {};
  const strat = assessment.strategy || {};
  const desired = assessment.desiredState || {};

  if (mode === 'personal') {
    if (goals.some((g) => /consist/i.test(g)) || textIncludes(cur['time'] || cur['consistency'], ['no', 'not', 'little', 'low', 'inconsistent'])) {
      recs.push('Implement a habit system: daily micro-actions, simple rituals, and an accountability check-in to build consistency.');
    }

    if (goals.some((g) => /clarit/i.test(g)) || textIncludes(cur['clarity'], ['no', 'not', 'unclear', 'confused'])) {
      recs.push('Create a 90-day clarity plan: define a focused outcome, 3 milestones, and weekly reviews.');
    }

    if (goals.some((g) => /skill/i.test(g))) {
      recs.push('Adopt deliberate practice for skill development: focused blocks, feedback loops and a learning roadmap.');
    }

    if (textIncludes(desired['timeline'], ['short', '3', '6'])) {
      recs.push('Ambitious timeline detected — build a concentrated 90-day plan with tight milestones.');
    }

    if (textIncludes(strat['constraints'], ['time', 'resources', 'limited', 'constraint'])) {
      recs.push('Plan around constraints: prioritize high-impact micro-tasks and reduce scope where needed.');
    }
  }

  if (mode === 'organisation') {
    if (goals.some((g) => /productiv/i.test(g)) || textIncludes(cur['productivity'], ['low', 'poor', 'declin'])) {
      recs.push('Start short weekly syncs and short retros to surface blockers and improve team productivity.');
    }

    if (textIncludes(cur['alignment'], ['no', 'not', 'misalign', 'disagree'])) {
      recs.push('Run a prioritisation + alignment workshop to agree top objectives and owners.');
    }

    if (goals.some((g) => /leadership/i.test(g))) {
      recs.push('Introduce leadership development (coaching, 1:1 growth plans, and shadowing).');
    }

    if (textIncludes(cur['communication'] || '', ['poor', 'lack', 'not communicating', 'gap'])) {
      recs.push('Improve communication: establish weekly cross-team syncs and clear async norms.');
    }

    if (textIncludes(strat['process'], ['bottleneck', 'slow', 'inefficien'])) {
      recs.push('Pilot a process optimisation with measurable KPIs and a single improvement owner.');
    }
  }

  // Generic rules based on goals
  if (goals.includes('Employee growth') || goals.includes('Confidence & mindset')) {
    recs.push('Add regular feedback loops and micro-mentoring to accelerate growth and confidence.');
  }

  // dedupe and return
  return Array.from(new Set(recs));
}

export default getRecommendations;
