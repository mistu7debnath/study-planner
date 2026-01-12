let studyData = JSON.parse(localStorage.getItem("studyData")) || [];

/* Difficulty → Recommended Hours */
function calculateHours(difficulty) {
  if (difficulty === "easy") return 1.5;
  if (difficulty === "medium") return 2.5;
  if (difficulty === "hard") return 4;
}

/* Add topic */
function addTopic() {
  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const difficulty = document.getElementById("difficulty").value;

  if (!subject || !topic || !difficulty) {
    alert("Please fill all fields");
    return;
  }

  const hours = calculateHours(difficulty);

  studyData.push({
    subject,
    topic,
    difficulty,
    hours,
    completed: false
  });

  saveAndRender();
  clearInputs();
}

/* Render study plan */
function renderPlan() {
  const list = document.getElementById("planList");
  list.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <b>${item.subject}</b> – ${item.topic}
        <br>
        <small>Difficulty: ${item.difficulty.toUpperCase()} | ⏱ ${item.hours} hrs</small>
      </span>
      <input type="checkbox" ${item.completed ? "checked" : ""} 
        onchange="toggleComplete(${index})">
    `;

    list.appendChild(li);
  });

  updateProgress();
}

/* Mark complete */
function toggleComplete(index) {
  studyData[index].completed = !studyData[index].completed;
  saveAndRender();
}

/* Progress calculation */
function updateProgress() {
  const completed = studyData.filter(item => item.completed).length;
  const total = studyData.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = `${percent}% Completed`;
}

/* Helpers */
function saveAndRender() {
  localStorage.setItem("studyData", JSON.stringify(studyData));
  renderPlan();
}

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

renderPlan();
