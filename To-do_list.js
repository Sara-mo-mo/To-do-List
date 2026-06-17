document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    let input = document.getElementById("taskInput");
    let ul = document.getElementById("taskList");
    
    if (input.value.trim() === "") return; 

    createTaskElement(input.value);
    saveTasks();
    input.value = "";
}

function createTaskElement(text, isCompleted = false) {
    let ul = document.getElementById("taskList");
    let li = document.createElement("li");
    
   
    let textSpan = document.createElement("span");
    textSpan.textContent = text;
    if (isCompleted) li.classList.add("completed");
    
    textSpan.onclick = function() {
        li.classList.toggle("completed");
        saveTasks();
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() {
        li.style.opacity = "0";
        li.style.transform = "translateX(20px)";
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 200);
    };

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

function saveTasks() {
    let ul = document.getElementById("taskList");
    let tasks = [];
    
    ul.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = () => {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }
};