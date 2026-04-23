export function taskElement(id, title, description, status, date, deleteCallback, changeStatusCallback){
    let card = document.createElement('div');
    card.classList.add("task-card");
    card.innerHTML = `
        <h3 class="task-title"></h3>
        <p class="task-desc"></p>
        <div class="tags-area">
            <span class="tag task-id">#${id}</span>
            <span class="tag task-status">${status}</span>
            <span class="tag task-created-date">Created: ${date}</span>
        </div>
        <div class="task-action-btns">
            <button class="delete-btn seondary-btn">❌ Delete</button>
            <button class="change-task-status primary-btn"></button>
        </div>
    `;

    card.querySelector(".task-title").textContent = title;
    card.querySelector(".task-desc").textContent = description || "-";

    let deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener('click', () => {
        deleteCallback(id);
    });

    let changeStatusBtn = card.querySelector(".change-task-status");
    changeStatusBtn.addEventListener('click', (e) => {
        changeStatusCallback(id, status);
        changeTaskStatusStyle(status, e.target, e.target.parentElement);
    });

    changeTaskStatusStyle(status, changeStatusBtn, card);

    return card;
}

export function changeTaskStatusStyle(status, btn, card){
    const isPending = status === "pending";
    btn.textContent = isPending ? "✅ Mark done" : "↩️ Mark pending";

    card.classList.toggle("pending-state", isPending);
    card.classList.toggle("done-state", !isPending);
}

export function toastElement(msg)
{
    let toast = document.createElement("div");
    toast.classList.add("toast-alert");
    toast.textContent = msg;

    return toast;
}

export function emptyMsgElement(msg)
{
    let element = document.createElement("p");
    element.classList.add("empty-msg");
    element.textContent = msg;

    return element;
}

export function errMsg(msg)
{
    let element = document.createElement("div");
    element.classList.add("error-msg");
    element.textContent = `Error: ${msg}`;

    return element;
}