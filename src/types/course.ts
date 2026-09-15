export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at?: string;
  category?: string;
  instructor?: string;
  total_lessons?: number;
  completed_lessons?: number;
  color_gradient?: string;
  description?: string;
}