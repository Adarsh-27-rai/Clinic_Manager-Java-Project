let currentPatients = [];

document.addEventListener('DOMContentLoaded', () => {
  loadPatients();
});

async function loadPatients() {
  try {
    currentPatients = await api.getAllPatients();
    renderStats();
    renderTable();
  } catch (error) {
    document.getElementById('table-container').innerHTML = `
      <div class="text-center py-16" style="color: var(--red);">
        <p>Failed to load patients. Make sure the backend is running.</p>
      </div>
    `;
  }
}

function renderStats() {
  const statsContainer = document.getElementById('stats-container');
  if (currentPatients.length === 0) {
    statsContainer.innerHTML = '';
    return;
  }

  const done = currentPatients.filter(p => p.isDone).length;
  const pending = currentPatients.length - done;

  statsContainer.innerHTML = `
    <span style="display: flex; align-items: center; gap: 0.375rem; background: #fef3c7; color: #b45309; padding: 0.125rem 0.625rem; border-radius: 9999px; font-weight: 500;">
      <span style="width: 0.375rem; height: 0.375rem; background: #f59e0b; border-radius: 50%;"></span> ${pending} Pending
    </span>
    <span style="display: flex; align-items: center; gap: 0.375rem; background: #d1fae5; color: #047857; padding: 0.125rem 0.625rem; border-radius: 9999px; font-weight: 500;">
      <span style="width: 0.375rem; height: 0.375rem; background: #10b981; border-radius: 50%;"></span> ${done} Completed
    </span>
  `;
}

function renderTable() {
  const container = document.getElementById('table-container');

  if (currentPatients.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16" style="color: var(--slate-400);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏥</div>
        <p style="font-size: 1.125rem; font-weight: 500; color: var(--slate-600);">No patients found.</p>
        <p style="font-size: 0.875rem; margin-top: 0.25rem;">Click "Add Patient" to register your first patient.</p>
      </div>
    `;
    return;
  }

  let rowsHtml = '';

  currentPatients.forEach((patient, index) => {
    const initial = patient.name.charAt(0).toUpperCase();

    let medsHtml = '<span style="color: var(--slate-400);">—</span>';
    if (patient.medicines) {
      medsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 0.25rem; max-width: 150px;">`;
      patient.medicines.split(',').forEach(med => {
        if (med.trim()) {
          medsHtml += `<span class="badge">${med.trim()}</span>`;
        }
      });
      medsHtml += `</div>`;
    }

    const trClass = patient.isDone ? 'style="background: rgba(209, 250, 229, 0.3); opacity: 0.7;"' : '';
    const avatarClass = patient.isDone ? 'background: var(--emerald);' : 'background: linear-gradient(to bottom right, var(--primary), var(--indigo));';
    const nameStyle = patient.isDone ? 'text-decoration: line-through; color: var(--slate-400);' : '';
    const dateFormatted = patient.appointmentDate
      ? new Date(patient.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';

    rowsHtml += `
      <tr ${trClass}>
        <td style="color: var(--slate-400); font-family: monospace; font-size: 0.75rem;">${index + 1}</td>
        
        <td style="font-weight: 600; color: var(--slate-800);">
          <div class="flex items-center gap-2">
            <div class="table-avatar" style="${avatarClass}">
              ${initial}
            </div>
            <span style="${nameStyle}">${patient.name}</span>
          </div>
        </td>

        <td>
          <div class="flex" style="flex-direction: column;">
            <span style="color: var(--slate-700); font-weight: 500;">${patient.age} yrs</span>
            <span style="font-size: 0.75rem; color: var(--slate-500);">${patient.gender}</span>
          </div>
        </td>

        <td style="color: var(--slate-600); font-family: monospace; font-size: 0.75rem;">${patient.phone}</td>

        <td style="color: var(--slate-600);">
          <span style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;" title="${patient.medicalReason}">
            ${patient.medicalReason || '—'}
          </span>
        </td>

        <td style="color: var(--slate-700); font-weight: 500;">
          ${patient.appointmentDate
        ? `<span style="padding: 0.25rem 0.625rem; background: var(--slate-100); color: var(--slate-700); border-radius: 0.5rem; font-size: 0.75rem; border: 1px solid var(--slate-200);">${dateFormatted}</span>`
        : '<span style="color: var(--slate-400);">—</span>'}
        </td>

        <td>
          ${medsHtml}
        </td>

        <td class="text-center" style="diplay:flex; justify-content:center; align-items:center;">
          <button onclick="handleToggle(${patient.id}, ${patient.isDone})" title="${patient.isDone ? 'Mark as pending' : 'Mark as done'}" class="btn-toggle ${patient.isDone ? 'done' : ''}">
            ${patient.isDone ? `
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 20 20" fill="blue">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            ` : '<div style="color: white;">P</div>'}
          </button>
        </td>

        <td>
          <div class="flex gap-2">
            <a href="patient-form.html?id=${patient.id}" class="table-action-btn" title="Edit">Edit</a>
            <button onclick="handleDelete(${patient.id})" class="table-action-btn btn-delete" title="Delete">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Age/Gender</th>
            <th>Contact</th>
            <th>Reason</th>
            <th>Appointment</th>
            <th>Medicines</th>
            <th class="text-center">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

window.handleToggle = async function (id, currentStatus) {
  try {
    const btn = event.currentTarget;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
    await api.togglePatientStatus(id, !currentStatus);
    loadPatients();
  } catch (e) {
    alert('Failed to update status.');
    loadPatients();
  }
};

window.handleDelete = async function (id) {
  if (confirm('Are you sure you want to delete this patient?')) {
    try {
      const btn = event.currentTarget;
      btn.innerHTML = '⏳';
      btn.disabled = true;
      await api.deletePatient(id);
      loadPatients();
    } catch (e) {
      alert('Failed to delete patient.');
      loadPatients();
    }
  }
};
