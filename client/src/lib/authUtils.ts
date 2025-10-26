// Reference: blueprint:javascript_log_in_with_replit
import { useQuery } from "@tanstack/react-query";

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isAdmin?: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: error ? null : user,
    isLoading,
    isAuthenticated: !error && !!user,
  };
}
