// Blog post type definition
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  author: string;
  content: string;
  readingTime?: string;
}

export interface BlogMetadata {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  author: string;
}
