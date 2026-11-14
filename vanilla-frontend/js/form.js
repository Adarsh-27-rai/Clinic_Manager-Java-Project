const MEDICINES_LIST = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin',
  'Azithromycin', 'Cetirizine', 'Omeprazole', 'Metformin',
  'Vitamin C', 'Vitamin D', 'Zinc Tablets', 'Antacid',
  'Cough Syrup', 'Eye Drops', 'Insulin', 'Dolo 650',
  'Pantoprazole', 'Levocetirizine'
];

let selectedMedicines = new Set();
let isEditMode = false;
let patientId = null;

document.addEventListener('DOMContentLoaded', () => {
  setupMedicinesList();
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (id) {
    isEditMode = true;
    patientId = id;
    document.getElementById('page-title').textContent = 'Edit Patient Profile';
    document.getElementById('page-desc').textContent = 'Update the information for this patient below.';
    document.getElementById('submit-btn').textContent = 'Save Changes';
    
    // Highlight the nav link
    document.getElementById('nav-add-link').classList.remove('active');
    
    loadPatientData(id);
  } else {
    document.getElementById('nav-add-link').classList.add('active');
  }

  document.getElementById('patient-form').addEventListener('submit', handleSubmit);
});

function setupMedicinesList() {
  const container = document.getElementById('medicines-container');
  MEDICINES_LIST.forEach(med => {
    const label = document.createElement('label');
    label.className = 'med-label';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = med;
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedMedicines.add(med);
        label.style.background = '#eff6ff';
        label.style.borderColor = '#bfdbfe';
        label.style.color = 'var(--primary)';
        label.style.fontWeight = 'bold';
      } else {
        selectedMedicines.delete(med);
        label.style.background = 'white';
        label.style.borderColor = 'transparent';
        label.style.color = 'inherit';
        label.style.fontWeight = 'normal';
      }
      updateMedCount();
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + med));
    container.appendChild(label);
  });
}

function updateMedCount() {
  const countBadge = document.getElementById('med-count');
  if (selectedMedicines.size > 0) {
    countBadge.style.display = 'inline-block';
    countBadge.textContent = `${selectedMedicines.size} selected`;
  } else {
    countBadge.style.display = 'none';
  }
}

async function loadPatientData(id) {
  try {
    const patient = await api.getPatient(id);
    document.getElementById('name').value = patient.name;
    document.getElementById('age').value = patient.age;
    document.getElementById('gender').value = patient.gender;
    document.getElementById('phone').value = patient.phone;
    if (patient.appointmentDate) {
      document.getElementById('appointmentDate').value = patient.appointmentDate.split('T')[0];
    }
    document.getElementById('medicalReason').value = patient.medicalReason;
    document.getElementById('isDone').checked = patient.isDone;

    if (patient.medicines) {
      const meds = patient.medicines.split(',').map(m => m.trim());
      const container = document.getElementById('medicines-container');
      const inputs = container.querySelectorAll('input[type="checkbox"]');
      inputs.forEach(input => {
        if (meds.includes(input.value)) {
          input.checked = true;
          // trigger change event
          input.dispatchEvent(new Event('change'));
        }
      });
    }
  } catch (e) {
    alert('Failed to load patient data.');
    window.location.href = 'patients.html';
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const btn = document.getElementById('submit-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const data = {
    name: document.getElementById('name').value,
    age: parseInt(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    phone: document.getElementById('phone').value,
    appointmentDate: document.getElementById('appointmentDate').value,
    medicalReason: document.getElementById('medicalReason').value,
    isDone: document.getElementById('isDone').checked,
    medicines: Array.from(selectedMedicines).join(',')
  };

  try {
    if (isEditMode) {
      await api.updatePatient(patientId, data);
      alert('Patient updated successfully!');
    } else {
      await api.createPatient(data);
      alert('Patient added successfully!');
    }
    window.location.href = 'patients.html';
  } catch (error) {
    alert('Failed to save patient. Check if backend is running.');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}
