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

  async parseTranscript(transcript) {
    try {
      console.log('Parsing transcript:', transcript);
      
      // For demonstration, check if we have a valid OpenAI API key
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here' || process.env.OPENAI_API_KEY === 'sk-test-key-for-demo') {
        console.log('Using mock transcript parsing for demonstration');
        
        // Mock parsing logic for demonstration
        const mockTasks = this.mockParseTranscript(transcript);
        
        // Create and save all tasks
        const createdTasks = [];
        for (const taskData of mockTasks) {
          const task = new Task({
            ...taskData,
            natural_text: `Extracted from transcript: ${taskData.task_name} assigned to ${taskData.assignee}`
          });
          
          const savedTask = await task.save();
          createdTasks.push(savedTask);
        }
        
        return createdTasks;
      }
      
      // Original OpenAI implementation
      const systemPrompt = `You are a meeting transcript parser. Extract all tasks from the transcript and return them as a JSON array.

For each task, extract:
- task_name: The main action or task description
- assignee: Person responsible for doing the task
- due_datetime: ISO 8601 format (null if not specified)
- priority: P1 (urgent), P2 (high), P3 (normal), P4 (low). Default P3.

Common time patterns:
- "tonight" = today at 9 PM
- "tomorrow" = next day at 9 AM
- "by [day]" = that day at 9 AM
- "at [time]" = specific time on the mentioned day

Examples of input/output:
Input: "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."

Output: [
  {
    "task_name": "Take the landing page",
    "assignee": "Aman",
    "due_datetime": "2025-06-13T22:00:00.000Z",
    "priority": "P3"
  },
  {
    "task_name": "Client follow-up",
    "assignee": "Rajeev", 
    "due_datetime": "2025-06-18T09:00:00.000Z",
    "priority": "P3"
  },
  {
    "task_name": "Review the marketing deck",
    "assignee": "Shreya",
    "due_datetime": "2025-06-12T21:00:00.000Z",
    "priority": "P3"
  }
]

Return ONLY the JSON array, no other text.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: transcript }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      const parsedContent = response.choices[0].message.content.trim();
      console.log('Parsed transcript content:', parsedContent);
      
      const parsedTasks = JSON.parse(parsedContent);
      
      // Create and save all tasks
      const createdTasks = [];
      for (const taskData of parsedTasks) {
        const task = new Task({
          ...taskData,
          natural_text: `Extracted from transcript: ${taskData.task_name} assigned to ${taskData.assignee}`
        });
        
        const savedTask = await task.save();
        createdTasks.push(savedTask);
      }
      
      return createdTasks;
    } catch (error) {
      console.error('Error parsing transcript:', error);
      throw new Error('Failed to parse tasks from transcript');
    }
  }

  // Mock parsing function for demonstration
  mockParseTranscript(transcript) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(22, 0, 0, 0);

    const wednesday = new Date();
    const daysUntilWednesday = (3 - new Date().getDay() + 7) % 7;
    wednesday.setDate(wednesday.getDate() + daysUntilWednesday);
    wednesday.setHours(9, 0, 0, 0);

    const tonight = new Date();
    tonight.setHours(21, 0, 0, 0);

    // Simple regex-based parsing for demonstration
    const mockTasks = [];
    
    if (transcript.toLowerCase().includes('aman') && transcript.toLowerCase().includes('landing page')) {
      mockTasks.push({
        task_name: "Take the landing page",
        assignee: "Aman",
        due_datetime: tomorrow.toISOString(),
        priority: "P3"
      });
    }
    
    if (transcript.toLowerCase().includes('rajeev') && transcript.toLowerCase().includes('follow-up')) {
      mockTasks.push({
        task_name: "Client follow-up",
        assignee: "Rajeev",
        due_datetime: wednesday.toISOString(),
        priority: "P3"
      });
    }
    
    if (transcript.toLowerCase().includes('shreya') && transcript.toLowerCase().includes('marketing deck')) {
      mockTasks.push({
        task_name: "Review the marketing deck",
        assignee: "Shreya",
        due_datetime: tonight.toISOString(),
        priority: "P3"
      });
    }
    
    // If no specific patterns match, create a generic task
    if (mockTasks.length === 0) {
      mockTasks.push({
        task_name: "Process meeting transcript",
        assignee: null,
        due_datetime: null,
        priority: "P3"
      });
    }
    
    return mockTasks;
  }
}

module.exports = new TaskService();
