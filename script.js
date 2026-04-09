const STORAGE_KEY = "ultimate-todo-tasks";

let currentThemeIndex = 0;
const themeClasses = ["", "theme-light", "theme-pastel", "theme-cyber"];
const themeNames = ["Default", "Sunrise", "Pastel", "Cyberpunk"];

function toggleTheme() {
  document.body.classList.remove("theme-light", "theme-pastel", "theme-cyber");
  currentThemeIndex = (currentThemeIndex + 1) % themeClasses.length;
  const cls = themeClasses[currentThemeIndex];
  if (cls) document.body.classList.add(cls);
  document.getElementById("themeLabel").textContent =
    themeNames[currentThemeIndex];
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function setStoredTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask() {
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDesc");
  const prioritySelect = document.getElementById("taskPriority");

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  const tasks = getStoredTasks();
  tasks.push({
    title,
    desc: desc || "No description provided.",
    priority,
    createdAt: new Date().toLocaleString(),
    completed: false,
  });

  setStoredTasks(tasks);

  titleInput.value = "";
  descInput.value = "";
  prioritySelect.value = "low";

  renderTasks();
}

function renderTasks() {
  const tasks = getStoredTasks();
  const pendingList = document.getElementById("pendingList");
  const completedList = document.getElementById("completedList");

  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task priority-${task.priority}`;

    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";
    mainDiv.innerHTML = `
      <strong>${task.title}</strong>
      <small>${task.desc}</small>
      <small>${
        task.completed
          ? "Completed: " + (task.completedAt || task.createdAt)
          : "Created: " + task.createdAt
      }</small>
    `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    if (!task.completed) {
      const completeBtn = document.createElement("button");
      completeBtn.className = "btn-complete";
      completeBtn.textContent = "Done";
      completeBtn.onclick = () => completeTask(index);
      actionsDiv.appendChild(completeBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);
    actionsDiv.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Del";
    deleteBtn.onclick = () => deleteTask(index);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(actionsDiv);

    if (task.completed) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });
}

function completeTask(index) {
  const tasks = getStoredTasks();
  tasks[index].completed = true;
  tasks[index].completedAt = new Date().toLocaleString();
  setStoredTasks(tasks);
  renderTasks();
}

function editTask(index) {
  const tasks = getStoredTasks();
  const task = tasks[index];

  const newTitle = prompt("Edit task title:", task.title);
  if (newTitle === null) return;
  const newDesc = prompt("Edit description:", task.desc);
  if (newDesc === null) return;

  task.title = newTitle.trim() || task.title;
  task.desc = newDesc.trim() || task.desc;

  setStoredTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getStoredTasks();
  if (!confirm("Delete this task?")) return;
  tasks.splice(index, 1);
  setStoredTasks(tasks);
  renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  document.getElementById("themeLabel").textContent =
    themeNames[currentThemeIndex];
});
