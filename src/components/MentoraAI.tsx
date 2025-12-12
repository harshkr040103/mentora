// MENTORA AI Logic Engine
// Implements the 3-phase framework with tough-but-balanced coaching

interface UserProfile {
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  failures: string[];
  interests: string[];
  shortTermGoal?: string;
  midTermGoal?: string;
  longTermGoal?: string;
  accountabilityChoice?: string;
}

export type Phase = "intro" | "phase1" | "phase1_analysis" | "phase2" | "phase2_validation" | "phase3" | "accountability" | "phase4_pdf" | "voice";

export class MentoraAI {
  private userProfile: UserProfile = {
    strengths: [],
    weaknesses: [],
    skills: [],
    failures: [],
    interests: []
  };
  
  private currentPhase: Phase = "intro";
  private phase1Answers: number = 0;
  private phase2Step: number = 0; // Track which goal we're collecting
  private voiceQuestionAsked: boolean = false;

  getCurrentPhase(): Phase {
    return this.currentPhase;
  }

  processMessage(userMessage: string): string {
    const msg = userMessage.trim();

    switch (this.currentPhase) {
      case "intro":
        return this.handleIntro(msg);
      
      case "phase1":
        return this.handlePhase1Collection(msg);
      
      case "phase1_analysis":
        return this.deliverPhase1Analysis();
      
      case "phase2":
        return this.handlePhase2Goals(msg);
      
      case "phase2_validation":
        return this.validateAllGoals(msg);
      
      case "phase3":
        return this.deliverPhase3Strategy();
      
      case "accountability":
        return this.handleAccountability(msg);
      
      case "phase4_pdf":
        return this.generatePDFRoadmap();
      
      case "voice":
        return this.handleVoiceAssistant(msg);
      
      default:
        return "System error. Restart session.";
    }
  }

  private handleIntro(msg: string): string {
    this.currentPhase = "phase1";
    this.phase1Answers = 0;
    
    return `Understood. Before we move forward, I need to map your current state.

**PHASE 1: WHERE AM I?**

Answer these 5 questions. Be specific, not vague.

1. **Top 3 strengths** — What are you genuinely good at?`;
  }

  private handlePhase1Collection(msg: string): string {
    this.phase1Answers++;

    // Store answers based on question number
    if (this.phase1Answers === 1) {
      this.userProfile.strengths = this.parseListAnswer(msg);
      return `2. **Top 3 weaknesses** — What consistently holds you back?`;
    }
    
    if (this.phase1Answers === 2) {
      this.userProfile.weaknesses = this.parseListAnswer(msg);
      return `3. **Skills / past experience** — What have you actually done or built?`;
    }
    
    if (this.phase1Answers === 3) {
      this.userProfile.skills = this.parseListAnswer(msg);
      return `4. **Patterns in failures** — When things go wrong, what's usually the cause?`;
    }
    
    if (this.phase1Answers === 4) {
      this.userProfile.failures = this.parseListAnswer(msg);
      return `5. **Interests and energizers** — What activities make time disappear for you?`;
    }
    
    if (this.phase1Answers === 5) {
      this.userProfile.interests = this.parseListAnswer(msg);
      this.currentPhase = "phase1_analysis";
      return this.deliverPhase1Analysis();
    }

    return "Continue...";
  }

  private deliverPhase1Analysis(): string {
    const { strengths, weaknesses, skills, interests, failures } = this.userProfile;
    
    this.currentPhase = "phase2";

    return `**YOUR PERSONAL SWOT ANALYSIS**

**STRENGTHS:**
${strengths.map(s => `• ${s}`).join('\n')}

**WEAKNESSES:**
${weaknesses.map(w => `• ${w}`).join('\n')}

**OPPORTUNITIES:**
${this.generateOpportunities(strengths, skills, interests)}

**THREATS:**
${this.generateThreats(weaknesses, failures)}

This is your starting point. Now let's define where you want to go.

**PHASE 2: WHERE DO I WANT TO GO?**

Define ONE clear short-term goal (0–12 months). Make it specific and measurable. No vague dreams.`;
  }

