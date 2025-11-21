document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".lienhe-container > section");
  sections.forEach((s, i) => {
    s.style.opacity = "0";
    s.style.transform = "translateY(12px)";
    s.style.transition = "opacity 420ms ease, transform 420ms ease";
    setTimeout(() => {
      s.style.opacity = "1";
      s.style.transform = "translateY(0)";
    }, 120 + i * 90);
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  const searchForm = document.querySelector(".header_search-bar form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = searchForm.querySelector('input[type="text"]');
      const query = input ? input.value.trim() : "";
      if (!query) {
        alert("Vui lòng nhập từ khóa tìm kiếm.");
        if (input) input.focus();
        return;
      }
      const encoded = encodeURIComponent(query);
      window.location.href = `../search.html?q=${encoded}`;
    });
  }

  const contactForm = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  function setError(id, message) {
    const el = document.getElementById("error-" + id);
    const field = document.getElementById(id);
    if (el) el.textContent = message || "";
    if (field) {
      field.classList.toggle("error", !!message);
      if (message) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
      if (message) field.setAttribute("aria-describedby", "error-" + id);
      else field.removeAttribute("aria-describedby");
    }
  }

  if (contactForm) {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const subjectEl = document.getElementById("subject");
    const messageEl = document.getElementById("message");
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const fields = [nameEl, emailEl, subjectEl, messageEl].filter(Boolean);

    function updateFieldError(field) {
      if (!field) return;

      field.setCustomValidity("");

      if (field.validity.valueMissing) {
        if (field.id === "name") {
          field.setCustomValidity("Vui lòng nhập họ và tên.");
        } else {
          field.setCustomValidity("Vui lòng không để trống.");
        }
      } else if (field.validity.tooShort) {
        if (field.id === "name") {
          field.setCustomValidity("Họ tên quá ngắn.");
        } else {
          field.setCustomValidity(`Vui lòng nhập ít nhất ${field.getAttribute("minlength")} ký tự.`);
        }
      } else if (field.validity.patternMismatch) {
        if (field.id === "name") {
          field.setCustomValidity("Họ tên chứa ký tự không hợp lệ.");
        } else {
          field.setCustomValidity("Dữ liệu không hợp lệ.");
        }
      } else if (field.validity.typeMismatch && field.type === "email") {
        field.setCustomValidity("Email không hợp lệ.");
      }

      setError(field.id, field.validationMessage || "");
    }

    fields.forEach((f) => {
      f.addEventListener("input", () => {
        f.setCustomValidity("");
        updateFieldError(f);
      });
      f.addEventListener("blur", () => updateFieldError(f));
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusEl.textContent = "";

      if (!contactForm.checkValidity()) {
        fields.forEach(updateFieldError);
        contactForm.reportValidity();
        const firstInvalid = fields.find((f) => !f.validity.valid);
        if (firstInvalid) firstInvalid.focus();
        statusEl.style.color = "#b00020";
        statusEl.textContent = "Vui lòng sửa các trường có lỗi.";
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("sending");
      }
      statusEl.style.color = "#1d7a1d";
      statusEl.textContent = "Đang gửi...";

      setTimeout(() => {
        statusEl.textContent =
          "Cảm ơn bạn! Yêu cầu đã được gửi, chúng tôi sẽ liên hệ sớm.";
        contactForm.reset();
        fields.forEach((f) => {
          setError(f.id, "");
          f.classList.remove("error");
          f.removeAttribute("aria-invalid");
        });
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("sending");
        }
      }, 900);
    });
  }
});
