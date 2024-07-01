document.getElementById('add-task-btn').addEventListener('click', addTask);
window.addEventListener('load', loadTasks);

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const taskContent = taskItem.querySelector('.task-header div').textContent;
        const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Prioridad: ', '');
        const subtasks = [];
        taskItem.querySelectorAll('.subtask-item').forEach(subtaskItem => {
            subtasks.push(subtaskItem.querySelector('div').textContent);
        });
        tasks.push({ taskContent, taskPriority, subtasks });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ taskContent, taskPriority, subtasks }) => {
        const taskItem = createTaskElement(taskContent, taskPriority);
        subtasks.forEach(subtaskName => {
            addSubtask(taskItem, subtaskName);
        });
        document.getElementById('task-list').appendChild(taskItem);
        updateCompleteButtonState(taskItem);
    });
}

function addTask() {
    const taskName = prompt('Introduce el nombre de la tarea:', 'Nueva Tarea');
    if (taskName === null) {
        return; // Usuario canceló el prompt
    }

    const taskPriority = prompt('Introduce la prioridad de la tarea (por defecto es 0):', '0');
    if (taskPriority === null || isNaN(taskPriority)) {
        alert('Prioridad inválida. Introduce un número.');
        return;
    }

    const taskItem = createTaskElement(taskName, taskPriority);
    document.getElementById('task-list').appendChild(taskItem);
    saveTasks();
}

function createTaskElement(taskName, taskPriority) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';

    const taskContent = document.createElement('div');
    taskContent.innerHTML = taskName;

    const priorityContent = document.createElement('div');
    priorityContent.className = 'task-priority';
    priorityContent.innerHTML = `Prioridad: ${taskPriority}`;

    const btnComplete = document.createElement('button');
    btnComplete.innerHTML = '✔️';
    btnComplete.className = 'complete';
    btnComplete.addEventListener('click', () => {
        taskItem.remove();
        saveTasks();
    });

    const btnAddSubtask = document.createElement('button');
    btnAddSubtask.innerHTML = '➕';
    btnAddSubtask.className = 'add-subtask';
    btnAddSubtask.addEventListener('click', () => {
        const subtaskName = prompt('Introduce el nombre de la subtarea:', 'Nueva Subtarea');
        if (subtaskName !== null) {
            addSubtask(taskItem, subtaskName);
            updateCompleteButtonState(taskItem);
            saveTasks();
        }
    });

    taskHeader.appendChild(taskContent);
    taskHeader.appendChild(priorityContent);
    taskHeader.appendChild(btnComplete);
    taskHeader.appendChild(btnAddSubtask);

    taskItem.appendChild(taskHeader);

    return taskItem;
}

function addSubtask(taskItem, subtaskName) {
    const subtaskList = taskItem.querySelector('.subtask-list') || document.createElement('div');
    if (!subtaskList.className) {
        subtaskList.className = 'subtask-list';
        taskItem.appendChild(subtaskList);
    }

    const subtaskItem = document.createElement('div');
    subtaskItem.className = 'subtask-item';

    const subtaskContent = document.createElement('div');
    subtaskContent.innerHTML = subtaskName;

    const btnCompleteSubtask = document.createElement('button');
    btnCompleteSubtask.innerHTML = '✔️';
    btnCompleteSubtask.className = 'complete';
    btnCompleteSubtask.addEventListener('click', () => {
        subtaskItem.remove();
        updateCompleteButtonState(taskItem);
        saveTasks();
    });

    subtaskItem.appendChild(subtaskContent);
    subtaskItem.appendChild(btnCompleteSubtask);

    subtaskList.appendChild(subtaskItem);
}

function updateCompleteButtonState(taskItem) {
    const btnComplete = taskItem.querySelector('button.complete');
    const hasSubtasks = taskItem.querySelectorAll('.subtask-item').length > 0;
    btnComplete.disabled = hasSubtasks;
}
