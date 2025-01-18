document.getElementById('registerForm').addEventListener('submit', async (e) => { e.preventDefault(); 
  const name = document.getElementById('registerName').value.trim();
   const email = document.getElementById('registerEmail').value.trim(); 
   const password = document.getElementById('registerPassword').value.trim(); 
   // التحقق من وجود البيانات المدخلة 
   if (!name || !email || !password) { alert('جميع الحقول مطلوبة'); return; } 
   try { // إرسال البيانات إلى الخادم 
   const response = await fetch('/signup' , 
    { method: 'POST', headers: { 'Content-Type': 'application/json', },
     body: JSON.stringify({ name, email, password }), }); 
     // معالجة الاستجابة من الخادم 
     if (response.ok)
     { alert('تسجيل النجاح'); window.location.href = '/login'; } 
     else { const data = await response.json(); alert(data.error || 'فشل التسجيل'); } } 
     catch (error) { console.error(error); alert('خطأ في الخادم'); } });