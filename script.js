// Константы для расчетов
const CONSTANTS = {
  // Параметры алкоголя
  ALCOHOL: {
    YIELD_PER_KG_SUGAR: 0.5, // Теоретический выход спирта из 1 кг сахара (л)
  },
  // Параметры браги
  WASH: {
    LITERS_PER_KG_SUGAR: 5, // Объем браги из 1 кг сахара (л)
    WATER_PER_KG_SUGAR: 4, // Количество воды на 1 кг сахара (л)
  },
  // Параметры дрожжей
  YEAST: {
    PER_KG_SUGAR: 30, // Количество дрожжей на 1 кг сахара (г)
  },
  // Параметры газа
  GAS: {
    SUGAR_PER_CYLINDER: 200, // Количество сахара на 1 баллон газа (кг)
    CYLINDER_PRICE: 1400, // Цена баллона газа (руб)
  },
  // Параметры перегонки
  DISTILLATION: {
    TIME_PER_LITER: 1, // Время перегонки 1 л спирта (часы)
    POWER_PER_HOUR: 3.25, // Потребление электроэнергии (кВт·ч/час)
  },
  // Параметры электроэнергии
  ELECTRICITY: {
    RATE: 8.13, // Цена за 1 кВт·ч (руб)
  },
};

// Функция переключения режимов расчета
function switchCalculationMode() {
  const quantityMode = document.getElementById('mode-quantity');
  const timeMode = document.getElementById('mode-time');
  const quantityInputs = document.getElementById('quantity-inputs');
  const timeInputs = document.getElementById('time-inputs');
  
  if (quantityMode.checked) {
    quantityInputs.style.display = 'block';
    timeInputs.style.display = 'none';
  } else {
    quantityInputs.style.display = 'none';
    timeInputs.style.display = 'block';
  }
}

// Функция обратного расчета (от спирта к ингредиентам)
function calculateFromAlcohol() {
  const quantityMode = document.getElementById('mode-quantity').checked;
  
  if (quantityMode) {
    calculateByQuantity();
  } else {
    calculateByTime();
  }
}

