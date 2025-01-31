document.addEventListener("DOMContentLoaded", function() {
    let addIngredientsBtn = document.getElementById('addIngredientsBtn');
    let ingredientList = document.querySelector('.ingredientList');
    let ingredeintDiv = document.querySelector('.ingredeintDiv');

    if (!addIngredientsBtn || !ingredientList || !ingredeintDiv) {
        console.error("بعض العناصر غير موجودة في الصفحة!");
        return;
    }

    addIngredientsBtn.addEventListener('click', function() {
        let newIngredients = ingredeintDiv.cloneNode(true);
        let input = newIngredients.querySelector('input');
        input.value = ''; 
        ingredientList.appendChild(newIngredients);
    });
});


let addPreparationStepBtn = document.getElementById('addPreparationStepBtn');
let preparationStepList = document.querySelector('.preparationStepList');
let preparationStepDiv = document.querySelectorAll('.preparationStepDiv')[0];

addPreparationStepBtn.addEventListener('click', function(){
  let newPreparationStep = preparationStepDiv.cloneNode(true);
  let input = newPreparationStep.getElementsByTagName('input')[0];
  input.value = ''; // تفريغ القيمة السابقة
  preparationStepList.appendChild(newPreparationStep); // إضافة الخطوة الجديدة
});

