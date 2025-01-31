const mongoose = require('mongoose');
const mongoose = require("mongoose");
const { authorize } = require("passport");
const Schema = mongoose.Schema; 

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // اسم الوصفة
  },
  authorize: {
    type: String,
    required: true, 
  },
  image: {
    type: String, // رابط الصورة (يتم تخزين مسار الصورة بعد رفعها)
  },
  type: {
    type: String,
    enum: ["أطباق رئيسية", "مقبلات", "مشروبات", "حلويات"], // نوع الطبق باللغة العربية
    required: true,
  },
  level: {
    type: String,
    enum: ["صعب", "متوسط", "سهل"], // مستوى الصعوبة باللغة العربية
    required: true,
  },
  time: {
    type: Number, // الوقت بالدقائق
    required: true,
  },
  minPeople: {
    type: Number, // الحد الأدنى لعدد الأشخاص
    required: true,
  },
  maxPeople: {
    type: Number, // الحد الأقصى لعدد الأشخاص
    required: true,
  },
  ingredients: {
    type: [String], // مصفوفة من النصوص (المكونات)
    required: [true, 'This field is required.'], // إلزامية المكونات
  },
  steps: 
    {
      type: [String], // مصفوفة من النصوص (المكونات)
    required: [true, 'This field is required.'], // إلزامية المكونات
    },
  
  createdAt: {
    type: Date,
    default: Date.now, // تاريخ الإنشاء
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});


module.exports = mongoose.model("Recipe", recipeSchema);
