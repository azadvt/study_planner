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
            <div class="time-tracker">
                <span>Time Spent: ${formatTime(task.timeSpent)}</span>
               <div>
			    <button onclick="startTimer(${index})">Start</button>
                <button onclick="stopTimer(${index})">Stop</button>
                <button onclick="resetTimer(${index})">Reset</button>
				</div>
            </div>
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

function formatTime(seconds) {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hrs.toString().padStart(2, '0')}:${mins
		.toString()
		.padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

let timerIntervals = {};

function startTimer(index) {
	if (timerIntervals[index]) return;
	timerIntervals[index] = setInterval(() => {
		tasks[index].timeSpent = (tasks[index].timeSpent || 0) + 1;
		localStorage.setItem('tasks', JSON.stringify(tasks));
		renderTasks();
	}, 1000);
}

function stopTimer(index) {
	clearInterval(timerIntervals[index]);
	delete timerIntervals[index];
}

function resetTimer(index) {
	stopTimer(index);
	tasks[index].timeSpent = 0;
	localStorage.setItem('tasks', JSON.stringify(tasks));
	renderTasks();
}

function addTask() {
	const taskName = taskInput.value.trim();
	if (taskName) {
		tasks.push({ name: taskName, completed: false, timeSpent: 0 });
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
