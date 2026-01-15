let studyData = [];

/* ---------- BASE HOURS ---------- */
function getBaseHours(difficulty) {
  if (difficulty === "easy") return 1.5;
  if (difficulty === "medium") return 2.5;
  if (difficulty === "hard") return 4;
  return 0;
}

/* ---------- MULTIPLIER ---------- */
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

/* ---------- DAILY STUDY RULE ---------- */
function getDailyStudyHours(education, standard) {
  if (education === "school") {
    if (standard <= 6) return { weekday: 5, sunday: 0 };
    if (standard <= 9) return { weekday: 6, sunday: 3 };
    return { weekday: 10, sunday: 10 };
  }
  if (education === "higher") return { weekday: 10, sunday: 8 };
  if (education === "college") return { weekday: 7, sunday: 4 };
  if (education === "neet" || education === "jee") return { weekday: 9, sunday: 8 };
  if (education === "upsc") return { weekday: 10, sunday: 9 };
  return { weekday: 6, sunday: 3 };
}

/* ---------- ADD TOPIC ---------- */
function addTopic() {
  const subject = subjectInput().value;
  const topic = topicInput().value;
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
    hours: Number(hours.toFixed(1)),
    completed: false
  });

  renderPlan();
  renderRoutine();
  clearInputs();
}

/* ---------- RENDER STUDY PLAN ---------- */
function renderPlan() {
  planList.innerHTML = "";

  studyData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.subject}</strong> – ${item.topic}<br>
      <small>Difficulty: ${item.difficulty.toUpperCase()} | ⏱ ${item.hours} hrs</small>
      <input type="checkbox" onchange="toggleComplete(${index})">
    `;
    planList.appendChild(li);
  });

  updateProgress();
}

/* ---------- PROGRESS ---------- */
function toggleComplete(i) {
  studyData[i].completed = !studyData[i].completed;
  updateProgress();
}

function updateProgress() {
  const done = studyData.filter(t => t.completed).length;
  const percent = studyData.length ? Math.round(done / studyData.length * 100) : 0;
  progressBar.style.width = percent + "%";
  progressText.innerText = percent + "% Completed";
}

/* ---------- ROUTINE ---------- */
function generateRoutine() {
  if (!studyData.length) return {};

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const { education, standard } = studyData[0];
  const { weekday, sunday } = getDailyStudyHours(education, standard);

  let routine = {};
  days.forEach(d => routine[d] = []);

  let topics = studyData.map(t => ({ ...t, remaining: t.hours }));
  let idx = 0;

  days.forEach((day, d) => {
    let available = day === "Sunday" ? sunday : weekday;

    if (d % 3 === 0 && d !== 0 && available > 0) {
      routine[day].push({ subject: "REVISION", topic: "Previous Topics", hours: 2 });
      available -= 2;
    }

    while (available > 0 && topics.length) {
      let t = topics[idx % topics.length];
      if (t.remaining <= 0) {
        topics.splice(idx % topics.length, 1);
        continue;
      }
      let use = Math.min(available, t.remaining);
      routine[day].push({ subject: t.subject, topic: t.topic, hours: use });
      t.remaining -= use;
      available -= use;
      idx++;
    }
  });

  return routine;
}

function renderRoutine() {
  routine.innerHTML = "";
  const data = generateRoutine();

  for (let day in data) {
    const block = document.createElement("div");
    block.innerHTML = `<strong>${day}</strong>`;
    data[day].forEach(i => {
      const p = document.createElement("p");
      p.textContent = `• ${i.subject} – ${i.topic} (${i.hours} hrs)`;
      block.appendChild(p);
    });
    routine.appendChild(block);
  }
}

/* ---------- DOWNLOAD ---------- */
function downloadJSON() {
  const blob = new Blob(
    [JSON.stringify(generateRoutine(), null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "study_routine.json";
  a.click();
}

function downloadPDF() {
  let text = "Weekly Study Routine\n\n";
  const data = generateRoutine();
  for (let d in data) {
    text += d + ":\n";
    data[d].forEach(i => {
      text += ` - ${i.subject} (${i.topic}) : ${i.hours} hrs\n`;
    });
    text += "\n";
  }
  const w = window.open();
  w.document.write(`<pre>${text}</pre>`);
  w.print();
}

/* ---------- HELPERS ---------- */
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
  renderRoutine();
}

/* ---------- DOM SHORTCUTS ---------- */
const subjectInput = () => document.getElementById("subject");
const topicInput = () => document.getElementById("topic");
const difficultyInput = () => document.getElementById("difficulty");
const educationInput = () => document.getElementById("educationType");
const standardInput = () => document.getElementById("standard");

const planList = document.getElementById("planList");
const routine = document.getElementById("routine");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
