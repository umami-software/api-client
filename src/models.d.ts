export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Website {
  id: string;
  userId: string;
  name: string;
  domain: string;
  shareId: string;
  createdAt: Date;
}
