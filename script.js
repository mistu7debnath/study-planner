let topics = JSON.parse(localStorage.getItem("topics")) || [];

function addTopic() {
  const subject = document.getElementById("subject").value;
  const topic = document.getElementById("topic").value;
  const difficulty = document.getElementById("difficulty").value;
  const hours = document.getElementById("hours").value;

  if (!subject || !topic || !difficulty || !hours) {
    alert("Please fill all fields");
    return;
  }

  topics.push({
    subject,
    topic,
    difficulty: Number(difficulty),
    hours: Number(hours),
    completed: false
  });

  saveAndRender();
  clearInputs();
}

function renderPlan() {
  const planList = document.getElementById("planList");
  planList.innerHTML = "";

  topics
    .sort((a, b) => b.difficulty - a.difficulty)
    .forEach((item, index) => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${item.subject} - ${item.topic} (${item.hours} hrs)
        <input type="checkbox" ${item.completed ? "checked" : ""} 
        onchange="toggleComplete(${index})">
      `;

      planList.appendChild(li);
    });

  updateProgress();
}

function toggleComplete(index) {
  topics[index].completed = !topics[index].completed;
  saveAndRender();
}

function updateProgress() {
  const completed = topics.filter(t => t.completed).length;
  const total = topics.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText =
    `${percent}% Completed`;
}

function saveAndRender() {
  localStorage.setItem("topics", JSON.stringify(topics));
  renderPlan();
}

function clearInputs() {
  document.getElementById("subject").value = "";
  document.getElementById("topic").value = "";
  document.getElementById("difficulty").value = "";
  document.getElementById("hours").value = "";
}

function clearAll() {
  if (confirm("Clear all data?")) {
    topics = [];
    saveAndRender();
  }
}

renderPlan();
