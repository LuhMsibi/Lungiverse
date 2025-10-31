/**
 * API Client with Firebase Authentication
 * Automatically attaches Firebase ID token to all requests
 */

import { getIdToken } from "./firebase";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  // Get headers
  const headers = new Headers(fetchOptions.headers || {});
  headers.set("Content-Type", "application/json");

  // Add authorization token if required
  if (requiresAuth) {
    const token = await getIdToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Make request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  // Return JSON response
  return await response.json();
}

/**
 * Make a GET request
 */
export async function get<T = any>(url: string, requiresAuth = false): Promise<T> {
  return apiRequest<T>(url, { method: "GET", requiresAuth });
}

/**
 * Make a POST request
 */
export async function post<T = any>(
  url: string,
  data: any,
  requiresAuth = true
): Promise<T> {
  return apiRequest<T>(url, {
    method: "POST",
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * Make a PATCH request
 */
export async function patch<T = any>(
  url: string,
  data: any,
  requiresAuth = true
): Promise<T> {
  return apiRequest<T>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * Make a DELETE request
 */
export async function del<T = any>(url: string, requiresAuth = true): Promise<T> {
  return apiRequest<T>(url, { method: "DELETE", requiresAuth });
}