  private handlePhase2Goals(msg: string): string {
    this.phase2Step++;

    // Step 1: Collect short-term goal
    if (this.phase2Step === 1) {
      this.userProfile.shortTermGoal = msg;
      return `Now define ONE mid-term goal (1–3 years). What's the measurable milestone?`;
    }
    
    // Step 2: Collect mid-term goal
    if (this.phase2Step === 2) {
      this.userProfile.midTermGoal = msg;
      return `Final one: Long-term direction (3–7 years). What version of yourself are you building toward?`;
    }
    
    // Step 3: Collect long-term goal and move to validation
    if (this.phase2Step === 3) {
      this.userProfile.longTermGoal = msg;
      this.currentPhase = "phase2_validation";
      return this.validateAllGoals("");
    }

    return "Continue...";
  }

  private validateAllGoals(msg: string): string {
    const { shortTermGoal, midTermGoal, longTermGoal, strengths, weaknesses } = this.userProfile;

    // If user is responding to a rewrite request
    if (msg.trim().length > 0) {
      // Check if user is confirming despite contradictions
      if (msg.toUpperCase().includes("YES")) {
        this.currentPhase = "phase3";
        return this.deliverPhase3Strategy();
      }

      // Parse the rewritten goals - expect user to provide all three
      const lines = msg.split('\n').filter(line => line.trim().length > 20);
      
      if (lines.length >= 3) {
        this.userProfile.shortTermGoal = lines[0].trim();
        this.userProfile.midTermGoal = lines[1].trim();
        this.userProfile.longTermGoal = lines[2].trim();
      } else {
        return `You must provide all three goals separately before we continue. Short-term, mid-term, long-term.

Provide them on separate lines or clearly labeled.`;
      }
    }

    // Check if all three goals exist
    if (!shortTermGoal || !midTermGoal || !longTermGoal) {
      return `You must provide all three goals separately before we continue. Short-term, mid-term, long-term.`;
    }

    // Validate each goal for specificity
    const issues: string[] = [];
    
    if (!this.isGoalSpecific(shortTermGoal) || shortTermGoal.length < 20) {
      issues.push("**Short-term goal** is too vague or lacks detail");
    }
    
    if (!this.isGoalSpecific(midTermGoal) || midTermGoal.length < 20) {
      issues.push("**Mid-term goal** is too vague or lacks detail");
    }
    
    if (!this.isGoalSpecific(longTermGoal) || longTermGoal.length < 20) {
      issues.push("**Long-term goal** is too vague or lacks detail");
    }

    // If there are specificity issues
    if (issues.length > 0) {
      return `These goals are not specific or measurable. Rewrite them using clear outcomes and timeframes.

**Issues identified:**
${issues.map(i => `• ${i}`).join('\n')}

**Examples of specific goals:**
• "Launch a SaaS product with 100 paying customers by December 2025"
• "Become senior engineer at FAANG company within 2 years"
• "Build a $500K/year consulting practice by 2028"

**NOT acceptable:**
• "I want success"
• "Get better at my job"
• "Be more financially stable"

Rewrite your three goals now (provide all three):`;
    }

    // Check if goals contradict SWOT
    const contradictions = this.checkGoalSwotAlignment(shortTermGoal, midTermGoal, longTermGoal, strengths, weaknesses);
    
    if (contradictions.length > 0) {
      return `**WARNING:** Your goals may contradict your current SWOT analysis.

${contradictions.map(c => `• ${c}`).join('\n')}

These aren't impossible, but they require you to overcome significant weaknesses. Are you committed to this path?

Reply "YES" to proceed or rewrite your goals.`;
    }

    // All validation passed - proceed to Phase 3
    this.currentPhase = "phase3";
    return this.deliverPhase3Strategy();
  }

