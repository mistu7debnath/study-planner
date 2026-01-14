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
    return 1.6; // class 9–10
  }
  if (education === "higher") return 1.8; // 11–12
  if (education === "college") return 1.4;
  if (education === "neet") return 2.2;
  if (education === "jee") return 2.3;
  if (education === "upsc") return 2.8;
  return 1.0;
}

/***********************
  DAILY STUDY HOURS RULE
************************/
function getDailyStudyHours(education, standard) {
  if (education === "school") {
    if (standard <= 6) return { weekday: 5, sunday: 0 };
    if (standard <= 9) return { weekday: 6, sunday: 3 };
    return { weekday: 10, sunday: 10 }; // class 10
  }

  if (education === "higher") {
    return { weekday: 10, sunday: 8 }; // 11–12
  }

  if (education === "college") {
    return { weekday: 7, sunday: 4 };
  }

  if (education === "neet" || education === "jee") {
    return { weekday: 9, sunday: 8 };
  }

  if (education === "upsc") {
    return { weekday: 10, sunday: 9 };
  }

  return { weekday: 6, sunday: 3 };
}

/***********************
  ADD TOPIC
************************/
function addTopic() {
  const subject = document.getElementById("subject").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const difficulty = document.getElementById("difficulty").value;
  const education = document.getElementById("educationType").value;
  const standard = Number(document.getElementById("standard").value);

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
    hours: Number(hours.toFixed(1)),
    completed: false
  });

  renderPlan();
  renderRoutine();
  clearInputs();
}

/***********************
  RENDER STUDY PLAN
************************/
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

/***********************
  PROGRESS
************************/
function toggleComplete(index) {
  studyData[index].completed = !studyData[index].completed;
  updateProgress();
}

function updateProgress() {
  const done = studyData.filter(t => t.completed).length;
  const total = studyData.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    percent + "% Completed";
}

/***********************
  SMART WEEKLY ROUTINE
************************/
function generateRoutine() {
  if (studyData.length === 0) return {};

  const days = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
  ];

  const education = studyData[0].education;
  const standard = studyData[0].standard;

  const { weekday, sunday } =
    getDailyStudyHours(education, standard);

  const routine = {};
  days.forEach(d => routine[d] = []);

  let topics = studyData.map(t => ({
    subject: t.subject,
    topic: t.topic,
    remaining: t.hours
  }));

  let topicIndex = 0;

  days.forEach((day, dayCount) => {
    let available = (day === "Sunday") ? sunday : weekday;

    /* REVISION RULE: every 3rd day */
    if (dayCount !== 0 && dayCount % 3 === 0 && available > 0) {
      routine[day].push({
        subject: "REVISION",
        topic: "Previous topics & weak areas",
        hours: Math.min(2, available)
      });
      available -= 2;
    }

    while (available > 0 && topics.length > 0) {
      const t = topics[topicIndex % topics.length];

      if (t.remaining <= 0) {
        topics.splice(topicIndex % topics.length, 1);
        continue;
      }

      const assign = Math.min(available, t.remaining);

      routine[day].push({
        subject: t.subject,
        topic: t.topic,
        hours: assign
      });

      t.remaining -= assign;
      available -= assign;
      topicIndex++;
    }
  });

  return routine;
}

/***********************
  RENDER ROUTINE
************************/
function renderRoutine() {
  const container = document.getElementById("routine");
  if (!container) return;

  container.innerHTML = "";
  const routine = generateRoutine();

  for (const day in routine) {
    const block = document.createElement("div");
    block.innerHTML = `<strong>${day}</strong>`;

    routine[day].forEach(item => {
      const p = document.createElement("p");
      p.style.marginLeft = "10px";
      p.textContent =
        `• ${item.subject} – ${item.topic} (${item.hours} hrs)`;
      block.appendChild(p);
    });

    container.appendChild(block);
  }
}

/***********************
  HELPERS
************************/
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
  renderRoutine();
}
