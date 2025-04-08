// User types
export interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
}

// Extended user data
export interface UserData {
    id: number;
    authId: string;
    email: string;
    name: string;
    surname: string | null;
    country: string | null;
    city: string | null;
    phone: string | null;
    plan: string;
    planActivatedAt: Date | null;
    planExpiresAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// User creation request
export interface CreateUserRequest {
    name: string;
    surname?: string;
    email: string;
    country?: string;
    city?: string;
    phone?: string;
}

// User update request
export interface UpdateUserRequest {
    name?: string;
    surname?: string;
    country?: string;
    city?: string;
    phone?: string;
    plan?: string;
    isActive?: boolean;
}

// User plan update request
export interface UpdateUserPlanRequest {
    plan: string;
    duration: number; // duration in days
}

// Session data
export interface SessionData {
    user: UserProfile;
}