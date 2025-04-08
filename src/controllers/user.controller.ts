import Elysia from "elysia";
import {db} from "@/src/db";
import {users, PLANS} from "@/src/shema";
import {eq} from "drizzle-orm";
import {CreateUserRequest, UpdateUserRequest} from "@/src/types";

const isValidPlan = (plan: string): boolean => {
    return Object.values(PLANS).includes(plan);
}

export const userController = new Elysia()
    // Get all users
    .get('/', async ({auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {
                error: 'Unauthorized',
            }
        }
        try {
            const allUsers = db.select().from(users).all();
            return allUsers;
        } catch (error) {
            set.status = 500;
            return {
                error: 'Failed to fetch users',
            }
        }
    })

    // Get current authenticated user
    .get('/me', async ({auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {
                error: 'Unauthorized',
            }
        }
        try {
            const user = db.select().from(users)
                .where(eq(users.authId, auth.session.user.id))
                .get();

            if (!user) {
                set.status = 404;
                return {error: 'User not found'};
            }

            return user;
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to fetch user'};
        }
    })

    // Get user by ID
    .get('/:id', async ({params: {id}, auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {error: 'Unauthorized'};
        }

        try {
            const user = db.select().from(users)
                .where(eq(users.id, parseInt(id)))
                .get();

            if (!user) {
                set.status = 404;
                return {error: 'User not found'};
            }

            // Check if the requesting user is the same as the requested user
            // In a real app, you'd also check for admin role
            if (user.authId !== auth.session.user.id) {
                set.status = 403;
                return {error: 'Forbidden'};
            }

            return user;
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to fetch user'};
        }
    })

    // Create a new user
    .post('/', async ({body, auth, set}) => {
        try {
            const {name, surname, email, country, city, phone} = body as CreateUserRequest;

            // Validate required fields
            if (!name || !email) {
                set.status = 400;
                return {error: 'Name and email are required'};
            }

            // Check if user with this email already exists
            const existingUser = db.select().from(users)
                .where(eq(users.email, email))
                .get();

            if (existingUser) {
                set.status = 409; // Conflict
                return {error: 'User with this email already exists'};
            }

            // Create user - in a real app, you'd handle auth registration here too
            const newUser = db.insert(users).values({
                authId: `manual-${Date.now()}`, // Placeholder for manual creation
                name,
                surname: surname || null,
                email,
                country: country || null,
                city: city || null,
                phone: phone || null,
                plan: PLANS.FREE,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning().get();

            return {message: 'User created successfully', user: newUser};
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to create user'};
        }
    })

    // Update user (self or admin)
    .put('/:id', async ({params: {id}, body, auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {error: 'Unauthorized'};
        }

        try {
            const userId = parseInt(id);
            const {name, surname, country, city, phone, isActive} = body as UpdateUserRequest;

            // Check if user exists
            const existingUser = await db.select().from(users)
                .where(eq(users.id, userId))
                .get();

            if (!existingUser) {
                set.status = 404;
                return {error: 'User not found'};
            }

            // Check if the requesting user is the same as the user being updated
            // In a real app, you'd also check for admin role
            if (existingUser.authId !== auth.session.user.id) {
                set.status = 403;
                return {error: 'Forbidden'};
            }

            // Update user
            const updatedUser = db.update(users)
                .set({
                    name: name || existingUser.name,
                    surname: surname !== undefined ? surname : existingUser.surname,
                    country: country !== undefined ? country : existingUser.country,
                    city: city !== undefined ? city : existingUser.city,
                    phone: phone !== undefined ? phone : existingUser.phone,
                    isActive: isActive !== undefined ? isActive : existingUser.isActive,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning()
                .get();

            return {message: 'User updated successfully', user: updatedUser};
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to update user'};
        }
    })

    // Update user plan (self or admin)
    .put('/:id/plan', async ({params: {id}, body, auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {error: 'Unauthorized'};
        }

        try {
            const userId = parseInt(id);
            const {plan, duration} = body as UpdateUserPlanRequest;

            // Validate plan
            if (!isValidPlan(plan)) {
                set.status = 400;
                return {error: `Invalid plan. Valid options are: ${Object.values(PLANS).join(', ')}`};
            }

            // Check if user exists
            const existingUser = await db.select().from(users)
                .where(eq(users.id, userId))
                .get();

            if (!existingUser) {
                set.status = 404;
                return {error: 'User not found'};
            }

            // Check if the requesting user is the same as the user being updated
            // In a real app, you'd also check for admin role
            if (existingUser.authId !== auth.session.user.id) {
                set.status = 403;
                return {error: 'Forbidden'};
            }

            const now = new Date();
            const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

            // Update user plan
            const updatedUser = db.update(users)
                .set({
                    plan,
                    planActivatedAt: now,
                    planExpiresAt: expiresAt,
                    updatedAt: now,
                })
                .where(eq(users.id, userId))
                .returning()
                .get();

            return {
                message: 'User plan updated successfully',
                user: updatedUser,
                planDetails: {
                    plan,
                    activatedAt: now,
                    expiresAt: expiresAt,
                    durationDays: duration
                }
            };
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to update user plan'};
        }
    })

    // Delete user (self or admin)
    .delete('/:id', async ({params: {id}, auth, set}) => {
        if (!auth.session) {
            set.status = 401;
            return {error: 'Unauthorized'};
        }

        try {
            const userId = parseInt(id);

            // Check if user exists
            const existingUser = db.select().from(users)
                .where(eq(users.id, userId))
                .get();

            if (!existingUser) {
                set.status = 404;
                return {error: 'User not found'};
            }

            // Check if the requesting user is the same as the user being deleted
            // In a real app, you'd also check for admin role
            if (existingUser.authId !== auth.session.user.id) {
                set.status = 403;
                return {error: 'Forbidden'};
            }

            // Delete user
            db.delete(users)
                .where(eq(users.id, userId))
                .run();

            return {message: 'User deleted successfully'};
        } catch (error) {
            set.status = 500;
            return {error: 'Failed to delete user'};
        }
    });