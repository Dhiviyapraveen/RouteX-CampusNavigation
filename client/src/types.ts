export type Category =
  | 'Academic'
  | 'Food'
  | 'Residence'
  | 'Administration'
  | 'Entrance'
  | 'Recreation'
  | 'Health';

export interface Location {
  id?: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description?: string;
  image?: string;
  facilities?: string[];
}
