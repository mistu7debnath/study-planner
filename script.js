let studyData = [];

/* Base hours by difficulty */
function getBaseHours(difficulty) {
  if (difficulty === "easy") return 1.5;
  if (difficulty === "medium") return 2.5;
  if (difficulty === "hard") return 4;
  return 0;
}

/* Multiplier by education */
function getMultiplier(education, standard) {
  if (education === "school") {
    if (standard <= 5) return 1.0;
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

/* Main function */
function addTopic() {
  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const difficulty = document.getElementById("difficulty").value;
  const education = document.getElementById("educationType").value;
  const standard = Number(document.getElementById("standard").value);

  console.log(subject, topic, difficulty, education, standard);

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
    hours: hours.toFixed(1),
    completed: false
  });

  renderPlan();
  clearInputs();
}

/* Render list */
function renderPlan() {
  const list = document.getElementById("planList");
  list.innerHTML = "";

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
    list.appendChild(li);
  });

  updateProgress();
}

/* Progress */
function toggleComplete(index) {
  studyData[index].completed = !studyData[index].completed;
  updateProgress();
}

function updateProgress() {
  const done = studyData.filter(t => t.completed).length;
  const total = studyData.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = percent + "% Completed";
}

/* Helpers */
function clearInputs() {
  document.getElementById("subject").value = "";
  document.getElementById("topic").value = "";
  document.getElementById("difficulty").value = "";
  document.getElementById("educationType").value = "";
  document.getElementById("standard").value = "";
}

function clearAll() {
  studyData = [];
  renderPlan();
}
