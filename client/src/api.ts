const API_URL = 'http://localhost:5000';

export const api = {
  async createProject(data: any) {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  }
  // ... other API methods
};