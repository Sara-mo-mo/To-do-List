// تشغيل وظيفة الـ Enter داخل حقل الإدخال لتسهيل الكتابة
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {
    let input = document.getElementById("taskInput");
    let deadlineInput = document.getElementById("taskDeadline");
    
    if (input.value.trim() === "") return; 

    let taskText = input.value;
    let taskDeadline = deadlineInput.value; 

    createTaskElement(taskText, taskDeadline, false);
    saveTasks();
    
    // تفريغ المدخلات بعد الإضافة
    input.value = "";
    deadlineInput.value = "";
}

// دالة متكاملة لبناء عناصر المهام داخل القائمة
function createTaskElement(text, deadline, isCompleted = false) {
    let ul = document.getElementById("taskList");
    let li = document.createElement("li");
    
    // حفظ الميعاد الخام في العنصر لكي نتمكن من حفظه بدقة في الـ LocalStorage
    if (deadline) li.setAttribute("data-deadline", deadline);
    
    // وعاء نص المهمة والتاريخ
    let contentContainer = document.createElement("div");
    contentContainer.className = "task-content";

    let textSpan = document.createElement("span");
    textSpan.textContent = text;
    textSpan.className = "task-text";
    contentContainer.appendChild(textSpan);

    // التحقق من وجود ميعاد وعرضه بشكل منسق باللغة العربية
    if (deadline) {
        let dateObj = new Date(deadline);
        let formattedDate = dateObj.toLocaleString('ar-EG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let timeSpan = document.createElement("span");
        timeSpan.textContent = ` ⏰ الموعد: ${formattedDate}`;
        timeSpan.className = "task-time";
        
        // إذا انتهى الموعد الفعلي والمهمة لم تكتمل بعد، تلون بالأحمر
        if (new Date() > dateObj && !isCompleted) {
            timeSpan.style.color = "#f87171";
            timeSpan.style.fontWeight = "bold";
        }
        
        contentContainer.appendChild(timeSpan);
    }

    if (isCompleted) li.classList.add("completed");
    
    // عند الضغط على النص يتم التبديل بين (مكتمل / غير مكتمل)
    contentContainer.onclick = function() {
        li.classList.toggle("completed");
        saveTasks();
    };

    // زر حذف على شكل أيقونة سلة مهملات وبحركة خروج ناعمة
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() {
        li.style.opacity = "0";
        li.style.transform = "translateX(-20px)";
        setTimeout(() => {
            li.remove();
            saveTasks();
        }, 250);
    };

    li.appendChild(contentContainer);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

// دالة حفظ المهام الحالية في ذاكرة المتصفح المحلية
function saveTasks() {
    let ul = document.getElementById("taskList");
    let tasks = [];
    
    ul.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            deadline: li.getAttribute("data-deadline") || "",
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// استرجاع المهام تلقائياً عند فتح الصفحة
window.onload = () => {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            createTaskElement(task.text, task.deadline, task.completed);
        });
    }
};