# CareQueue — Hospital Queue Management System

A responsive front-end demonstration of the **queue** data structure using HTML, CSS and JavaScript.

## Features
- Register patients with a department.
- Assign sequential ticket numbers (CQ-001, CQ-002, ...).
- Display the waiting line in FIFO order.
- Call the next patient (dequeue from the front).
- Add demo patients, clear the waiting line, and track patients served.
- Save the queue in browser localStorage so a refresh does not immediately erase the session.

## Run locally
1. Download or extract this folder.
2. Open `index.html` in a modern browser.

No installation or build step is required.

## Deploy on GitHub Pages
1. Sign in to GitHub and create a new **public** repository, e.g. `carequeue-app`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository's root folder.
3. Open the repository's **Settings** → **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then click **Save**.
6. Wait for GitHub Pages to publish. Your site link will appear in the Pages section, usually in the form `https://YOUR-USERNAME.github.io/carequeue-app/`.

## Queue operations
- **Enqueue:** `queue.push(patient)` adds a patient to the rear.
- **Dequeue:** `queue.shift()` removes the patient at the front.
- **FIFO:** the first patient registered is the first patient called.

## Important
This is an educational demo and is not suitable for real clinical use. It does not include authentication, a secure database, access control, or clinical record management. Do not enter real patient information.