  private deliverPhase3Strategy(): string {
    const { shortTermGoal, midTermGoal, longTermGoal, strengths, weaknesses } = this.userProfile;
    
    this.currentPhase = "accountability";

    return `**PHASE 3: HOW WILL I REACH THERE?**

**90-DAY ACTION PLAN:**

**Weeks 1-4:**
• Audit current skill gaps related to "${shortTermGoal}"
• Identify 3 learning resources or mentors in this space
• Start daily habit: 1 hour dedicated skill-building

**Weeks 5-8:**
• Build one visible project/portfolio piece
• Connect with 5 people already doing what you want
• Document progress weekly

**Weeks 9-12:**
• Apply learnings in real scenario
• Get external feedback on your work
• Make first measurable achievement toward goal

**1–3 YEAR STRATEGY:**

**What to START:**
${this.generateStartBehaviors(shortTermGoal, midTermGoal, strengths)}

**What to STOP:**
${this.generateStopBehaviors(weaknesses)}

**Skill Progression:**
${this.generateSkillPath(shortTermGoal, midTermGoal)}

**3–7 YEAR DIRECTION:**
${this.generateLongTermPath(longTermGoal, strengths)}

**REALITY CHECK:**
${this.generateRealityCheck(shortTermGoal, strengths, weaknesses)}

---

**Choose one:**
A) Weekly check-ins
B) Monthly check-ins  
C) No check-ins

What's your choice?`;
  }

  private handleAccountability(msg: string): string {
    const choice = msg.toUpperCase().trim();
    let accountabilityPlan = "";
    
    if (choice.includes('A') || choice.includes('WEEK')) {
      this.userProfile.accountabilityChoice = "Weekly check-ins";
      accountabilityPlan = `**WEEKLY CHECK-IN TEMPLATE:**

Every week, report:
1. **This week's wins** — What moved forward?
2. **Main obstacle** — What blocked progress?
3. **Next week's 3 actions** — Specific tasks
4. **Hours spent developing skills** — Track time

Post this every 7 days. I'll hold you accountable.

Your first check-in is due in 7 days.`;
    } else if (choice.includes('B') || choice.includes('MONTH')) {
      this.userProfile.accountabilityChoice = "Monthly check-ins";
      accountabilityPlan = `**MONTHLY CHECK-IN TEMPLATE:**

Every 30 days, report:
1. **This month's wins** — Measurable progress
2. **Main obstacle** — What needs solving?
3. **Next month's priorities** — Top 3 focus areas
4. **Total hours invested** — Skill development time

First check-in: ${this.getDateInFuture(30)}`;
    } else {
      this.userProfile.accountabilityChoice = "No check-ins";
      accountabilityPlan = `No check-ins selected. Remember: clarity without action is just entertainment.`;
    }
    
    // Move to Phase 4 - PDF generation
    this.currentPhase = "phase4_pdf";
    
    return `${accountabilityPlan}

---

Generating your complete personalized roadmap now...`;
  }

  // Helper functions
  private parseListAnswer(answer: string): string[] {
    // Split by common delimiters and clean
    const items = answer
      .split(/[,;\n]|and/)
      .map(s => s.trim().replace(/^[\d\.\-\•]\s*/, ''))
      .filter(s => s.length > 0);
    
    return items.length > 0 ? items : [answer];
  }

  private isGoalSpecific(goal: string): boolean {
    // Check for vague words
    const vagueWords = ['better', 'more', 'improve', 'good', 'successful'];
    const lowerGoal = goal.toLowerCase();
    
    const hasVagueWords = vagueWords.some(word => lowerGoal.includes(word));
    const hasNumbers = /\d/.test(goal);
    const hasTimeframe = /(by|in|within|until)/.test(lowerGoal);
    
    return !hasVagueWords || hasNumbers || hasTimeframe;
  }

  private generateOpportunities(strengths: string[], skills: string[], interests: string[]): string {
    const combined = [...strengths, ...skills, ...interests];
    return `• Leverage your existing strengths in new markets or roles
• Combine technical skills with soft skills for unique positioning  
• Use interests as differentiators in competitive spaces`;
  }

  private generateThreats(weaknesses: string[], failures: string[]): string {
    return `• Repeated patterns of ${failures[0] || 'past mistakes'} could sabotage progress
• Weaknesses in ${weaknesses[0] || 'key areas'} may limit opportunities
• Staying in comfort zone will prevent necessary growth`;
  }

  private generateStartBehaviors(short: string = "", mid: string = "", strengths: string[]): string {
    return `• Daily deliberate practice on skills required for "${short}"
• Regular networking with people 2-3 steps ahead
• Weekly progress documentation and self-assessment
• Saying yes to uncomfortable growth opportunities`;
  }

