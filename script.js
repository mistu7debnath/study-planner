let studyData = JSON.parse(localStorage.getItem("studyData")) || [];

/* Difficulty → Study Hours */
function calculateHours(difficulty) {
  switch (difficulty) {
    case "easy": return 1.5;
    case "medium": return 2.5;
    case "hard": return 4;
    default: return 0;
  }
}

/* Add topic */
function addTopic() {
  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const difficulty = document.getElementById("difficulty").value;

  if (subject === "" || topic === "" || difficulty === "") {
    alert("Please fill all fields properly");
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

userProfile = {
  educationType: "school",
  level: "10",
  multiplier: 1.6,
  dailyAvailableHours: 6,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};


studyTopic = {
  subject: "Math",
  topic: "Trigonometry",
  difficulty: "hard",
  baseHours: 4,
  finalHours: 6.4,
  completed: false
};


/* Render study plan */
function renderPlan() {
  const list = document.getElementById("planList");
  list.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <strong>${item.subject}</strong> – ${item.topic}<br>
        <small>Difficulty: ${item.difficulty.toUpperCase()} | ⏱ ${item.hours} hrs</small>
      </span>
      <input type="checkbox" ${item.completed ? "checked" : ""} 
        onchange="toggleComplete(${index})">
    `;

    list.appendChild(li);
  });

  updateProgress();
}

function getBaseHours(difficulty) {
  if (difficulty === "easy") return 1.5;
  if (difficulty === "medium") return 2.5;
  if (difficulty === "hard") return 4;
}

function getMultiplier(type, level) {
  if (type === "school" && level <= 5) return 1.0;
  if (type === "school" && level <= 8) return 1.2;
  if (type === "school" && level <= 10) return 1.6;
  if (type === "higher_secondary") return 1.8;
  if (type === "university") return 1.4;
  if (type === "competitive") return 2.0;
}

finalHours = baseHours * multiplier;

breaks = [
  { name: "Breakfast", duration: 0.5 },
  { name: "Lunch", duration: 1 },
  { name: "Dinner", duration: 1 },
  { name: "Short Breaks", duration: 0.5 }
];

function generateWeeklyPlan(topics, profile) {
  let plan = {};
  let remainingTopics = [...topics];

  profile.days.forEach(day => {
    let available = profile.dailyAvailableHours - 3; // meals
    plan[day] = [];

    while (available > 0 && remainingTopics.length > 0) {
      let topic = remainingTopics[0];
      let studyTime = Math.min(topic.finalHours, available);

      plan[day].push({
        subject: topic.subject,
        topic: topic.topic,
        hours: studyTime
      });

      topic.finalHours -= studyTime;
      available -= studyTime;

      if (topic.finalHours <= 0) remainingTopics.shift();
    }
  });

  return plan;
}


/* Toggle completion */
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

/* Initial load */
renderPlan();
