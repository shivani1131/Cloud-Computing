const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToDOM(task.text, task.completed));

// Add a new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    addTaskToDOM(taskText, false);
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    taskInput.value = '';
  }
});

// Add task to DOM
function addTaskToDOM(text, completed) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;
  if (completed) li.classList.add('completed');
  li.appendChild(span);

  // Toggle complete
  span.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateTask(span.textContent, li.classList.contains('completed'));
  });

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    const newText = prompt('Edit task:', span.textContent);
    if (newText) {
      span.textContent = newText;
      updateTask(span.textContent, li.classList.contains('completed'), true);
    }
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    tasks = tasks.filter(t => t.text !== span.textContent);
    saveTasks();
  });

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Update task in localStorage
function updateTask(text, completed, isEdit = false) {
  if (isEdit) {
    const index = tasks.findIndex(t => t.text === text);
    if (index !== -1) tasks[index].text = text;
  } else {
    const task = tasks.find(t => t.text === text);
    if (task) task.completed = completed;
  }
  saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    taskList.innerHTML = '';
  }
});
