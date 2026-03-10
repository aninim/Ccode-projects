// clickup.js
// One-way push: note actions → ClickUp tasks
// v1: push only. Pull back task status (open/done) only.
// v2 (Phase 5): two-way sync — NOT in scope yet.

const BASE_URL = 'https://api.clickup.com/api/v2'

/**
 * Push a single action item to ClickUp as a task
 * @param {object} action - { text, assignee, due, clickup_id }
 * @param {string} listId - ClickUp list ID to create task in
 * @returns {string} clickup task ID
 */
export async function pushTaskToClickUp(action, listId) {
  const apiKey = process.env.CLICKUP_API_KEY
  if (!apiKey) throw new Error('CLICKUP_API_KEY not set in .env')

  const response = await fetch(`${BASE_URL}/list/${listId}/task`, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: action.text,
      due_date: action.due ? new Date(action.due).getTime() : undefined,
      assignees: [], // TODO: map action.assignee → ClickUp user ID via indexManager
      status: 'open'
    })
  })

  const data = await response.json()
  return data.id // save back to note's action.clickup_id
}

/**
 * Pull task status for a list of clickup_ids
 * v1: only reads open/done — no full sync
 */
export async function pullTaskStatuses(clickupIds) {
  // TODO: implement — GET /task/{task_id} for each id
  // Return: { [clickup_id]: 'open' | 'done' }
}