  private generateStopBehaviors(weaknesses: string[]): string {
    return `• Avoiding ${weaknesses[0] || 'difficult conversations or challenges'}
• Consuming content without creating or implementing
• Waiting for perfect conditions before taking action
• Comparing your chapter 1 to someone else's chapter 20`;
  }

  private generateSkillPath(short: string = "", mid: string = ""): string {
    return `**Year 1:** Foundation skills + first real project
**Year 2:** Advanced capabilities + visible portfolio
**Year 3:** Expert positioning + leadership/influence`;
  }

  private generateLongTermPath(long: string = "", strengths: string[]): string {
    return `With consistent execution, you could realistically become someone who ${long || 'achieves their defined vision'}.

Your current strengths in ${strengths[0] || 'key areas'} provide a foundation. The gap between current and future self will close through:
• Accumulation of micro-wins
• Pattern recognition from failures
• Strategic skill stacking
• Maintained discipline over years

This isn't guaranteed. It's probability-based. Your execution determines the outcome.`;
  }

  private generateRealityCheck(goal: string = "", strengths: string[], weaknesses: string[]): string {
    return `Based on your SWOT analysis, "${goal}" is achievable IF you address ${weaknesses[0] || 'your core weaknesses'} aggressively.

Your ${strengths[0] || 'current strengths'} won't carry you all the way. You'll need to build new capabilities and eliminate behaviors that have historically held you back.

Probability of success with current habits: 30%
Probability with strategic behavior change: 75%

The path exists. Whether you walk it is your choice.`;
  }

