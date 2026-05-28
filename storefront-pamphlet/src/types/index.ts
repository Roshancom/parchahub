/**
 * Centralized TypeScript Type Definitions
 * For the entire Pamphlet Marketing Web App
 */

// ==================== API MODELS ====================

/**
 * Pamphlet Model - Core data structure for promotional ads/pamphlets
 */
export interface Pamphlet {
  _id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  location: string;
  author_name: string;
  created_at: string;
  featured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

/**
 * Category Model - For organizing pamphlets by type
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * User Model - For authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

/**
 * Auth Response - From login/register endpoints
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * API Error Response
 */
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// ==================== HOOK TYPES ====================

/**
 * useFetch Hook Return Type - Generic hook for API calls
 */
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useAuth Hook Return Type
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// ==================== COMPONENT PROP TYPES ====================

/**
 * CategoryFilter Component Props
 */
export interface CategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  isLoading: boolean;
}

/**
 * PamphletCard Component Props
 */
export interface PamphletCardProps {
  pamphlet: Pamphlet;
  featured?: boolean;
}

/**
 * FeaturedPamphletCard Component Props
 */
export interface FeaturedPamphletCardProps {
  pamphlet: Pamphlet;
}

/**
 * LoadingSkeleton Component Props
 */
export interface LoadingSkeletonProps {
  count?: number;
}

/**
 * Button Component Props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * InputField Component Props
 */
export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

/**
 * SearchBar Component Props
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * FilterPanel Component Props
 */
export interface FilterPanelProps {
  filters: Record<string, string | number | boolean>;
  setFilters: (filters: Record<string, string | number | boolean>) => void;
}

/**
 * Navbar Component Props
 */
export interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

/**
 * Footer Component Props
 */
export interface FooterProps {
  className?: string;
}

// ==================== UTILITY TYPES ====================

/**
 * Category Icon Object returned from getCategoryIcon
 */
export interface CategoryIconData {
  icon: string;
  label: string;
  color: string;
}

/**
 * Query Parameters for API calls
 */
export interface QueryParams {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
  cursor?: string;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * API Response Wrapper
 */
export interface APIResponse<T> {
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

/**
 * Form State for Login/Register
 */
export interface FormState {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  errors: Record<string, string>;
  isLoading: boolean;
}

/**
 * Auth Context Value Type
 */
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// ==================== EVENT HANDLER TYPES ====================

/**
 * Common event handler types for reusability
 */
export type OnClickHandler = (
  event: React.MouseEvent<HTMLButtonElement>,
) => void;
export type OnChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void;
export type OnSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type OnSelectHandler = (value: string) => void;

// ==================== COMPONENT RENDER TYPES ====================

/**
 * Render props for conditional rendering
 */
export interface RenderProps<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Sidebar Filter State
 */
export interface SidebarFilters {
  category?: string;
  location?: string;
  priceRange?: [number, number];
  dateRange?: [Date, Date];
  sortBy?: "recent" | "trending" | "featured" | "popular";
}

// ==================== ROUTE TYPES ====================

/**
 * Route Parameter Types
 */
export interface PamphletDetailRouteParams {
  id: string;
}

export interface CategoryRouteParams {
  slug: string;
}

// ==================== API REQUEST TYPES ====================

/**
 * CreatePamphlet Request Payload
 */
export interface CreatePamphletPayload {
  title: string;
  content: string;
  category: string;
  location: string;
  image_url?: string;
}

/**
 * UpdatePamphlet Request Payload
 */
export interface UpdatePamphletPayload extends Partial<CreatePamphletPayload> {
  _id: string;
}

/**
 * Login Request Payload
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Register Request Payload
 */
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

// ==================== UTILITY FUNCTION TYPES ====================

/**
 * Format Relative Date Function
 */
export type FormatRelativeDateFn = (date: string | Date) => string;

/**
 * Get Category Icon Function
 */
export type GetCategoryIconFn = (category: string) => CategoryIconData;

/**
 * Truncate Text Function
 */
export type TruncateTextFn = (text: string, lines: number) => string;
