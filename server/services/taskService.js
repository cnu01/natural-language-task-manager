const OpenAI = require('openai');
const Task = require('../models/Task');

class TaskService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async parseNaturalLanguage(naturalText) {
    try {
      const systemPrompt = `You are a task parser. Extract task_name, assignee, due_datetime (ISO 8601), priority (P1-P4, default P3). Return JSON only.

Rules:
- task_name: The main action or task to be done (include the object/target of the action)
- assignee: Person responsible for DOING the task (null if not specified)
- due_datetime: ISO 8601 format (null if not specified)
- priority: P1 (urgent), P2 (high), P3 (normal), P4 (low). Default P3.

CRITICAL: Distinguish between assignee (who does the task) vs. object of action (who/what the task is about):
- Pattern "TaskDescription PersonName" (PersonName at end without preposition) = PersonName is the ASSIGNEE
- Pattern "Action [preposition] PersonName" = PersonName is the OBJECT/TARGET, NOT the assignee
- Explicit assignment: "assigned to PersonName", "for PersonName" = PersonName is the ASSIGNEE
- Actions with objects: "call X", "email X", "meet with X" = X is the object, NOT the assignee

Examples:
Input: "Send email to John by tomorrow at 3pm"
Output: {"task_name": "Send email to John", "assignee": null, "due_datetime": "2025-06-13T15:00:00.000Z", "priority": "P3"}

Input: "High priority: Review budget report assigned to Sarah"
Output: {"task_name": "Review budget report", "assignee": "Sarah", "due_datetime": null, "priority": "P1"}

Input: "Call client Rajeev tomorrow at 5pm"
Output: {"task_name": "Call client Rajeev", "assignee": null, "due_datetime": "2025-06-13T17:00:00.000Z", "priority": "P3"}

Input: "Finish landing page Aman by 11pm 20th June"
Output: {"task_name": "Finish landing page", "assignee": "Aman", "due_datetime": "2025-06-20T23:00:00.000Z", "priority": "P3"}

Input: "Meeting with Mark assigned to Alice"
Output: {"task_name": "Meeting with Mark", "assignee": "Alice", "due_datetime": null, "priority": "P3"}

Input: "Update website for Tom"
Output: {"task_name": "Update website", "assignee": "Tom", "due_datetime": null, "priority": "P3"}

Input: "Email customer Sarah about refund"
Output: {"task_name": "Email customer Sarah about refund", "assignee": null, "due_datetime": null, "priority": "P3"}

Input: "John needs to prepare presentation by Friday"
Output: {"task_name": "Prepare presentation", "assignee": "John", "due_datetime": "2025-06-13T17:00:00.000Z", "priority": "P3"}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: naturalText }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const parsedContent = response.choices[0].message.content.trim();
      console.log('Parsed Content:', parsedContent);
      return JSON.parse(parsedContent);
    } catch (error) {
      console.error('Error parsing natural language:', error);
      throw new Error('Failed to parse task from natural language');
    }
  }

  async createTask(naturalText) {
    try {
        console.log('Creating task with natural text:', naturalText);
      const parsedTask = await this.parseNaturalLanguage(naturalText);
      
      const task = new Task({
        ...parsedTask,
        natural_text: naturalText
      });

      return await task.save();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      return await Task.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async updateTask(id, updates) {
    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
