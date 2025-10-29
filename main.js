function questionPage() {
  window.location.href = "question.html";
}

// ...existing code...

function checkAnswers(answersMap = null) {
  const questions = document.querySelectorAll(".question");
  let score = 0;

  questions.forEach((q, idx) => {
    const key = q.id || q.dataset.qid || `q${idx + 1}`;
    const correct = ((answersMap && answersMap[key]) || q.dataset.answer || "")
      .toString()
      .trim();
    const radios = Array.from(q.querySelectorAll('input[type="radio"]'));
    const checked = radios.find((r) => r.checked);

    // tạo hoặc lấy phần hiển thị kết quả
    let resultEl = q.querySelector(".result");
    if (!resultEl) {
      resultEl = document.createElement("div");
      resultEl.className = "result";
      resultEl.style.marginTop = "6px";
      q.appendChild(resultEl);
    }

    // reset style trước khi đánh dấu
    q.querySelectorAll("label").forEach((l) => {
      l.style.background = "";
      l.style.color = "";
      l.style.fontWeight = "";
      l.style.padding = "";
      l.style.borderRadius = "";
    });

    if (!checked) {
      resultEl.textContent = "Chưa chọn đáp án";
      resultEl.style.color = "orange";
    } else {
      const val = checked.value.toString().trim();
      // đánh dấu đáp án đúng và đánh dấu đáp án sai (nếu có)
      radios.forEach((r) => {
        const lab = r.closest("label") || r.parentElement;
        if (!lab) return;
        if (r.value.toString().trim() === correct && correct !== "") {
          lab.style.background = "#d4f8d4"; // xanh nhạt cho đúng
          lab.style.fontWeight = "600";
          lab.style.padding = "4px";
          lab.style.borderRadius = "4px";
        }
        if (r.checked && r.value.toString().trim() !== correct) {
          lab.style.background = "#ffd6d6"; // đỏ nhạt cho sai
          lab.style.color = "#900";
          lab.style.fontWeight = "600";
          lab.style.padding = "4px";
          lab.style.borderRadius = "4px";
        }
      });

      if (val === correct && correct !== "") {
        score++;
        resultEl.textContent = "Đúng";
        resultEl.style.color = "green";
      } else {
        resultEl.textContent = `Sai. Đáp án đúng: ${correct || "chưa có"}`;
        resultEl.style.color = "red";
      }
    }

    // vô hiệu hoá các input để tránh sửa sau khi nộp
    radios.forEach((r) => {
      r.disabled = true;
    });
  });

  // Hiển thị tổng điểm
  let totalEl = document.getElementById("score");
  if (!totalEl) {
    totalEl = document.createElement("div");
    totalEl.id = "score";
    totalEl.style.margin = "8px 0";
    totalEl.style.fontWeight = "700";
    document.body.insertBefore(totalEl, document.body.firstChild);
  }
  totalEl.textContent = `Điểm: ${score} / ${questions.length}`;
}

/**
 * Nạp đáp án từ file JSON (ví dụ answers.json: { "q1":"8", "q2":"1987" })
 * và gọi checkAnswers với map lấy được
 */
async function checkWithExternal(url = "answers.json") {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không lấy được file answers.json");
    const map = await res.json();
    checkAnswers(map);
  } catch (e) {
    // lỗi thì fallback dùng data-answer sẵn có
    checkAnswers();
  }
}

/**
 * Reset quiz: mở lại radio, xoá kết quả, xoá highlight và tổng điểm
 */
function resetQuiz() {
  document.querySelectorAll(".question").forEach((q) => {
    q.querySelectorAll('input[type="radio"]').forEach((r) => {
      r.disabled = false;
      r.checked = false;
    });
    const resultEl = q.querySelector(".result");
    if (resultEl) resultEl.remove();
    q.querySelectorAll("label").forEach((l) => {
      l.style.background = "";
      l.style.color = "";
      l.style.fontWeight = "";
      l.style.padding = "";
      l.style.borderRadius = "";
    });
  });
  const totalEl = document.getElementById("score");
  if (totalEl) totalEl.remove();
}

function resetQuiz() {
  document.querySelectorAll(".question").forEach((q) => {
    q.querySelectorAll('input[type="radio"]').forEach((r) => {
      r.disabled = false;
      r.checked = false;
    });
    const resultEl = q.querySelector(".result");
    if (resultEl) resultEl.remove();
    q.querySelectorAll("label").forEach((l) => {
      l.style.background = "";
      l.style.color = "";
      l.style.fontWeight = "";
      l.style.padding = "";
      l.style.borderRadius = "";
    });
  });
  const totalEl = document.getElementById("score");
  if (totalEl) totalEl.remove();
}

// ...existing code...

// Thêm hàm resetAll: alias tiện lợi + xóa dữ liệu nạp ngoài
function resetAll() {
  // reset trạng thái câu hỏi
  resetQuiz();

  // xóa answers map nếu nạp từ file/biến toàn cục
  if (window.ANSWERS) {
    try {
      delete window.ANSWERS;
    } catch (e) {
      window.ANSWERS = undefined;
    }
  }

  // xóa phần tử thông báo tạm thời nếu có (tên id tùy chỉnh)
  const msg = document.getElementById("message");
  if (msg) msg.remove();
}
// ...existing code...
