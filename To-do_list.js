function addTask() {
    let input = document.getElementById("taskInput");
    let ul = document.getElementById("taskList");
    
    if (input.value.trim() === "") return; 

    let li = document.createElement("li");
    li.textContent = input.value;

    li.onclick = function () {
        li.remove(); 
        saveTasks(); 
    };

    ul.appendChild(li);
    saveTasks();
    input.value = "";
}

function saveTasks() {
    let ul = document.getElementById("taskList");
    let tasks = [];
    
    ul.querySelectorAll("li").forEach(li => {
        tasks.push(li.textContent);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = () => {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        let ul = document.getElementById("taskList");

        tasks.forEach(taskText => {
            let li = document.createElement("li");
            li.textContent = taskText;
            
            li.onclick = function () {
                li.remove();
                saveTasks();
            };
            
            ul.appendChild(li);
        });
    }
};