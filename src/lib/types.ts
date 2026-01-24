export type Jurisdiction = 'FEDERAL' | 'STATE' | 'UNKNOWN';
export type ReportStatus = 'reported' | 'verified' | 'in_progress' | 'fixed';
export type UserRole = 'citizen' | 'coordinator' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  state_of_residence: string;
  lga: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    lga: string;
  };
  jurisdiction: Jurisdiction;
  severity_level: number; // 1-10
  status: ReportStatus; // Contributes to "Danger Density"
  images: string[];
  created_at: string; // ISO string
  reporter_id: string;
}

// The "Systems Thinking" Engine: Automatically maps reports to authorities
export interface JurisdictionRule {
  id: string;
  state: string;
  lga?: string;
  road_name_pattern: string; // e.g., "%Expressway%", "Trunk A"
  jurisdiction: 'FEDERAL' | 'STATE';
}
