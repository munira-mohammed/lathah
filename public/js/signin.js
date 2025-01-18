// معالج إرسال البيانات لتسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // إذا كان تسجيل الدخول ناجحًا، قم بإعادة التوجيه إلى صفحة المستخدم
      window.location.href = '/UserRecipesPage'; // أو أي صفحة أخرى تحتاجها
    } else {
      const data = await response.json();
      alert(data.error || 'Login failed');
    }
});
