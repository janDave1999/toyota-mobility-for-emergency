export type UserRole = 'ADMIN' | 'DISPATCHER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization_id?: string;
  organization_name?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'POLICE' | 'AMBULANCE' | 'FIRE' | 'BARANGAY' | 'LGU';
  region: string;
  created_at: string;
}

export interface Incident {
  id: string;
  type: 'POLICE' | 'AMBULANCE' | 'FIRE' | 'OTHER';
  status: 'REPORTED' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'RESOLVED' | 'CANCELLED';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reporter_id: string;
  assigned_responders: string[];
  created_at: string;
  updated_at: string;
}

export interface Responder {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization_id: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  current_location?: {
    lat: number;
    lng: number;
  };
  role: 'RESPONDER' | 'DISPATCHER';
}

export interface DispatchAssignment {
  id: string;
  incident_id: string;
  responder_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  assigned_at: string;
  responded_at?: string;
}
