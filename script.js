let unit = 'metric';

function setUnit(u) {
  unit = u;
  document.getElementById('btn-metric').classList.toggle('active', u === 'metric');
  document.getElementById('btn-imperial').classList.toggle('active', u === 'imperial');
  document.getElementById('metric-fields').style.display = u === 'metric' ? '' : 'none';
  document.getElementById('imperial-fields').style.display = u === 'imperial' ? '' : 'none';
  document.getElementById('result').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('result').style.display = 'none';
}

function calculate() {
  document.getElementById('error').style.display = 'none';
  let heightM, weightKg;

  if (unit === 'metric') {
    const cm = parseFloat(document.getElementById('height-cm').value);
    weightKg = parseFloat(document.getElementById('weight-kg').value);
    if (!cm || !weightKg || cm <= 0 || weightKg <= 0) return showError('Please enter valid height and weight.');
    if (cm < 50 || cm > 300) return showError('Height should be between 50 and 300 cm.');
    if (weightKg < 10 || weightKg > 500) return showError('Weight should be between 10 and 500 kg.');
    heightM = cm / 100;
  } else {
    const ft = parseFloat(document.getElementById('height-ft').value) || 0;
    const inch = parseFloat(document.getElementById('height-in').value) || 0;
    weightKg = parseFloat(document.getElementById('weight-lb').value);
    const totalIn = ft * 12 + inch;
    if (totalIn <= 0 || !weightKg || weightKg <= 0) return showError('Please enter valid height and weight.');
    if (totalIn < 20 || totalIn > 108) return showError('Height should be between 1\'8" and 9\'0".');
    if (weightKg < 20 || weightKg > 1100) return showError('Weight should be between 20 and 1100 lb.');
    heightM = totalIn * 0.0254;
    weightKg = weightKg * 0.453592;
  }

  const bmi = weightKg / (heightM * heightM);
  displayResult(bmi);
}

function displayResult(bmi) {
  const val = bmi.toFixed(1);
  document.getElementById('bmi-value').textContent = val;

  const labelEl = document.getElementById('bmi-label');
  let cat, cls, range;
  if (bmi < 18.5)      { cat = 'Underweight'; cls = 'cat-underweight'; range = 'BMI < 18.5'; }
  else if (bmi < 25)   { cat = 'Normal weight'; cls = 'cat-normal'; range = 'BMI 18.5 – 24.9'; }
  else if (bmi < 30)   { cat = 'Overweight'; cls = 'cat-overweight'; range = 'BMI 25.0 – 29.9'; }
  else                  { cat = 'Obese'; cls = 'cat-obese'; range = 'BMI ≥ 30.0'; }

  labelEl.textContent = cat;
  labelEl.className = 'bmi-label ' + cls;
  document.getElementById('bmi-range').textContent = range;

  // Position marker: map BMI 10–40 to 0–100%
  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));
  document.getElementById('scale-marker').style.left = pct + '%';

  document.getElementById('result').style.display = '';
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calculate();
});
