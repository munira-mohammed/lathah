const User = require('../models/User'); // تأكد من مسار الموديل

// تسجيل المستخدم
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق إذا كان البريد الإلكتروني موجودًا مسبقًا
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // إنشاء مستخدم جديد
    const newUser = new User({
      name, 
      email,
      password
    });

    // حفظ المستخدم في قاعدة البيانات
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // العثور على المستخدم باستخدام البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // التحقق من كلمة المرور
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // تسجيل الدخول بنجاح
    req.session.userId = user._id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// التحقق إذا كان المستخدم مسجلاً الدخول
exports.isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    return next(); // إذا كان المستخدم مسجلاً الدخول، تابع الطلب
  } else {
    res.status(401).json({ error: 'Not logged in' }); // إرجاع استجابة JSON إذا لم يكن المستخدم مسجلاً الدخول
  }
};

