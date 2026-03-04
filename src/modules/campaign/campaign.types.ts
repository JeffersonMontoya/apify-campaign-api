export interface Campaign {
  id?: number;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'finished';
  rate_limit_per_minute: number;
  created_at?: Date;
}