// Расчет по количеству спирта
function calculateByQuantity() {
  // Получаем желаемое количество спирта
  const targetAlcohol = parseFloat(document.getElementById('target-alcohol').value) || 0;
  // Получаем количество колон
  const columnsCount = parseInt(document.getElementById('columns-count').value) || 1;
  // Получаем цену спирта за литр
  const alcoholPrice = parseFloat(document.getElementById('alcohol-price').value) || 0;

  // Получаем цены из полей ввода
  const sugarPrice = parseFloat(document.getElementById('sugar-price2').value) || 0;
  const yeastPrice = parseFloat(document.getElementById('yeast-price2').value) || 0;
  const waterPrice = parseFloat(document.getElementById('water-price2').value) || 0;
  const gasPrice = parseFloat(document.getElementById('gas-price2').value) || 0;
  const electricityPrice = parseFloat(document.getElementById('electricity-price2').value) || 0;

  // Скрываем информацию о количестве спирта (не нужна в режиме по количеству)
  document.getElementById('alcohol-output-info').style.display = 'none';

  // Расчет необходимого количества ингредиентов
  const requiredSugar = targetAlcohol / CONSTANTS.ALCOHOL.YIELD_PER_KG_SUGAR;
  const requiredWater = requiredSugar * CONSTANTS.WASH.WATER_PER_KG_SUGAR;
  const requiredYeastGrams = requiredSugar * CONSTANTS.YEAST.PER_KG_SUGAR;
  const requiredYeastKg = requiredYeastGrams / 1000;
  const requiredWash = requiredSugar * CONSTANTS.WASH.LITERS_PER_KG_SUGAR;
  const requiredGas = requiredSugar / CONSTANTS.GAS.SUGAR_PER_CYLINDER;
  
  // Расчет времени перегонки с учетом количества колон
  const baseTimePerLiter = CONSTANTS.DISTILLATION.TIME_PER_LITER;
  const timePerLiter = baseTimePerLiter / columnsCount; // Время уменьшается при увеличении колон
  const requiredTime = targetAlcohol * timePerLiter;
  const requiredDays = Math.floor(requiredTime / 24); // Целое количество суток
  const remainingHours = Math.round(requiredTime % 24); // Оставшиеся часы
  
  // Расчет скорости отбора спирта в час
  const speedPerHour = columnsCount; // 1 л/час для 1 колоны, 2 л/час для 2 колон
  
  // Расчет потребления электричества с учетом количества колон
  const basePowerPerHour = CONSTANTS.DISTILLATION.POWER_PER_HOUR;
  const powerPerHour = basePowerPerHour * columnsCount; // Потребление увеличивается при увеличении колон
  const requiredElectricity = requiredTime * powerPerHour;
  const costElectricity = requiredElectricity * electricityPrice;
  const requiredYeast2 = requiredYeastKg * 2;

  // Расчет стоимости ингредиентов
  const costSugar = requiredSugar * sugarPrice;
  const costWater = requiredWater * waterPrice;
  const costYeast = requiredYeastKg * yeastPrice * 2;
  const costGas = requiredGas * gasPrice;
  const totalCost = costSugar + costWater + costYeast + costGas + costElectricity;

  // Расчет себестоимости 1 литра спирта
  const costPerLiter = targetAlcohol > 0 ? (totalCost / targetAlcohol).toFixed(2) : 0;

  // Расчет финансовых результатов
  const totalAlcoholValue = targetAlcohol * alcoholPrice; // Общая стоимость спирта
  const netProfit = totalAlcoholValue - totalCost; // Чистая прибыль

  // Вывод результатов на страницу
  document.getElementById('required-sugar').textContent = requiredSugar.toFixed(0);
  document.getElementById('required-sugar-price').textContent = costSugar.toFixed(2);

  document.getElementById('required-water').textContent = requiredWater.toFixed(0);
  document.getElementById('required-water-price').textContent = costWater.toFixed(2);

  document.getElementById('required-yeast').textContent = requiredYeastKg.toFixed(1);
  document.getElementById('required-yeast-price').textContent = costYeast.toFixed(2);

  document.getElementById('required-wash').textContent = requiredWash.toFixed(0);

  document.getElementById('required-gas').textContent = requiredGas;
  document.getElementById('required-gas-price').textContent = costGas.toFixed(2);

  document.getElementById('required-electricity').textContent = requiredElectricity.toFixed(0);
  document.getElementById('required-electricity-price').textContent = costElectricity.toFixed(2);

  document.getElementById('total-required-cost').textContent = totalCost.toFixed(2);

  // Вывод себестоимости 1 литра
  document.getElementById('cost-per-liter-result').textContent = costPerLiter;

  // Вывод новых финансовых результатов
  document.getElementById('total-alcohol-value').textContent = totalAlcoholValue.toFixed(2);
  document.getElementById('net-profit').textContent = netProfit.toFixed(2);

  // Показываем блок с результатами
  document.getElementById('alcohol-result').style.display = 'block';

  document.getElementById('required-yeast2').textContent = requiredYeast2.toFixed(0);
  // Вывод времени перегонки с учетом количества колон
  document.getElementById('required-time').textContent = requiredTime.toFixed(0);
  document.getElementById('speed-per-hour').textContent = speedPerHour.toFixed(0);
  document.getElementById('required-days').textContent = requiredDays;
  document.getElementById('remaining-hours').textContent = remainingHours;
}

