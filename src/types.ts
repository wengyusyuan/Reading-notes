export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  library?: string;
  borrowDate?: Date | null;
  returnDate?: Date | null;
  thoughts: string;
  rating: number;
  userId: string;
  createdAt: Date;
  imageUrl?: string;
}

export type BookFormValues = Omit<Book, 'id' | 'userId' | 'createdAt' | 'category'>;
