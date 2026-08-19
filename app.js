const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
qsa(".reveal").forEach((el) => observer.observe(el));

document.addEventListener("click", (event) => {
  const scrollTarget = event.target.closest("[data-scroll]");
  if (scrollTarget) {
    const target = qs(scrollTarget.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
});

qsa(".quiz-option").forEach((option) => {
  option.addEventListener("click", () => {
    qsa(".quiz-option").forEach((item) =>
      item.classList.remove("correct", "wrong"),
    );
    const correct = option.dataset.correct === "true";
    option.classList.add(correct ? "correct" : "wrong");
    qs(".quiz-result").textContent = correct
      ? "Correct! “Friends” is plural, so use “are.”"
      : "Almost. Look at the plural subject “friends.”";
  });
});

const assessmentChoices = qsa(".choice");
assessmentChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    assessmentChoices.forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
    qs("#assessment-step").textContent = "02 / 02";
    qs("#assessment-question").innerHTML =
      '<h3>What is your current level?</h3><div class="choice-grid"><button class="choice level-choice">Beginner</button><button class="choice level-choice">Developing</button><button class="choice level-choice">Intermediate</button><button class="choice level-choice">Advanced</button></div>';
    qsa(".level-choice").forEach((level) =>
      level.addEventListener("click", () => {
        qsa(".level-choice").forEach((item) =>
          item.classList.remove("selected"),
        );
        level.classList.add("selected");
        qs("#assessment-question").style.display = "none";
        qs("#assessment-step").textContent = "Complete";
        qs("#plan-ready").classList.add("show");
      }),
    );
  });
});

const editor = qs("#writing-editor");
const counter = qs("#word-count");
if (editor && counter) {
  const updateCount = () => {
    const words = editor.value.trim()
      ? editor.value.trim().split(/\s+/).length
      : 0;
    counter.textContent = `${words} words`;
  };
  editor.addEventListener("input", updateCount);
}
const hintButton = qs("#hint-button");
if (hintButton) {
  hintButton.addEventListener("click", () =>
    qs("#hint-box").classList.toggle("show"),
  );
}
const submitWriting = qs("#submit-writing");
if (submitWriting) {
  submitWriting.addEventListener("click", (event) => {
    event.currentTarget.innerHTML = "Submitted ✓";
    event.currentTarget.style.background = "#86a938";
    event.currentTarget.style.color = "#171a1f";
    setTimeout(
      () => qs(".evaluation-section").scrollIntoView({ behavior: "smooth" }),
      300,
    );
  });
}

let seconds = 12 * 60;
setInterval(() => {
  if (seconds <= 0) return;
  seconds -= 1;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const timer = qs("#timer");
  if (timer) timer.textContent = `${mins}:${secs}`;
}, 1000);

qsa(".highlight").forEach((highlight) => {
  highlight.addEventListener("click", () => {
    const [title, copy] = highlight.dataset.feedback.split("|");
    qs("#feedback-panel").innerHTML =
      `<div class="panel-label">AI explanation</div><span class="feedback-tag">${title}</span><h3>${title === "Vocabulary upgrade" ? "Make a familiar idea more precise." : "Give your reader a clearer picture."}</h3><p>${copy}</p><button class="button button-small" data-scroll="#practice">Try it yourself <span>→</span></button>`;
  });
});

qsa(".inline-answer").forEach((answer) => {
  answer.addEventListener("click", () => {
    const feedback = qs("#agent-feedback");
    if (!feedback) return;
    if (answer.dataset.agentAnswer === "right") {
      feedback.textContent = "Correct! 🎉 Grammar confidence +3%";
      feedback.style.color = "#86a938";
    } else {
      feedback.textContent = "Try again: “friends” is plural.";
      feedback.style.color = "#ff785a";
    }
  });
});
