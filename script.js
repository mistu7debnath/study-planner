/***********************
  GLOBAL DATA
************************/
let studyData = [];

/***********************
  BASE HOURS
************************/
function getBaseHours(difficulty) {
  if (difficulty === "easy") return 1.5;
  if (difficulty === "medium") return 2.5;
  if (difficulty === "hard") return 4;
  return 0;
}

/***********************
  MULTIPLIER
************************/
function getMultiplier(education, standard) {
  if (education === "school") {
    if (standard <= 6) return 1.0;
    if (standard <= 8) return 1.2;
    return 1.6;
  }
  if (education === "higher") return 1.8;
  if (education === "college") return 1.4;
  if (education === "neet") return 2.2;
  if (education === "jee") return 2.3;
  if (education === "upsc") return 2.8;
  return 1.0;
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

  if (!subject || !topic || !difficulty || !education || !standard) {
    alert("Please fill all fields");
    return;
  }

  const hours =
    getBaseHours(difficulty) *
    getMultiplier(education, standard);

  studyData.push({
    subject,
    topic,
    difficulty,
    education,
    standard,
    hours: Math.round(hours), // 🔑 NO FLOATING
    completed: false
  });

  renderPlan();
  generateDailyTable();
  clearInputs();
}

/***********************
  RENDER STUDY PLAN
************************/
function renderPlan() {
  planList.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.subject}</strong> – ${item.topic}<br>
      <small>
        Difficulty: ${item.difficulty.toUpperCase()} |
        ⏱ ${item.hours} hrs
      </small>
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
  TABULAR DAILY ROUTINE (NORMAL)
************************/
function generateDailyTable() {
  const tbody = document.querySelector("#routineTable tbody");
  tbody.innerHTML = "";

  if (studyData.length === 0) return;

  let time = 7;     // 7 AM
  let end = 23;     // 11 PM
  let index = 0;

  const fixedBlocks = [
    { from: 8, to: 9, label: "🍳 Breakfast" },
    { from: 10, to: 16, label: "🏫 School / College" },
    { from: 13, to: 14, label: "🍽 Lunch" },
    { from: 20, to: 21, label: "🍲 Dinner" }
  ];

  while (time < end) {
    let block = fixedBlocks.find(b => time >= b.from && time < b.to);
    let activity = "";

    if (block) {
      activity = block.label;
    } else {
      const topic = studyData[index % studyData.length];
      activity = `📘 ${topic.subject} – ${topic.topic}`;
      index++;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><b>${formatTime(time)} – ${formatTime(time + 1)}</b></td>
      <td>${activity}</td>
    `;
    tbody.appendChild(row);

    time++;
  }
}

/***********************
  PDF EXPORT (TABLE)
************************/
function downloadRoutinePDF() {
  const tableHTML = document.getElementById("routineTable").outerHTML;

  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Daily Study Timetable</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
          }
          th {
            background: #f2f2f2;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1><b>Daily Study Timetable</b></h1>
        ${tableHTML}
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}

/***********************
  HELPERS
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
  renderPlan();
  document.querySelector("#routineTable tbody").innerHTML = "";
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
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
