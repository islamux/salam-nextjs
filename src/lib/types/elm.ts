export interface ElmItem {
  titles: string[];
  texts: string[];
  order: string[];
}

export interface Bookmark {
  id: string;
  chapterId: string;
  itemIndex: number;
  title: string;
  content: string;
  notes?: string;
  createdAt: number;
}
