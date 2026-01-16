/***********************
  GLOBAL DATA
************************/
let studyData = [];

/***********************
  BASE HOURS
************************/
function getBaseHours(difficulty) {
  if (difficulty === "easy") return 2;
  if (difficulty === "medium") return 3;
  if (difficulty === "hard") return 4;
  return 0;
}

/***********************
  MULTIPLIER
************************/
function getMultiplier(education, standard) {
  if (education === "school") {
    if (standard <= 6) return 1;
    if (standard <= 8) return 1.2;
    return 1.6;
  }
  if (education === "higher") return 1.8;
  if (education === "college") return 1.4;
  if (education === "neet") return 2.2;
  if (education === "jee") return 2.3;
  if (education === "upsc") return 2.8;
  return 1;
}

/***********************
  ROUTINE TYPE
************************/
function getRoutineTime(type) {
  if (type === "early") return { start: 5, end: 21 };
  if (type === "normal") return { start: 7, end: 23 };
  if (type === "night") return { start: 10, end: 24 };
  return { start: 7, end: 23 };
}

/***********************
  ADD TOPIC
************************/
function addTopic() {
  const subject = subjectInput().value.trim();
  const topic = topicInput().value.trim();
  const difficulty = difficultyInput().value;
  const education = educationInput().value;
  const standard = Number(standardInput().value);
  const routineType = document.getElementById("routineType").value;

  if (!subject || !topic || !difficulty || !education || !routineType) {
  alert("Please fill all required fields");
  return;
}

if (
  (education === "school" ||
   education === "higher" ||
   education === "college") &&
  !standard
) {
  alert("Please select class / standard");
  return;
}


  const hours = Math.round(
    getBaseHours(difficulty) *
    getMultiplier(education, standard)
  );

  studyData.push({
    subject,
    topic,
    hours,
    completed: false
  });

  renderPlan();
  generateDailyTimetable();
  generateWeeklyTimetable();
  clearInputs();
}

/***********************
  STUDY PLAN LIST
************************/
function renderPlan() {
  planList.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.subject}</strong> – ${item.topic}
      <small> ⏱ ${item.hours} hrs</small>
      <input type="checkbox" onchange="toggleComplete(${index})">
    `;
    planList.appendChild(li);
  });

  updateProgress();
}

/***********************
  PROGRESS
************************/
function toggleComplete(i) {
  studyData[i].completed = !studyData[i].completed;
  updateProgress();
}

function updateProgress() {
  const done = studyData.filter(t => t.completed).length;
  const percent = studyData.length
    ? Math.round((done / studyData.length) * 100)
    : 0;

  progressBar.style.width = percent + "%";
  progressText.innerText = percent + "% Completed";
}

/***********************
  TIME FORMAT
************************/
function formatTime(hour) {
  let h = hour % 12 || 12;
  let ampm = hour >= 12 ? "PM" : "AM";
  return `${h}:00 ${ampm}`;
}

/***********************
  DAILY TIMETABLE
************************/
function generateDailyTimetable() {
  const routineType = document.getElementById("routineType").value;
  const tbody = document.querySelector("#routineTable tbody");
  tbody.innerHTML = "";

  if (!routineType || studyData.length === 0) return;

  const { start, end } = getRoutineTime(routineType);
  let index = 0;

  for (let hour = start; hour < end; hour++) {
    let activity = "";

    if (hour === 8) activity = "🍳 Breakfast";
    else if (hour === 13) activity = "🍽 Lunch";
    else if (hour === 20) activity = "🍲 Dinner";
    else if (
  (educationInput().value === "school" ||
   educationInput().value === "higher" ||
   educationInput().value === "college") &&
  hour >= 10 && hour < 16
) {
  activity = "🏫 School / College";
}

    else {
      const t = studyData[index % studyData.length];
      activity = `📘 ${t.subject} – ${t.topic}`;
      index++;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><b>${formatTime(hour)} – ${formatTime(hour + 1)}</b></td>
      <td>${activity}</td>
    `;
    tbody.appendChild(row);
  }
}

/***********************
  WEEKLY TIMETABLE
************************/
function generateWeeklyTimetable() {
  weeklyRoutine.innerHTML = "";
  if (studyData.length === 0) return;

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  let index = 0;

  days.forEach(day => {
    const block = document.createElement("div");
    block.className = "week-block";

    let html = `<h3>${day}</h3><ul>`;

    for (let i = 0; i < 3; i++) {
      const t = studyData[index % studyData.length];
      html += `<li>📘 ${t.subject} – ${t.topic}</li>`;
      index++;
    }

    if (day === "Sunday") {
      html += `<li>🔁 Revision & Light Study</li>`;
    }

    html += "</ul>";
    block.innerHTML = html;
    weeklyRoutine.appendChild(block);
  });
}


function downloadPDF() {
  const pdfContent = document.getElementById("pdfContent");

  if (!pdfContent) {
    alert("PDF content not found");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=650");

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Study Routine</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1, h2, h3 {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #f0f0f0;
          font-weight: bold;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 4px 0;
        }
      </style>
    </head>
    <body>
      <h1>Smart Study Planner</h1>
      ${pdfContent.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  // 🔥 CRITICAL FIX
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}



/***********************
  CLEAR
************************/
function clearInputs() {
  subjectInput().value = "";
  topicInput().value = "";
  difficultyInput().value = "";
  educationInput().value = "";
  standardInput().value = "";
}

function clearAll() {
  studyData = [];
  planList.innerHTML = "";
  weeklyRoutine.innerHTML = "";
  document.querySelector("#routineTable tbody").innerHTML = "";
  updateProgress();
}

/***********************
  DOM SHORTCUTS
************************/
const subjectInput = () => document.getElementById("subject");
const topicInput = () => document.getElementById("topic");
const difficultyInput = () => document.getElementById("difficulty");
const educationInput = () => document.getElementById("educationType");
const standardInput = () => document.getElementById("standard");

const planList = document.getElementById("planList");
const weeklyRoutine = document.getElementById("weeklyRoutine");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
