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
  ROUTINE TIME WINDOW
************************/
function getRoutineTime(type) {
  if (type === "early") return { start: 5, end: 21 };
  if (type === "normal") return { start: 7, end: 23 };
  if (type === "night") return { start: 10, end: 25 };
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

  if (!subject || !topic || !difficulty || !education || !standard || !routineType) {
    alert("Please fill all fields");
    return;
  }

  const hours =
    getBaseHours(difficulty) *
    getMultiplier(education, standard);

  studyData.push({
    subject,
    topic,
    hours: Math.round(hours),
    completed: false
  });

  renderPlan();
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
  let ampm = hour >= 12 && hour < 24 ? "PM" : "AM";
  return `${h}:00 ${ampm}`;
}

/***********************
  WEEKLY TIMETABLE
************************/
function generateWeeklyTimetable() {
  const routineType = document.getElementById("routineType").value;
  if (!routineType || studyData.length === 0) return;

  weeklyRoutine.innerHTML = "";

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  const { start, end } = getRoutineTime(routineType);
  let topicIndex = 0;

  days.forEach(day => {
    const table = document.createElement("table");
    table.border = "1";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "20px";

    table.innerHTML = `
      <thead>
        <tr>
          <th colspan="2"><b>${day}</b></th>
        </tr>
        <tr>
          <th>Time</th>
          <th>Activity</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    let time = start;

    while (time < end) {
      let activity = "";

      if (time === 8) activity = "🍳 Breakfast";
      else if (time >= 10 && time < 16) activity = "🏫 School / College";
      else if (time === 13) activity = "🍽 Lunch";
      else if (time === 20) activity = "🍲 Dinner";
      else {
        const topic = studyData[topicIndex % studyData.length];
        activity = `📘 ${topic.subject} – ${topic.topic}`;
        topicIndex++;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><b>${formatTime(time)} – ${formatTime(time + 1)}</b></td>
        <td>${activity}</td>
      `;
      tbody.appendChild(row);

      time++;
    }

    weeklyRoutine.appendChild(table);
  });
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
