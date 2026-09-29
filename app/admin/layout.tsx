import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Artist Dashboard",
    template: "%s | Artist Dashboard",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
