// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements using their IDs
    const todoinput = document.getElementById("to-do-input");        // Input field for new tasks
    const addtaskbutton = document.getElementById("add-task");       // Button to add new tasks
    const todolist = document.getElementById("todolist");            // Container for task list items

    // Initialize tasks array from localStorage or empty array if no stored tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Render all existing tasks when page loads
    tasks.forEach(task => rendertask(task));

    // Add keyboard support for task input - allows adding task with Enter key
    todoinput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addtaskbutton.click();  // Trigger click event on add button
        }
    });

    // Event listener for add task button
    addtaskbutton.addEventListener("click", () => {
        const tasktext = todoinput.value.trim();  // Get and trim input value
        if (tasktext === "") return;  // Don't add empty tasks

        // Create new task object with unique ID
        const newTask = {
            id: Date.now(),          // Use timestamp as unique ID
            text: tasktext,          // The task text
            completed: false,        // Initial completion status
        };

        tasks.push(newTask);        // Add new task to tasks array
        savetask();                 // Save to localStorage
        rendertask(newTask);        // Render the new task
        todoinput.value = "";       // Clear input field
        console.log(tasks);         // Log tasks array for debugging
    });

    // Function to render a single task
    function rendertask(task) {
        const li = document.createElement("li");               // Create new list item
        li.setAttribute("data-id", task.id);                  // Set task ID as data attribute

        // Set inner HTML of list item with task text and delete button
        // Wrap the task text in a span with a class for targeting
        li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="delete-task">Delete</button>
        `;

        // Add completed class to span if task is completed
        if (task.completed) {
            li.querySelector('.task-text').classList.add("completed");
        }

        // Add click event to toggle task completion
        li.querySelector('.task-text').addEventListener("click", (e) => {
            task.completed = !task.completed;                 // Toggle completion status
            e.target.classList.toggle("completed");           // Toggle completed class on span only
            savetask();                                      // Save changes
        });

        // Add click event to delete button
        li.querySelector(".delete-task").addEventListener("click", (e) => {
            e.stopPropagation();                             // Prevent event bubbling to li
            tasks = tasks.filter((t) => t.id !== task.id);   // Remove task from array
            li.remove();                                     // Remove from DOM
            savetask();                                      // Save changes
        });

        todolist.appendChild(li);                            // Add task to list in DOM
    }

    // Function to save tasks to localStorage
    function savetask() {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Convert to JSON and save
    }
});