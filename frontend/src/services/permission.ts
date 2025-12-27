// import type { PermissionList } from '../types/api';
import api from './api';

export type PermissionStatus = 'waiting' | 'accepted' | 'denied' | 'violation';

export interface Permissions {
  id: number;
  user_id: number;
  reason: string;
  start_time: string;
  end_time: string;
  status: PermissionStatus;

  student_name?: string;
  student_nim?: string;
}

export async function getAllPermissionsAdmin(): Promise<Permissions[]> {
  const res = await api.get<Permissions[]>('/api/permission/admin/all');
  return res.data;
}

export async function updatePermissionStatus(
  id: number,
  status: 'accepted' | 'denied'
) {
  const res = await api.patch(`/api/permission/admin/status/${id}`, { status });
  return res.data;
}
