// API Service
const API_URL = '/api/todos';

async function fetchTodos() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

async function addTodo(title) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add todo');
  }
  return response.json();
}

async function updateTodo(id, completed) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update todo');
  }
  return response.json();
}

async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete todo');
  }
  return response.json();
}

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');
const emptyStateEl = document.getElementById('empty-state');
const todoTemplate = document.getElementById('todo-template');

// State
let todos = [];

// Render Functions
function showLoading() {
  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';
  emptyStateEl.style.display = 'none';
  todoList.style.display = 'none';
}

function hideLoading() {
  loadingEl.style.display = 'none';
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  todoList.style.display = 'none';
  emptyStateEl.style.display = 'none';
}

function hideError() {
  errorEl.style.display = 'none';
}

function showEmptyState() {
  emptyStateEl.style.display = 'block';
  todoList.style.display = 'none';
}

function hideEmptyState() {
  emptyStateEl.style.display = 'none';
}

function renderTodos() {
  // Clear the list
  todoList.innerHTML = '';

  if (todos.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();
  todoList.style.display = 'block';

  // Render each todo
  todos.forEach((todo) => {
    const template = todoTemplate.content.cloneNode(true);
    const todoItem = template.querySelector('.todo-item');
    const checkbox = template.querySelector('.todo-complete');
    const title = template.querySelector('.todo-title');
    const deleteBtn = template.querySelector('.todo-delete');

    // Set data
    todoItem.dataset.id = todo.id;
    checkbox.checked = todo.completed;
    title.textContent = todo.title;

    if (todo.completed) {
      todoItem.classList.add('completed');
    }

    // Event listeners
    checkbox.addEventListener('change', () => handleToggleComplete(todo.id, checkbox.checked));
    deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));

    todoList.appendChild(todoItem);
  });
}

// Event Handlers
async function handleAddTodo(e) {
  e.preventDefault();
  const title = todoInput.value.trim();

  if (!title) {
    showError('Please enter a task');
    return;
  }

  hideError();
  try {
    const newTodo = await addTodo(title);
    todos.unshift(newTodo);
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
  } catch (error) {
    showError(error.message);
  }
}

async function handleToggleComplete(id, completed) {
  try {
    const updatedTodo = await updateTodo(id, completed);
    // Update local state
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = updatedTodo;
      renderTodos();
    }
  } catch (error) {
    showError(error.message);
    // Revert checkbox
    renderTodos();
  }
}

async function handleDeleteTodo(id) {
  if (!confirm('Delete this task?')) {
    return;
  }

  try {
    await deleteTodo(id);
    todos = todos.filter((t) => t.id !== id);
    renderTodos();
  } catch (error) {
    showError(error.message);
  }
}

// Initialization
async function init() {
  showLoading();
  try {
    todos = await fetchTodos();
    renderTodos();
  } catch (error) {
    showError('Failed to load todos. Please refresh the page.');
    console.error('Error loading todos:', error);
  } finally {
    hideLoading();
  }
}

// Event Listeners
todoForm.addEventListener('submit', handleAddTodo);

// Auto-focus input on page load
window.addEventListener('DOMContentLoaded', () => {
  todoInput.focus();
  init();
});
