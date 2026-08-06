import { Settings, User, Bell, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSection } from "@/components/settings/profile-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { SecuritySection } from "@/components/settings/security-section";

const SECTIONS = [
  { icon: User, title: "Profile", id: "profile" },
  { icon: SlidersHorizontal, title: "Developer preferences", id: "preferences" },
  { icon: Bell, title: "Notifications", id: "notifications" },
  { icon: ShieldCheck, title: "Security", id: "security" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, developer preferences and security."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-20 lg:w-56 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-lg border bg-card p-1 lg:flex-col">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <section.icon className="size-4" aria-hidden="true" />
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Card id="profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="size-4 text-muted-foreground" aria-hidden="true" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSection />
            </CardContent>
          </Card>

          <Card id="preferences">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
                Developer preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PreferencesSection />
            </CardContent>
          </Card>

          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-muted-foreground" aria-hidden="true" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationsSection />
            </CardContent>
          </Card>

          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySection />
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Settings className="size-3.5" aria-hidden="true" />
        Settings are managed through your AtlasFlux account.
      </p>
    </div>
  );
}