  private getDateInFuture(days: number): string {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return future.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  private checkGoalSwotAlignment(short: string, mid: string, long: string, strengths: string[], weaknesses: string[]): string[] {
    const contradictions: string[] = [];

    // Check if short-term goal contradicts weaknesses
    if (weaknesses.some(w => short.toLowerCase().includes(w.toLowerCase()))) {
      contradictions.push(`Short-term goal "${short}" may be hindered by your weakness in "${weaknesses.find(w => short.toLowerCase().includes(w.toLowerCase()))}".`);
    }

    // Check if mid-term goal contradicts weaknesses
    if (weaknesses.some(w => mid.toLowerCase().includes(w.toLowerCase()))) {
      contradictions.push(`Mid-term goal "${mid}" may be hindered by your weakness in "${weaknesses.find(w => mid.toLowerCase().includes(w.toLowerCase()))}".`);
    }

    // Check if long-term goal contradicts weaknesses
    if (weaknesses.some(w => long.toLowerCase().includes(w.toLowerCase()))) {
      contradictions.push(`Long-term goal "${long}" may be hindered by your weakness in "${weaknesses.find(w => long.toLowerCase().includes(w.toLowerCase()))}".`);
    }

    return contradictions;
  }

  private generatePDFRoadmap(): string {
    const { strengths, weaknesses, skills, interests, failures, shortTermGoal, midTermGoal, longTermGoal, accountabilityChoice } = this.userProfile;
    
    // Transition to voice mode after showing PDF
    this.currentPhase = "voice";
    
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `**═══════════════════════════════════════**
**MENTORA — PERSONALIZED GROWTH & STRATEGY ROADMAP**
**═══════════════════════════════════════**

Generated: ${today}

---

**SECTION 1: YOUR SWOT ANALYSIS**

**STRENGTHS:**
${strengths.map(s => `• ${s}`).join('\n')}

**WEAKNESSES:**
${weaknesses.map(w => `• ${w}`).join('\n')}

**OPPORTUNITIES:**
• Leverage existing strengths in new markets or roles
• Combine technical skills with soft skills for unique positioning
• Use interests as differentiators in competitive spaces

**THREATS:**
• Repeated patterns of ${failures[0] || 'past mistakes'} could sabotage progress
• Weaknesses in ${weaknesses[0] || 'key areas'} may limit opportunities
• Staying in comfort zone will prevent necessary growth

---

**SECTION 2: YOUR GOALS**

**SHORT-TERM GOAL (0–12 months):**
${shortTermGoal}

**MID-TERM GOAL (1–3 years):**
${midTermGoal}

**LONG-TERM DIRECTION (3–7 years):**
${longTermGoal}

---

**SECTION 3: 90-DAY ACTION PLAN**

**WEEKS 1–4: Foundation Phase**
• Audit current skill gaps related to short-term goal
• Identify 3 learning resources or mentors in this space
• Start daily habit: 1 hour dedicated skill-building
• Set up tracking system for progress

**WEEKS 5–8: Build Phase**
• Create one visible project or portfolio piece
• Connect with 5 people already doing what you want
• Document progress weekly in structured format
• Get feedback on your work from experts

**WEEKS 9–12: Launch Phase**
• Apply learnings in real-world scenario
• Get external feedback and iterate
• Make first measurable achievement toward goal
• Assess what's working and what needs adjustment

---

**SECTION 4: 1–3 YEAR STRATEGY**

**BEHAVIORS TO START:**
• Daily deliberate practice on skills required for "${shortTermGoal}"
• Regular networking with people 2-3 steps ahead
• Weekly progress documentation and self-assessment
• Saying yes to uncomfortable growth opportunities

**BEHAVIORS TO STOP:**
• Avoiding ${weaknesses[0] || 'difficult conversations or challenges'}
• Consuming content without creating or implementing
• Waiting for perfect conditions before taking action
• Comparing your chapter 1 to someone else's chapter 20

**SKILL PROGRESSION PATH:**
• **Year 1:** Foundation skills + first real project
• **Year 2:** Advanced capabilities + visible portfolio
• **Year 3:** Expert positioning + leadership/influence

---

**SECTION 5: 3–7 YEAR DIRECTION**

With consistent execution, you could realistically become someone who ${longTermGoal || 'achieves their defined vision'}.

**Path to Long-Term Success:**
• Accumulation of micro-wins over time
• Pattern recognition from failures and adjustments
• Strategic skill stacking in complementary areas
• Maintained discipline across multiple years

Your current strengths in ${strengths[0] || 'key areas'} provide a foundation. The gap between current and future self will close through deliberate action, not time alone.

This isn't guaranteed. It's probability-based. Your execution determines the outcome.

---

**SECTION 6: REALITY CHECK**

Based on your SWOT analysis, "${shortTermGoal}" is achievable IF you address ${weaknesses[0] || 'your core weaknesses'} aggressively.

Your ${strengths[0] || 'current strengths'} won't carry you all the way. You'll need to build new capabilities and eliminate behaviors that have historically held you back.

**Success Probability Analysis:**
• With current habits: ~30%
• With strategic behavior change: ~75%

The path exists. Whether you walk it is your choice.

---

**SECTION 7: ACCOUNTABILITY PLAN**

**Selected Plan:** ${accountabilityChoice}

${this.getAccountabilityDetails(accountabilityChoice || "No check-ins")}

---

**SECTION 8: NEXT-STEP AI ASSISTANT**

**MENTORA Voice is now active.**

MENTORA Voice helps you execute this roadmap through:
• Quick answers to strategy questions
• Reflective questioning to maintain clarity
• Voice-friendly conversational support
• Habit-building and progress tracking

To activate MENTORA Voice, simply speak or type your question.

---

**END OF ROADMAP**

═══════════════════════════════════════

**Your personalized roadmap is ready.**

**MENTORA Voice is now active and ready for your next command — speak or type your question.**

I'll start with some reflective questions to help you execute:`;
  }

  private getAccountabilityDetails(choice: string): string {
    if (choice.includes("Weekly")) {
      return `**Weekly Check-In Template:**
1. This week's wins — What moved forward?
2. Main obstacle — What blocked progress?
3. Next week's 3 actions — Specific tasks
4. Hours spent developing skills — Track time

First check-in due: ${this.getDateInFuture(7)}`;
    } else if (choice.includes("Monthly")) {
      return `**Monthly Check-In Template:**
1. This month's wins — Measurable progress
2. Main obstacle — What needs solving?
3. Next month's priorities — Top 3 focus areas
4. Total hours invested — Skill development time

First check-in due: ${this.getDateInFuture(30)}`;
    } else {
      return `No structured check-ins selected. You're responsible for your own accountability. Clarity without action is just entertainment.`;
    }
  }

  private handleVoiceAssistant(msg: string): string {
    // First interaction - ask reflective questions
    if (!this.voiceQuestionAsked) {
      this.voiceQuestionAsked = true;
      return `**1. Which part of the roadmap feels hardest to start?**

(I'll ask 5 questions total to help you get started)`;
    }

    // Respond to user's answer and ask next question
    const response = this.generateVoiceResponse(msg);
    return response;
  }

  private generateVoiceResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();
    
    // Detect what the user is asking about
    if (msg.includes("hard") || msg.includes("difficult") || msg.includes("stuck")) {
      return `The hardest part is always starting. Break it into micro-actions.

What's one 15-minute task you can do today related to your goal?

**2. What is the first action you will take in the next 24 hours?**`;
    }
    
    if (msg.includes("action") || msg.includes("task") || msg.includes("do") || msg.includes("start")) {
      return `Good. Commit to that specific action. Write it down. Set a timer.

**3. Do you want me to set reminders for your habit-building?**

(Reply YES for daily/weekly reminders, or NO to self-manage)`;
    }
    
    if (msg.includes("yes") || msg.includes("reminder")) {
      return `Understood. I recommend:
• Daily 9 AM reminder: "1 hour skill-building time"
• Weekly Sunday reminder: "Review progress and plan next week"

**4. Would you like a weekly voice check-in?**

(Short 5-minute conversation to review your wins and obstacles)`;
    }
    
    if (msg.includes("week") || msg.includes("check-in") || msg.includes("no")) {
      return `Your choice. Remember: consistency beats intensity.

**5. Do you want a simplified version of today's strategy?**

I can break down your 90-day plan into today's single focus.`;
    }
    
    if (msg.includes("today") || msg.includes("simple") || msg.includes("focus")) {
      return `**Today's single focus:**

${this.getTodaysFocus()}

That's it. One thing. Do that today.

---

**MENTORA Voice is ready.** Ask me anything about your roadmap:
• "What should I prioritize this week?"
• "How do I overcome [specific obstacle]?"
• "Break down [skill] into learning steps"
• "Am I on track?"

What do you need?`;
    }
    
    // General conversational responses
    if (msg.includes("prioritize") || msg.includes("what should")) {
      return `This week: Focus on the Week 1-4 actions from your 90-day plan.

Specifically:
1. Audit your skill gaps (2 hours)
2. Find 3 learning resources (1 hour)
3. Start 1-hour daily practice habit (7 days)

Pick ONE to start today. Which one?`;
    }
    
    if (msg.includes("overcome") || msg.includes("obstacle") || msg.includes("problem")) {
      return `Name the specific obstacle. I'll help you break it down.

Most obstacles are one of three types:
1. Skill gap (learnable)
2. Fear/mindset (addressable)
3. Time/resources (solvable)

Which type is blocking you?`;
    }
    
    if (msg.includes("learn") || msg.includes("skill") || msg.includes("how to")) {
      return `Break any skill into 4 steps:

1. Find 1 expert to follow
2. Practice 1 hour daily for 30 days
3. Build 1 project using that skill
4. Get feedback from someone better than you

What skill are you building?`;
    }
    
    if (msg.includes("track") || msg.includes("on track") || msg.includes("progress")) {
      return `You're on track if you can answer YES to:

1. Did I work on my goal today?
2. Am I closer than yesterday?
3. Have I eliminated 1 distraction?

If all three = YES, you're progressing.
If NO to any, course-correct tomorrow.

How many YES answers do you have?`;
    }
    
    // Default helpful response
    return `I'm here to help you execute your roadmap.

Quick commands:
• "What should I focus on today?"
• "Break down my next step"
• "Am I on track?"
• "Help me overcome [obstacle]"

What do you need right now?`;
  }

  private getTodaysFocus(): string {
    const { shortTermGoal } = this.userProfile;
    return `Spend 30 minutes researching or practicing one skill directly related to: "${shortTermGoal}"

Don't overcomplicate it. Just start. Imperfect action beats perfect planning.`;
  }

  // Get user profile for potential PDF export
  getUserProfile(): UserProfile {
    return this.userProfile;
  }
}