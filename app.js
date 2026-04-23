import { taskElement, toastElement, emptyMsgElement, errMsg } from "./UI/UIElements.js";
import { getAll, add, remove, removeAll, updateStatus } from "./database/db.js";

const state = {
    id: 0,
    title: "",
    description: "",
    status: "",
    date: "",
    filter: ""
}

const filters = {
    all: "all",
    pending: "pending",
    done: "done"
}

const currFilter = () => {
    return BUTTONS.allTasksBtn.checked ? filters.all : BUTTONS.pendingTasksBtn.checked ? filters.pending : filters.done;
}

const INPUTS = {
    titelInput: document.getElementById("task_titel_input"),
    descriptionInput: document.getElementById("task_description_input"),
    searchInput: document.getElementById("search_input")
};

const BUTTONS = {
    seedBtn: document.querySelector(".seed-btn"),
    clearBtn: document.querySelector(".clear-btn"),
    allTasksBtn: document.getElementById("all_tasks"),
    pendingTasksBtn: document.getElementById("pending_tasks"),
    doneTasksBtn: document.getElementById("done_tasks"),
    resetBtn: document.querySelector(".reset-btn"),
    addTaskBtn: document.querySelector(".add-task-btn")
};

const LAYOUT = {
    dataControlArea: document.querySelector(".data-control-area"),
    tasks: document.querySelector(".tasks"),
    tasksCount: document.querySelector(".tasks-count-placeholder")
};

function debounce(func, delay){
    let timer;

    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

const onSearch = debounce((value) => {searchTasks(value)}, 400);

async function searchTasks(value){
    let tasks = await getAll();
    if(tasks.length > 0){
        tasks = tasks.filter(task => task.title.toLowerCase().includes(value) || task.description.toLowerCase().includes(value));
        await getTasks(tasks);
    }
}

INPUTS.searchInput.addEventListener("input", (e) => {onSearch(e.target.value.toLowerCase().trim())})

document.querySelectorAll('input[name="tasks-filter"]').forEach(taskFilter => {
    taskFilter.addEventListener('change', async (e) => {
        let value = e.target.value.trim();
        if(value)
            await getTasks();
    });
});

BUTTONS.seedBtn.addEventListener('click', async () => {
    state.status = filters.pending;
    const dummyData = [
        { title: "Write my homework", desc: "I do my homework at 7:20 PM." },
        { title: "Go to walk", desc: "Wake up at 7:00 AM and go to the park for a 30-minute walk." },
        { title: "Watch a movie with my friends", desc: "Going out at 4 pm to watch an action movie with my friends at the neighborhood cinema." },
    ]

    dummyData.forEach(async (data) => {
        state.title = data.title;
        state.description = data.desc;
        await addNewTask();
    })

    toggleToastAlert(`✅ Dummy data added successfully.`);
    await getTasks();
});

BUTTONS.clearBtn.addEventListener('click', async () => {
    if(!confirm("are you sure you want to clear tasks?")) return;

    let result = await removeAll();
    if(result){
        await getTasks();
        toggleToastAlert("✅ All tasks has been cleared successfully.");
    }
})

BUTTONS.addTaskBtn.addEventListener('click', async () => {
    if(INPUTS.titelInput.value.trim() === "")
    {
        toggleErrorMsg("please fill the title field.");
        return;
    }

    toogleClicking(BUTTONS.addTaskBtn, true);
    state.title = INPUTS.titelInput.value.trim();
    state.description = INPUTS.descriptionInput.value.trim();
    state.status = filters.pending;

    let result = await addNewTask();
    if(result)
    {
        await getTasks();
        toggleToastAlert(`✅ Task with id: ${state.id} added successfully.`);
    }

    toogleClicking(BUTTONS.addTaskBtn, false);
});

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === "Enter")
        BUTTONS.addTaskBtn.click();
})

BUTTONS.resetBtn.addEventListener('click', () => {
    INPUTS.titelInput.value = "";
    INPUTS.descriptionInput.value = "";
});

function toggleErrorMsg(msg)
{
    document.querySelectorAll(".error-msg")?.forEach(el => el.remove());
    LAYOUT.dataControlArea.after(errMsg(msg));

    setTimeout(() => {
        document.querySelector(".error-msg")?.remove();
    }, 4000);
}

function toggleToastAlert(msg)
{
    document.querySelectorAll(".toast-alert")?.forEach(el => el.remove());
    document.body.append(toastElement(msg));

    setTimeout(() => {
        document.querySelector(".toast-alert")?.remove();
    }, 3000);
}

function toogleClicking(btn, value)
{
    btn.disabled = value;
    btn.style.cursor = value ? "not-allowed" : "pointer";
}

async function addNewTask(){
    state.id = await add(state.title, state.description, state.status);
    return (state.id !== 0);
}

async function getTasks(searchResult = null)
{
    LAYOUT.tasks.innerHTML = "";
    let tasks;
    if(searchResult)
        tasks = searchResult;
    else
        tasks = await getAll();

    if(tasks.length > 0)
    {
        let tasksElements = document.createDocumentFragment();

        state.filter = currFilter();
        if(state.filter&& state.filter !== filters.all)
            tasks = tasks.filter(task => task.status === state.filter);

        tasks.forEach(task => {
            tasksElements.append(taskElement(task.id, task.title, task.description, task.status, task.date, deleteTask, updateTask));
        });

        LAYOUT.tasks.append(tasksElements);
    }

    if(tasks.length === 0)
        LAYOUT.tasks.append(emptyMsgElement("there's no tasks !"));

    LAYOUT.tasksCount.textContent = `${tasks.length} shown`;
}

async function deleteTask(id)
{
    if(!confirm("are you sure you want to delete task?")) return;

    let result = await remove(id);
    if(result)
    {
        await getTasks();
        toggleToastAlert(`✅ Task with id: ${id} has been deleted successfully.`);
    }
}

async function updateTask(id, status)
{
    let newStatus = (status === filters.pending ? filters.done : filters.pending);
    let result = await updateStatus(id, newStatus);

    if(result)
    {
        await getTasks();

        if(newStatus === filters.done)
            toggleToastAlert("✅ Greet! Task completed.");
        else
            toggleToastAlert("Task reopened.");
    }
}

await getTasks();