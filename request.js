// "다른 지역 신청하기" 팝업
// 입력한 내용은 Airtable 자동화(웹훅)로 전송되어 '블로그 지역 신청 > 신청' 표에 저장됩니다.
// 브라우저 보안 규칙(CORS) 때문에 form 형식 + no-cors 방식으로 보내며, 응답 내용은 읽을 수 없습니다.
const WEBHOOK_URL = "https://hooks.airtable.com/workflows/v1/genericWebhook/appMy52N6r89NhwJd/wfl02MTq9EiyhXq1p/wtrApOlNeTcMRLyCL";

(function () {
  const openBtn = document.getElementById("open-request");
  const modal = document.getElementById("request-modal");
  if (!openBtn || !modal) return;

  const form = modal.querySelector("form");
  const closeBtn = modal.querySelector(".modal-close");
  const submitBtn = form.querySelector(".submit");
  const msg = form.querySelector(".form-msg");

  function open() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    form.nickname.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    openBtn.focus();
  }

  function showMsg(text, ok) {
    msg.textContent = text;
    msg.className = "form-msg " + (ok ? "ok" : "err");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "보내는 중…";
    msg.textContent = "";

    const data = new URLSearchParams({
      nickname: form.nickname.value.trim(),
      email: form.email.value.trim(),
      region: form.region.value.trim(),
      content: form.content.value.trim(),
    });

    try {
      await fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body: data });
      showMsg("신청이 접수되었어요. 고맙습니다!", true);
      form.reset();
      setTimeout(close, 1800);
    } catch (err) {
      showMsg("전송에 실패했어요. 잠시 뒤 다시 시도해 주세요.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "신청하기";
    }
  });

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
})();
