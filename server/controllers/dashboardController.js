const Recipe = require('../models/Recipe'); 
const User = require('../models/User');
const mongoose = require("mongoose");


exports.dashboard = async (req, res) => {

  const locals = {
    title: "وصفاتي", // عنوان الصفحة
  };

  try {
    // استعلام للحصول على الوصفات المتعلقة بالمستخدم الحالي
    const recipes = await Recipe.aggregate([
      { $sort: { createdAt: -1 } }, // ترتيب الوصفات بناءً على تاريخ الإنشاء من الأحدث إلى الأقدم
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } }, // مطابقة الوصفات مع المستخدم الحالي
      {
        $project: {
          _id:1,
          name: 1, // اسم الوصفة
          authorize: 1, // اسم 
          image: 1, // صورة الوصفة
          type: 1, // نوع الطبق
          level: 1, // مستوى الصعوبة
          time: 1, // الوقت المطلوب للتحضير
          minPeople: 1, // الحد الأدنى لعدد الأشخاص
          maxPeople: 1, // الحد الأقصى لعدد الأشخاص
        },
      }
    ]).exec(); // جلب كل الوصفات

    // إعادة عرض صفحة لوحة التحكم مع الوصفات
    res.render('dashboard/UserRecipesPage', {
      userName: req.user.firstName, // اسم المستخدم
      locals, // المعلومات الخاصة بالصفحة
      recipes, // الوصفات المعروضة
      layout: "../views/layouts/dashboard" // تخطيط الصفحة
    });

  } catch (error) {
    console.log(error); // طباعة الخطأ إذا حدث
    res.status(500).send("حدث خطأ أثناء تحميل الوصفات.");
  }
};



exports.dashboardViewRecipe = async (req, res) => {
  try {
    // جلب الوصفة بناءً على المعرف
    const recipe = await Recipe.findOne({ _id: req.params.id }).lean();

    // التحقق إذا كانت الوصفة موجودة
    if (recipe) {
      console.log(recipe); // طباعة البيانات للتحقق

      // عرض صفحة الوصفة
      res.render("dashboard/RecipePage", {
        recipeID: req.params.id,
        recipe,
        layout: "../views/layouts/dashboard",
      });
    } else {
      // في حال عدم العثور على الوصفة
      res.status(404).render("errors/404", { message: "وصفة غير موجودة." });
    }
  } catch (error) {
    // التعامل مع الأخطاء
    console.error("خطأ أثناء جلب الوصفة:", error);
    res.status(500).render("errors/500", { message: "حدث خطأ أثناء محاولة عرض الوصفة." });
  }
};


exports.dashboardUpdateRecipe = async (req, res) => {
  try {
    // جلب الوصفة بناءً على id المستخدم
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });

    if (!recipe) {
      return res.status(404).send("الوصفة غير موجودة أو ليس لديك صلاحية التعديل.");
    }

    // عرض صفحة تعديل الوصفة مع البيانات
    res.render("dashboard/UpdateRecipePage", {
      recipe, // تمرير الوصفة إلى القالب
      layout: "../views/layouts/dashboard"
    });
  } catch (error) {
    console.error("خطأ أثناء جلب الوصفة:", error);
    res.status(500).send("حدث خطأ أثناء جلب الوصفة.");
  }
};



exports.dashboardUpdateRecipeSubmit = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // التحقق من أن الوصفة تخص المستخدم الحالي
      { 
        ...req.body, // استخدام جميع البيانات المرسلة في body لتحديث الوصفة
        updatedAt: Date.now() // إضافة التاريخ الحالي للتحديث
      },
      { new: true } // سيعيد الوصفة المحدثة بعد التعديل
    );

    if (!updatedRecipe) {
      return res.status(404).send("الوصفة غير موجودة أو ليس لديك صلاحية التعديل.");
    }

    res.redirect("/dashboard/UserRecipesPage");
  } catch (error) {
    console.error("خطأ أثناء تحديث الوصفة:", error);
    res.status(500).send("حدث خطأ أثناء تحديث الوصفة.");
  }
};



exports.dashboardDeleteRecipe = async (req, res) => {
  try {
  
    await Recipe.deleteOne({ _id: req.params.id, user: req.user.id });

    res.redirect("/dashboard/UserRecipesPage");
  } catch (error) {
    console.error("حدث خطأ أثناء حذف الوصفة:", error);
    res.status(500).render("errors/500", { message: "حدث خطأ أثناء محاولة حذف الوصفة." });
  }
};

exports.dashboardAddRecipe = async (req, res) => {
  res.render("dashboard/AddRecipePage", {
    layout: "../views/layouts/dashboard",
  });
};

exports.dashboardAddRecipeSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id; // ربط الوصفة بالمستخدم الحالي
    await Recipe.create(req.body); // إنشاء وصفة جديدة في قاعدة البيانات
    res.redirect("/dashboard/UserRecipesPage"); // إعادة التوجيه إلى لوحة التحكم بعد الإضافة
  } catch (error) {
    console.log(error);
    res.status(500).send("حدث خطأ أثناء إضافة الوصفة.");
  }
};

exports.dashboardSearch = async (req, res) => {
  try {
    // استعلام للحصول على جميع الوصفات
    const recipes = await Recipe.aggregate([
      { $sort: { createdAt: -1 } }, // ترتيب الوصفات بناءً على تاريخ الإنشاء (من الأحدث إلى الأقدم)
    ]);

    res.render("dashboard/SearchPage", {
      searchResults: recipes, // تمرير الوصفات إلى الصفحة
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("حدث خطأ أثناء تحميل الوصفات.");
  }
};


exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.name;

    if (!searchTerm) {
      console.log("Search term is undefined or empty.");
      return res.render("dashboard/SearchPage", {
        searchResults: [],
        layout: "../views/layouts/dashboard",
      });
    }

    console.log("Search Term:", searchTerm); // تحقق من مصطلح البحث

    // معالجة الحروف الخاصة
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9ء-ي ]/g, "");

    // استخدام تعبير عادي للبحث
    const searchRegex = new RegExp(searchNoSpecialChars, "i");

    // البحث في قاعدة البيانات
    const searchResults = await Recipe.find({
      $or: [
        { name: { $regex: searchRegex } },
        { body: { $regex: searchRegex } }, // في حال وجود حقل body
      ],
    });

    res.render("dashboard/SearchPage", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
