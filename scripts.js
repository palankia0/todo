document.getElementById('add-task-btn').addEventListener('click', addTask);
window.addEventListener('load', loadTasks);

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const taskContent = taskItem.querySelector('.task-header div').textContent;
        const subtasks = [];
        taskItem.querySelectorAll('.subtask-item').forEach(subtaskItem => {
            subtasks.push(subtaskItem.querySelector('div').textContent);
        });
        tasks.push({ taskContent, subtasks });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ taskContent, subtasks }) => {
        const [taskName, taskPriority] = taskContent.split(' [');
        const taskItem = createTaskElement(taskName.trim(), parseInt(taskPriority, 10));
        subtasks.forEach(subtaskName => {
            addSubtask(taskItem, subtaskName);
        });
        document.getElementById('task-list').appendChild(taskItem);
    });
}

function addTask() {
    const taskInfo = prompt('Enter task name and priority separated by a comma (e.g., "Task Name, 2"):', 'New Task, 0');
    
    if (taskInfo === null) {
        return; // User cancelled the prompt
    }
    
    const [taskName, taskPriority] = taskInfo.split(',').map(item => item.trim());
    
    if (!taskName || isNaN(taskPriority)) {
        alert('Invalid input. Please enter the task name and priority separated by a comma.');
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
    taskContent.innerHTML = `${taskName} [${taskPriority}]`;
    
    const btnComplete = document.createElement('button');
    btnComplete.innerHTML = '✔️';
    btnComplete.className = 'complete';
    btnComplete.addEventListener('click', () => {
        if (taskItem.querySelectorAll('.subtask-item').length === 0) {
            taskItem.remove();
            saveTasks();
        } else {
            alert('Complete all subtasks first!');
        }
    });
    
    const btnAddSubtask = document.createElement('button');
    btnAddSubtask.innerHTML = '➕';
    btnAddSubtask.className = 'add-subtask';
    btnAddSubtask.addEventListener('click', () => {
        const subtaskName = prompt('Enter subtask name:', 'New Subtask');
        if (subtaskName !== null) {
            addSubtask(taskItem, subtaskName);
            saveTasks();
        }
    });
    
    taskHeader.appendChild(taskContent);
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
        saveTasks();
    });
    
    subtaskItem.appendChild(subtaskContent);
    subtaskItem.appendChild(btnCompleteSubtask);
    
    subtaskList.appendChild(subtaskItem);
}
