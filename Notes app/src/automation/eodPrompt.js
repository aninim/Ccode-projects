// eodPrompt.js
// End-of-day Claude debrief: 3 questions → structured note + ClickUp task list
// Triggered: manually or by scheduler.js at a set time

/**
 * The 3 EOD questions Oren answers each day
 */
export const EOD_QUESTIONS = [
  'What happened today that you haven\'t written down?',
  'Anything stuck / blocked / waiting on someone?',
  'What\'s the one thing tomorrow must move forward?'
]

/**
 * Parse raw EOD answers into a structured note + action items
 * @param {string[]} answers - array of 3 raw text answers
 * @returns {object} - note object ready for noteParser.saveNote()
 */
export async function processEODAnswers(answers) {
  // TODO: send answers to Copilot/AI → get back structured note + actions
  // Prompt template in docs/copilot-integration.md
  // Return: { body, persons[], project, tags[], priority, actions[] }
  throw new Error('Not implemented yet — Phase 1')
}
