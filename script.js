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
  if (education === "wbjee") return 2.2;
  if (education === "jee") return 2.3;
  if (education === "jee_advanced") return 2.5;
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
  const routineType = document.getElementById("routineType").value;

  // class is OPTIONAL for competitive exams
  const standardValue = standardInput().value;
  const standard = standardValue ? Number(standardValue) : null;

  if (!subject || !topic || !difficulty || !education || !routineType) {
    alert("Please fill all required fields");
    return;
  }

  if (
    (education === "school" ||
      education === "higher" ||
      education === "college") &&
    standard === null
  ) {
    alert("Please select class / standard");
    return;
  }

  const hours = Math.round(
    getBaseHours(difficulty) *
      getMultiplier(education, standard ?? 10)
  );

  studyData.push({
    subject,
    topic,
    hours,
    completed: false
  });

  renderPlan();
  generateDailyTimetable();
  generateWeeklyTable();
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
  DAILY TIMETABLE
************************/
function generateDailyTimetable() {
  const routineType = document.getElementById("routineType").value;
  const tbody = document.querySelector("#routineTable1 tbody");
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
      ["school", "higher", "college"].includes(educationInput().value) &&
      hour >= 10 &&
      hour < 16
    ) {
      activity = "🏫 School / College";
    } else {
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
function generateWeeklyTable() {
  const tbody = document.querySelector("#weeklyGrid tbody");
  tbody.innerHTML = "";

  if (studyData.length === 0) return;

  const routineType = document.getElementById("routineType").value;
  const { start, end } = getRoutineTime(routineType);

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let topicIndex = 0;

  for (let hour = start; hour < end; hour++) {
    const row = document.createElement("tr");

    // Time column
    let rowHTML = `<td><b>${formatTime(hour)} – ${formatTime(hour + 1)}</b></td>`;

    days.forEach(() => {
      let cell = "";

      if (hour === 8) cell = "🍳 Breakfast";
      else if (hour === 13) cell = "🍽 Lunch";
      else if (hour === 20) cell = "🍲 Dinner";
      else if (
        ["school","higher","college"].includes(educationInput().value) &&
        hour >= 10 && hour < 16
      ) {
        cell = "🏫 School / College";
      } else {
        const t = studyData[topicIndex % studyData.length];
        cell = `${t.subject}<br><small>${t.topic}</small>`;
        topicIndex++;
      }

      rowHTML += `<td>${cell}</td>`;
    });

    row.innerHTML = rowHTML;
    tbody.appendChild(row);
  }
}

/***********************
  PDF DOWNLOAD (FIXED)
************************/
function downloadPDF() {
  generateDailyTimetable();
  generateWeeklyTable();

  setTimeout(() => {
    const pdfContent = document.getElementById("pdfContent");
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Smart Study Planner</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1, h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 6px; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Smart Study Planner</h1>
          ${pdfContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, 300);
}

/***********************
  CLEAR
************************/
function clearAll() {
  // 1️⃣ Clear data
  studyData = [];

  // 2️⃣ Clear recommended study plan
  if (planList) planList.innerHTML = "";

  // 3️⃣ Clear daily timetable
  const dailyBody = document.querySelector("#routineTable tbody");
  if (dailyBody) dailyBody.innerHTML = "";

  // 4️⃣ Clear weekly timetable (GRID STYLE)
  const weeklyHead = document.getElementById("weeklyHead");
  const weeklyBody = document.getElementById("weeklyBody");

  if (weeklyHead) weeklyHead.innerHTML = "";
  if (weeklyBody) weeklyBody.innerHTML = "";

  // 5️⃣ Reset progress
  progressBar.style.width = "0%";
  progressText.innerText = "0% Completed";

  // 6️⃣ Reset all inputs
  subjectInput().value = "";
  topicInput().value = "";
  difficultyInput().value = "";
  educationInput().value = "";
  standardInput().value = "";
  document.getElementById("routineType").value = "";

  // 7️⃣ Optional: scroll to top for better UX
  window.scrollTo({ top: 0, behavior: "smooth" });
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
