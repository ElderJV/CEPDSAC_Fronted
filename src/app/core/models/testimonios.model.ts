export interface TestimonioItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  course: string;
}

export interface TestimoniosModel {
  testimonio: TestimonioItem[];
}
