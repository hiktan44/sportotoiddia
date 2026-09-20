import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/dashboard/"] }], sitemap: "https://sportoto.seymata.com/sitemap.xml", host: "https://sportoto.seymata.com" }; }
