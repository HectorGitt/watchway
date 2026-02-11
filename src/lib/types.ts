export type Jurisdiction = 'FEDERAL' | 'STATE' | 'UNKNOWN';
export type ReportStatus = 'unverified' | 'verified' | 'fixed';
export type UserRole = 'citizen' | 'coordinator' | 'admin';

export interface User {
  id: string;
  email: string;
  username?: string;
  role: "citizen" | "coordinator" | "admin";
  is_active: boolean;
  is_verified: boolean;
  is_suspended: boolean;
  civic_points: number;
  coordinator_application_status: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
}

export interface Report {
  id: string; // Hazard_ID
  title: string;
  description: string;
  location: { // Coordinates
    lat: number;
    lng: number;
    address: string;
    state: string;
    lga: string;
  };
  jurisdiction: Jurisdiction;
  severity_level: number;
  status: ReportStatus; // 'unverified' | 'verified' | 'fixed'

  // Trust Protocol Fields
  live_image: string; // URL to the live captured photo
  verification_count: number;
  is_verified: boolean;

  // X Automation Fields
  x_post_status: 'pending' | 'posted' | 'failed';
  x_link?: string;

  created_at: string;
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
