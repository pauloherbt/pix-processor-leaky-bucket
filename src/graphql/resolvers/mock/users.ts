interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed password
}

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36rQoeG6Lruj3.9qj0m', // hashed 'password123'
  },
];
