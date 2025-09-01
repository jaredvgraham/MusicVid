import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/privacy-policy",
  "/terms-of-service",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  // Marketing/SEO pages
  "/lyric-video-maker",
  "/add-lyrics-to-video",
  "/ai-caption-generator",
  "/tiktok-captions",
  "/youtube-captions",
  "/templates(.*)",
  "/blog(.*)",
  // Feeds & SEO files
  "/sitemap.xml",
  "/sitemap-0.xml",
  "/sitemap-1.xml",
  "/sitemap(.*)",
  "/robots.txt",
  "/rss.xml",
  // Public APIs used by crawlers/og
  "/api/og",
  // Webhooks and public APIs
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/api/transcribe",
  "/logo-black.png",
  "/logo.png",
  "/watermark.png",
  "/watermark2.png",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url).toString();
    await auth.protect({ unauthenticatedUrl: signInUrl });
  }
});

export const config = {
  matcher: [
    // 1) Skip Next internals & static files, INCLUDING .xml now
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml)).*)",
    // 2) Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
