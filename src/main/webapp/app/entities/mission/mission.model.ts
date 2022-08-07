export interface IMission {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewMission = Omit<IMission, 'id'> & { id: null };
