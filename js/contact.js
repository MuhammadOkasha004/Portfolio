// Contact form validation and submission
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const successState = document.getElementById('form-success');
  const resetBtn = document.getElementById('form-reset');

  if (!form) return;

  function validateField(field) {
    const group = field.closest('.form-group');
    const errorMsg = group.querySelector('.error-msg');
    let valid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
      valid = false;
    }

    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        valid = false;
      }
    }

    group.classList.toggle('error', !valid);
    return valid;
  }

  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      field.closest('.form-group').classList.remove('error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch('https://formspree.io/f/xvznryzp', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          form.style.display = 'none';
          successState.style.display = 'flex';
          successState.style.opacity = '0';
          setTimeout(() => {
            successState.style.transition = 'opacity 0.4s ease';
            successState.style.opacity = '1';
          }, 50);
        }, 400);
      } else {
        throw new Error('Form submission failed');
      }
    }).catch(() => {
      alert('Something went wrong. Please try again or email me directly.');
    }).finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      successState.style.opacity = '0';
      setTimeout(() => {
        successState.style.display = 'none';
        form.style.display = 'block';
        form.style.opacity = '1';
        form.reset();
        fields.forEach(f => f.closest('.form-group').classList.remove('error'));
      }, 300);
    });
  }
})();
