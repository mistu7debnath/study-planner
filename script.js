/* ================== DATA ================== */
let studyData = JSON.parse(localStorage.getItem("studyData")) || [];

/* ================== BASE HOURS ================== */
function getBaseHours(difficulty) {
  switch (difficulty) {
    case "easy": return 1.5;
    case "medium": return 2.5;
    case "hard": return 4;
    default: return 0;
  }
}

/* ================== MULTIPLIER ================== */
function getMultiplier(education, standard) {
  // School
  if (education === "school") {
    if (standard <= 5) return 1.0;
    if (standard <= 8) return 1.2;
    if (standard <= 10) return 1.6;
  }

  // Higher secondary
  if (education === "higher") return 1.8;

  // College
  if (education === "college") return 1.4;

  // Competitive exams
  if (education === "neet") return 2.2;
  if (education === "jee") return 2.3;
  if (education === "upsc") return 2.8;

  return 1.0;
}

/* ================== ADD TOPIC ================== */
function addTopic() {
    console.log(subject, topic, difficulty, education, standard);


  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const difficulty = document.getElementById("difficulty").value;
  const education = document.getElementById("educationType").value;
  const standard = document.getElementById("standard").value;

  if (!subject || !topic || !difficulty || !education || !standard) {
    alert("Please fill all fields");
    return;
  }

  const baseHours = getBaseHours(difficulty);
  const multiplier = getMultiplier(education, Number(standard));
  const finalHours = Number((baseHours * multiplier).toFixed(1));

  studyData.push({
    subject,
    topic,
    difficulty,
    education,
    standard,
    hours: finalHours,
    completed: false
  });

  saveAndRender();
  clearInputs();
}

/* ================== RENDER PLAN ================== */
function renderPlan() {
  const list = document.getElementById("planList");
  list.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <strong>${item.subject}</strong> – ${item.topic}<br>
        <small>
          ${item.education.toUpperCase()} |
          Difficulty: ${item.difficulty.toUpperCase()} |
          ⏱ ${item.hours} hrs
        </small>
      </span>
      <input type="checkbox"
        ${item.completed ? "checked" : ""}
        onchange="toggleComplete(${index})">
    `;

    list.appendChild(li);
  });

  updateProgress();
}

/* ================== TOGGLE COMPLETE ================== */
function toggleComplete(index) {
  studyData[index].completed = !studyData[index].completed;
  saveAndRender();
}

/* ================== PROGRESS ================== */
function updateProgress() {
  const completed = studyData.filter(t => t.completed).length;
  const total = studyData.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = `${percent}% Completed`;
}

/* ================== STORAGE ================== */
function saveAndRender() {
  localStorage.setItem("studyData", JSON.stringify(studyData));
  renderPlan();
}

/* ================== HELPERS ================== */
function clearInputs() {
  document.getElementById("subject").value = "";
  document.getElementById("topic").value = "";
  document.getElementById("difficulty").value = "";
}

function clearAll() {
  if (confirm("Clear entire study planner?")) {
    studyData = [];
    saveAndRender();
  }
}

/* ================== INIT ================== */
renderPlan();
