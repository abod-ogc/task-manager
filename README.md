# Task Manager (IndexedDB)

This is a single-page Task Manager application built with vanilla JavaScript, HTML, and CSS. It provides a modern user interface for managing your daily tasks. All data is persisted locally in your browser using IndexedDB, ensuring your tasks are saved even after refreshing the page.

## Features

*   **Add & Manage Tasks:** Create new tasks with a title and an optional description.
*   **Local Persistence:** Uses IndexedDB (via Dexie.js) to store tasks directly in the browser. No backend is required.
*   **Task Filtering:** Filter tasks by status: "All", "Pending", or "Done".
*   **Live Search:** Instantly search through tasks by title or description with a debounced input.
*   **Status Updates:** Mark tasks as complete or reopen them. The UI reflects the status with color-coding.
*   **Bulk Operations:** Seed the application with dummy data or clear all tasks with a single click.
*   **User Feedback:** Receive toast notifications for successful operations and clear error messages for invalid input.
*   **Keyboard Shortcuts:** Use `Ctrl` + `Enter` to quickly add a new task.
*   **Responsive Design:** A clean layout that adapts to different screen sizes.

## Technologies Used

*   **HTML5**
*   **CSS3**
*   **Vanilla JavaScript (ES6 Modules)**
*   **Dexie.js:** A minimalist wrapper for IndexedDB.

## Getting Started

Since this project is built entirely with client-side technologies, there's no build process or server required.

1.  Clone the repository:
    ```sh
    git clone https://github.com/abod-ogc/task-manager.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd task-manager
    ```
3.  Open the `index.html` file in your favorite web browser.

## Code Overview

*   `index.html`: The main HTML file containing the structure of the application.
*   `style.css`: Contains all the styles for the application, including the responsive design.
*   `app.js`: The core application script. It handles event listeners, state management, and coordinates between the UI and the database.
*   `UI/UIElements.js`: A module that exports functions for creating dynamic UI components like task cards, toast notifications, and error messages.
*   `database/db.js`: Manages all interactions with the IndexedDB database using Dexie.js. It includes functions for adding, retrieving, updating, and deleting tasks.
