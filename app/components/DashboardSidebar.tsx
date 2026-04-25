"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { BrandIcon } from "@/app/components/BrandIcon";
import { ChannelSwitcher } from "./ChannelSwitcher";
import {
  LayoutGrid,
  Clock,
  CheckCircle,
  Users,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  counts?: {
    projects?: number;
    pending?: number;
    published?: number;
    editors?: number;
  };
}

const navSections = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "All Projects", icon: LayoutGrid, countKey: "projects" },
      { href: "/dashboard/pending", label: "Pending Review", icon: Clock, countKey: "pending" },
      { href: "/dashboard/published", label: "Published", icon: CheckCircle, countKey: "published" },
    ],
  },
  {
    label: "Team",
    items: [
      { href: "/dashboard/team", label: "Editors", icon: Users, countKey: "editors" },
      { href: "/dashboard/audit", label: "Audit Log", icon: Activity },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function DashboardSidebar({ counts = {} }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="dash-sidebar">
      {/* Logo */}
      <Link href="/" className="dash-logo-link">
        <div className="dash-logo">
          <div className="dash-logo-mark">
            <BrandIcon size={12} color="white" />
          </div>
          <span className="dash-logo-name">ClipFlow</span>
        </div>
      </Link>

      <ChannelSwitcher />

      {/* Nav sections */}
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="dash-section-label">{section.label}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const count = item.countKey ? counts[item.countKey as keyof typeof counts] : undefined;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item${isActive ? " active" : ""}`}
              >
                <span className="dash-nav-left">
                  <Icon size={13} strokeWidth={2} />
                  {item.label}
                </span>
                {count !== undefined && count > 0 && (
                  <span className="dash-count">{count}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* User footer */}
      <div className="dash-user">
        <div className="dash-user-avatar">
          {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dash-user-name">
            {user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "Creator"}
          </div>
          <div className="dash-user-role">Creator</div>
        </div>
      </div>
    </aside>
  );
}
