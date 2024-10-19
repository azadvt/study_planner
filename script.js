const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const progressPercentage = document.getElementById('progress-percentage');
const progressBarFill = document.querySelector('.progress-bar-fill');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
	taskList.innerHTML = '';
	tasks.forEach((task, index) => {
		const taskDiv = document.createElement('div');
		taskDiv.className = 'task';
		if (task.completed) {
			taskDiv.classList.add('completed');
		}
		taskDiv.innerHTML = `
            <span>${task.name}</span>
            <div class="task-actions">
                <button onclick="toggleTask(${index})">${
			task.completed ? 'Undo' : 'Complete'
		}</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
		taskList.appendChild(taskDiv);
	});
	updateProgress();
}

function addTask() {
	const taskName = taskInput.value.trim();
	if (taskName) {
		tasks.push({ name: taskName, completed: false });
		localStorage.setItem('tasks', JSON.stringify(tasks));
		taskInput.value = '';
		renderTasks();
	}
}

function toggleTask(index) {
	tasks[index].completed = !tasks[index].completed;
	localStorage.setItem('tasks', JSON.stringify(tasks));
	renderTasks();
}

function deleteTask(index) {
	tasks.splice(index, 1);
	localStorage.setItem('tasks', JSON.stringify(tasks));
	renderTasks();
}

function updateProgress() {
	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.completed).length;
	const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
	progressPercentage.textContent = `${Math.round(progress)}%`;
	progressBarFill.style.width = `${progress}%`;
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') {
		addTask();
	}
});

renderTasks();