// Расчет по времени работы
function calculateByTime() {
  // Получаем время работы
  const workingDays = parseFloat(document.getElementById('working-days').value) || 0;
  const workingHoursPerDay = parseFloat(document.getElementById('working-hours-per-day').value) || 24;
  const totalWorkingHours = workingDays * workingHoursPerDay;
  
  // Получаем количество колон
  const columnsCount = parseInt(document.getElementById('columns-count').value) || 1;
  // Получаем цену спирта за литр
  const alcoholPrice = parseFloat(document.getElementById('alcohol-price').value) || 0;

  // Получаем цены из полей ввода
  const sugarPrice = parseFloat(document.getElementById('sugar-price2').value) || 0;
  const yeastPrice = parseFloat(document.getElementById('yeast-price2').value) || 0;
  const waterPrice = parseFloat(document.getElementById('water-price2').value) || 0;
  const gasPrice = parseFloat(document.getElementById('gas-price2').value) || 0;
  const electricityPrice = parseFloat(document.getElementById('electricity-price2').value) || 0;

  // Расчет количества спирта, которое можно получить за указанное время
  const speedPerHour = columnsCount; // л/час
  const targetAlcohol = totalWorkingHours * speedPerHour;

  // Показываем информацию о количестве спирта
  document.getElementById('alcohol-output-info').style.display = 'block';
  document.getElementById('alcohol-output-amount').textContent = targetAlcohol.toFixed(2);

  // Расчет необходимого количества ингредиентов
  const requiredSugar = targetAlcohol / CONSTANTS.ALCOHOL.YIELD_PER_KG_SUGAR;
  const requiredWater = requiredSugar * CONSTANTS.WASH.WATER_PER_KG_SUGAR;
  const requiredYeastGrams = requiredSugar * CONSTANTS.YEAST.PER_KG_SUGAR;
  const requiredYeastKg = requiredYeastGrams / 1000;
  const requiredWash = requiredSugar * CONSTANTS.WASH.LITERS_PER_KG_SUGAR;
  const requiredGas = requiredSugar / CONSTANTS.GAS.SUGAR_PER_CYLINDER;
  
  // Расчет потребления электричества
  const basePowerPerHour = CONSTANTS.DISTILLATION.POWER_PER_HOUR;
  const powerPerHour = basePowerPerHour * columnsCount;
  const requiredElectricity = totalWorkingHours * powerPerHour;
  const costElectricity = requiredElectricity * electricityPrice;
  const requiredYeast2 = requiredYeastKg * 2;

  // Расчет стоимости ингредиентов
  const costSugar = requiredSugar * sugarPrice;
  const costWater = requiredWater * waterPrice;
  const costYeast = requiredYeastKg * yeastPrice * 2;
  const costGas = requiredGas * gasPrice;
  const totalCost = costSugar + costWater + costYeast + costGas + costElectricity;

  // Расчет себестоимости 1 литра спирта
  const costPerLiter = targetAlcohol > 0 ? (totalCost / targetAlcohol).toFixed(2) : 0;

  // Расчет финансовых результатов
  const totalAlcoholValue = targetAlcohol * alcoholPrice;
  const netProfit = totalAlcoholValue - totalCost;

  // Вывод результатов на страницу
  document.getElementById('required-sugar').textContent = requiredSugar.toFixed(0);
  document.getElementById('required-sugar-price').textContent = costSugar.toFixed(2);

  document.getElementById('required-water').textContent = requiredWater.toFixed(0);
  document.getElementById('required-water-price').textContent = costWater.toFixed(2);

  document.getElementById('required-yeast').textContent = requiredYeastKg.toFixed(1);
  document.getElementById('required-yeast-price').textContent = costYeast.toFixed(2);

  document.getElementById('required-wash').textContent = requiredWash.toFixed(0);

  document.getElementById('required-gas').textContent = requiredGas;
  document.getElementById('required-gas-price').textContent = costGas.toFixed(2);

  document.getElementById('required-electricity').textContent = requiredElectricity.toFixed(0);
  document.getElementById('required-electricity-price').textContent = costElectricity.toFixed(2);

  document.getElementById('total-required-cost').textContent = totalCost.toFixed(2);

  // Вывод себестоимости 1 литра
  document.getElementById('cost-per-liter-result').textContent = costPerLiter;

  // Вывод новых финансовых результатов
  document.getElementById('total-alcohol-value').textContent = totalAlcoholValue.toFixed(2);
  document.getElementById('net-profit').textContent = netProfit.toFixed(2);

  // Показываем блок с результатами
  document.getElementById('alcohol-result').style.display = 'block';

  document.getElementById('required-yeast2').textContent = requiredYeast2.toFixed(0);
  // Вывод времени перегонки
  document.getElementById('required-time').textContent = totalWorkingHours.toFixed(0);
  document.getElementById('speed-per-hour').textContent = speedPerHour.toFixed(0);
  document.getElementById('required-days').textContent = workingDays;
  document.getElementById('remaining-hours').textContent = 0;
}
