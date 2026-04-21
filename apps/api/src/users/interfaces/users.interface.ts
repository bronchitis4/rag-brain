import { User } from '@rag-brain/database';

export interface CreateUserDto {
  email: string;
  name?: string;
}

export interface UserResponse {
  user: User;
}
