/**
 * Users API service
 * Handles user-related API calls
 */

import { apiService } from './api';
import type { User } from '../types';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string | string[]; // e.g., 'username' or ['username', 'company']
  sortBy?: string | string[]; // e.g., 'createdAt:DESC' or ['createdAt:DESC', 'username:ASC']
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UsersService {
  /**
   * Get all users with optional filtering and sorting
   */
  async getUsers(params?: GetUsersParams): Promise<UsersResponse> {
    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      
      if (params?.page) {
        queryParams.page = String(params.page);
      }
      
      if (params?.limit) {
        queryParams.limit = String(params.limit);
      }
      
      if (params?.search) {
        queryParams.search = params.search;
      }
      
      // Handle searchBy - convert array to comma-separated string
      if (params?.searchBy) {
        queryParams.searchBy = Array.isArray(params.searchBy) 
          ? params.searchBy.join(',') 
          : params.searchBy;
      }
      
      // Handle sortBy - convert array to comma-separated string
      if (params?.sortBy) {
        queryParams.sortBy = Array.isArray(params.sortBy)
          ? params.sortBy.join(',')
          : params.sortBy;
      }
      
      const response = await apiService.get<UsersResponse>('/api/v1/users', queryParams);
      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      console.error('Failed to fetch users:', error);
      
      // Check if it's the specific Drizzle error
      if (error.message?.includes('Symbol(drizzle:Name)')) {
        throw new Error(
          'Backend error: Invalid column reference in query. ' +
          'Please check that all searchBy and sortBy fields exist in the database schema.'
        );
      }
      
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiService.get<User>(`/api/v1/users/${id}`);
    return response.data;
  }
}

export const usersService = new UsersService();
