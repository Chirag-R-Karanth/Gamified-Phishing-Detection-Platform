const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Mission {
  _id: string;
  title: string;
  mission_number: number;
  difficulty: number;
  category: string;
  ranger_name: string;
  ranger_email: string;
  ranger_request: string;
  email_from: string;
  email_subject: string;
  email_body_html: string;
  email_headers: any;
  required_level: number;
  total_attempts: number;
  success_rate: number;
}

export interface SubmissionResult {
  submission: any;
  xpEarned: number;
  newLevel: number;
  totalXp: number;
  correctAnswer: string;
  clues: any[];
}

// Get all missions
export async function getMissions(token: string) {
  const response = await fetch(`${API_URL}/missions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch missions');
  }

  return result;
}

// Get single mission
export async function getMission(missionId: string, token: string) {
  const response = await fetch(`${API_URL}/missions/${missionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch mission');
  }

  return result;
}

// Submit mission verdict
export async function submitMission(
  missionId: string, 
  verdict: string, 
  selectedClues: string[],
  timeSpent: number,
  token: string
): Promise<SubmissionResult> {
  const response = await fetch(`${API_URL}/missions/${missionId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      verdict,
      selectedClues,
      timeSpent
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit mission');
  }

  return result.data;
}

// Create mission (admin)
export async function createMission(missionData: any, token: string) {
  const response = await fetch(`${API_URL}/missions/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(missionData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create mission');
  }

  return result;
}

// Get leaderboard
export async function getLeaderboard(token: string) {
  const response = await fetch(`${API_URL}/missions/leaderboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch leaderboard');
  }

  return result;
}
