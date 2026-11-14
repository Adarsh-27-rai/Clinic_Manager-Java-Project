const API_URL = 'http://localhost:8080/api/patients';

// Helper to get auth headers
function getAuthHeaders(additionalHeaders = {}) {
  const user = localStorage.getItem('user');
  const headers = { ...additionalHeaders };
  if (user) {
    const parsedUser = JSON.parse(user);
    headers['X-User-Id'] = parsedUser.id.toString();
  }
  return headers;
}

const api = {
  async getAllPatients() {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      throw error;
    }
  },

  async getPatient(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      throw error;
    }
  },

  async createPatient(patientData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to create patient:', error);
      throw error;
    }
  },

  async updatePatient(id, patientData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  },

  async deletePatient(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return true;
    } catch (error) {
      console.error('Failed to delete patient:', error);
      throw error;
    }
  },

  async togglePatientStatus(id, isDone) {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ isDone }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to toggle patient status:', error);
      throw error;
    }
  }
};
