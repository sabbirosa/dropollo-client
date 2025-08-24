import { role } from "@/constant/role";

// Main navigation links array to be used in both desktop and mobile menus
export const navigationLinks = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/services", label: "Services", role: "PUBLIC" },
  { href: "/pricing", label: "Pricing", role: "PUBLIC" },
  { href: "/track", label: "Track Parcel", role: "PUBLIC" },
  { href: "/contact", label: "Contact", role: "PUBLIC" },
  { href: "/admin", label: "Admin Dashboard", role: role.ADMIN },
  { href: "/sender", label: "Sender Dashboard", role: role.SENDER },
  { href: "/receiver", label: "Receiver Dashboard", role: role.RECEIVER },
];

// Additional quick action items for authenticated users
export const quickActions = [
  { href: "/sender/my-parcels", label: "Send Parcel", role: role.SENDER },
  {
    href: "/receiver/incoming-parcels",
    label: "Confirm Delivery",
    role: role.RECEIVER,
  },
  {
    href: "/admin/analytics",
    label: "View Analytics",
    role: role.ADMIN,
  },
];

// Public footer navigation items
export const footerNavItems = {
  services: [
    { href: "/parcel-delivery", label: "Parcel Delivery" },
    { href: "/express-shipping", label: "Express Shipping" },
    { href: "/international", label: "International Delivery" },
    { href: "/bulk-shipping", label: "Bulk Shipping" },
    { href: "/tracking", label: "Real-time Tracking" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press Release" },
    { href: "/blog", label: "Blog" },
    { href: "/partnerships", label: "Partnerships" },
  ],
  support: [
    { href: "/contact", label: "Contact Support" },
    { href: "/faq", label: "FAQ" },
    { href: "/help", label: "Help Center" },
    { href: "/live-chat", label: "Live Chat" },
    { href: "/shipping-guide", label: "Shipping Guide" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

// Social media links
export const socialMediaLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/dropollo",
    icon: "facebook",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/dropollo",
    icon: "twitter",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/dropollo",
    icon: "instagram",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/dropollo",
    icon: "linkedin",
  },
  {
    name: "GitHub",
    href: "https://github.com/dropollo",
    icon: "github",
  },
];
