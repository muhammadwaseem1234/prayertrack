import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/today(.*)', '/history(.*)', '/analytics(.*)', '/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
    if (isAdminRoute(req)) {
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
        if (role !== 'admin') {
            return Response.redirect(new URL('/dashboard', req.url));
        }
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
