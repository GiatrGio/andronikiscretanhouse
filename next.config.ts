import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old WordPress date-based blog posts → recipes page
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*", destination: "/recipes", permanent: true },

      // Old WordPress category pages
      { source: "/category/:path*", destination: "/recipes", permanent: true },

      // Old WordPress tag pages
      { source: "/tag/:path*", destination: "/recipes", permanent: true },

      // Old WordPress author pages
      { source: "/author/:path*", destination: "/", permanent: true },

      // Old WordPress static pages → matching new pages
      { source: "/our-recipes", destination: "/recipes", permanent: true },
      { source: "/our-recipes/", destination: "/recipes", permanent: true },
      { source: "/our-review", destination: "/reviews", permanent: true },
      { source: "/our-review/", destination: "/reviews", permanent: true },
      { source: "/photo-gallery", destination: "/gallery", permanent: true },
      { source: "/photo-gallery/", destination: "/gallery", permanent: true },
      { source: "/cretan-cooking-lessons", destination: "/courses", permanent: true },
      { source: "/cretan-cooking-lessons/:path*", destination: "/courses", permanent: true },

      // Old Greek-language slug pages
      { source: "/%CE%B3%CE%B5%CF%8D%CF%83%CE%B5%CE%B9%CF%82/:path*", destination: "/recipes", permanent: true }, // /γεύσεις/*
      { source: "/%CE%B3%CE%B5%CF%8D%CF%83%CE%B5%CE%B9%CF%82", destination: "/recipes", permanent: true }, // /γεύσεις
      { source: "/%CE%B5%CF%80%CE%B9%CE%BA%CE%BF%CE%B9%CE%BD%CF%89%CE%BD%CE%AF%CE%B1-contact-us", destination: "/contact", permanent: true }, // /επικοινωνία-contact-us
      { source: "/%CE%B5%CF%80%CE%B9%CE%BA%CE%BF%CE%B9%CE%BD%CF%89%CE%BD%CE%AF%CE%B1-contact-us/", destination: "/contact", permanent: true },
      { source: "/%CF%84%CE%B1-%CF%80%CF%81%CE%BF%CF%8A%CF%8C%CE%BD%CF%84%CE%B1-%CE%BC%CE%B1%CF%82", destination: "/", permanent: true }, // /τα-προϊόντα-μας
      { source: "/%CF%84%CE%B1-%CF%80%CF%81%CE%BF%CF%8A%CF%8C%CE%BD%CF%84%CE%B1-%CE%BC%CE%B1%CF%82/", destination: "/", permanent: true },
      { source: "/%CF%86%CF%84%CE%B9%CE%AC%CF%87%CE%BD%CE%BF%CF%85%CE%BC%CE%B5-%CE%BC%CE%B1%CE%B6%CE%AF-%CF%84%CE%BF-%CF%86%CE%B1%CE%B3%CE%B7%CF%84%CF%8C-%CE%BC%CE%B1%CF%82", destination: "/courses", permanent: true }, // /φτιάχνουμε-μαζί-το-φαγητό-μας

      // WordPress feed URLs
      { source: "/feed", destination: "/", permanent: true },
      { source: "/feed/:path*", destination: "/", permanent: true },
      { source: "/comments/feed/:path*", destination: "/", permanent: true },

      // WordPress infrastructure
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-login.php", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
    ];
  },
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
