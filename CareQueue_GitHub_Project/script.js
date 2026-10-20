const STORAGE_KEY = "carequeue-data-v1";
const form = document.getElementById("patientForm");
const nameInput = document.getElementById("patientName");
const departmentInput = document.getElementById("department");
const queueList = document.getElementById("queueList");
const waitingCount = document.getElementById("waitingCount");
const servedCount = document.getElementById("servedCount");
const nextTicket = document.getElementById("nextTicket");
const queueHeadingCount = document.getElementById("queueHeadingCount");
const callNextBtn = document.getElementById("callNextBtn");
const nextPatientSummary = document.getElementById("nextPatientSummary");
const lastCalled = document.getElementById("lastCalled");
const clearBtn = document.getElementById("clearBtn");
const demoBtn = document.getElementById("demoBtn");
const toast = document.getElementById("toast");

let queue = [];
let served = 0;
let ticketCounter = 1;
let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.queue)) {
      queue = saved.queue;
      served = Number(saved.served) || 0;
      ticketCounter = Number(saved.ticketCounter) || 1;
      lastCalled.textContent = saved.lastCalled || "No patient has been called yet.";
    }
  } catch (error) {
    console.warn("Could not load saved queue data.", error);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    queue, served, ticketCounter, lastCalled: lastCalled.textContent
  }));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function makeTicket(number) {
  return `CQ-${String(number).padStart(3, "0")}`;
}

function render() {
  waitingCount.textContent = queue.length;
  servedCount.textContent = served;
  queueHeadingCount.textContent = queue.length;
  nextTicket.textContent = queue.length ? queue[0].ticket : "—";
  callNextBtn.disabled = queue.length === 0;
  nextPatientSummary.textContent = queue.length
    ? `${queue[0].name} · ${queue[0].department}`
    : "No patients are waiting yet.";

  if (queue.length === 0) {
    queueList.innerHTML = '<div class="empty-state"><div class="empty-icon">☷</div><strong>Your queue is empty</strong><p>Register a patient to start the waiting line.</p></div>';
    clearBtn.disabled = true;
    clearBtn.style.opacity = ".45";
    return;
  }

  clearBtn.disabled = false;
  clearBtn.style.opacity = "1";
  queueList.innerHTML = "";
  queue.forEach((patient, index) => {
    const row = document.createElement("article");
    row.className = "patient-row";

    const ticket = document.createElement("div");
    ticket.className = "ticket";
    ticket.textContent = patient.ticket;

    const info = document.createElement("div");
    info.className = "patient-info";
    const name = document.createElement("strong");
    name.textContent = patient.name;
    const dept = document.createElement("span");
    dept.textContent = patient.department;
    info.append(name, dept);

    const position = document.createElement("span");
    position.className = `position${index === 0 ? " first" : ""}`;
    position.textContent = index === 0 ? "NEXT UP" : `#${index + 1} IN LINE`;
    row.append(ticket, info, position);
    queueList.appendChild(row);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    showToast("Please enter the patient's name.");
    nameInput.focus();
    return;
  }
  const patient = {
    id: `${Date.now()}-${ticketCounter}`,
    ticket: makeTicket(ticketCounter),
    name,
    department: departmentInput.value,
    registeredAt: new Date().toISOString()
  };
  queue.push(patient); // enqueue: add to the rear of the queue
  ticketCounter += 1;
  saveState();
  render();
  form.reset();
  nameInput.focus();
  showToast(`${patient.ticket} created for ${patient.name}.`);
});

callNextBtn.addEventListener("click", () => {
  if (!queue.length) return;
  const patient = queue.shift(); // dequeue: remove from the front (FIFO)
  served += 1;
  lastCalled.textContent = `Now serving ${patient.ticket} — ${patient.name} (${patient.department}).`;
  saveState();
  render();
  showToast(`Called ${patient.name}.`);
});

clearBtn.addEventListener("click", () => {
  if (!queue.length) return;
  const confirmed = window.confirm(`Remove all ${queue.length} waiting patient(s) from the queue? This will not change the served count.`);
  if (!confirmed) return;
  queue = [];
  saveState();
  render();
  showToast("Waiting queue cleared.");
});

demoBtn.addEventListener("click", () => {
  if (queue.length && !window.confirm("Add demo patients to the current queue?")) return;
  const demos = [
    ["Akosua Boateng", "General Outpatient"],
    ["Kofi Asare", "Laboratory"],
    ["Esi Mensah", "Paediatrics"]
  ];
  demos.forEach(([name, department]) => {
    queue.push({
      id: `${Date.now()}-${ticketCounter}`,
      ticket: makeTicket(ticketCounter),
      name, department, registeredAt: new Date().toISOString()
    });
    ticketCounter += 1;
  });
  saveState();
  render();
  showToast("Three demo patients added.");
});

loadState();
render();
