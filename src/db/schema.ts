import { type User, type NewUser } from '../libs/auth/schema';

// We'll use BetterAuth's user schema instead of defining a separate one
// Export types referencing BetterAuth's user schema
export type { User, NewUser };
