"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings } from "@/lib/api-client";

const NOTIFICATIONS = [
  {
    id: "low_balance",
    title: "Low balance",
    description: "Notify me when my balance drops below RM5.",
    default: true,
  },
  {
    id: "payment_successful",
    title: "Payment successful",
    description: "Confirm top-ups and successful payments.",
    default: true,
  },
  {
    id: "api_key_created",
    title: "API key created",
    description: "Alert me whenever a new API key is created.",
    default: false,
  },
  {
    id: "spend_limit",
    title: "Spend limit reached",
    description: "Notify me when monthly spend crosses the limit.",
    default: true,
  },
];

export function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.default])),
  );

  useEffect(() => {
    getSettings().then((res) => {
      const notifs = (res.settings?.metadata as Record<string, unknown>)?.notifications as Record<string, boolean> | undefined;
      if (notifs) {
        setEnabled((prev) => ({ ...prev, ...notifs }));
      }
    }).catch(() => {});
  }, []);

  const toggle = async (id: string) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      updateSettings({ notifications: { [id]: next[id] } })
        .then(() => toast.success(next[id] ? "Notification enabled" : "Notification disabled"))
        .catch(() => toast.error("Failed to update notification setting"));
      return next;
    });
  };

  return (
    <ul className="flex flex-col gap-3">
      {NOTIFICATIONS.map((notification) => (
        <li
          key={notification.id}
          className="flex items-start justify-between gap-4 rounded-lg border bg-background p-4"
        >
          <div>
            <Label htmlFor={`notification-${notification.id}`} className="text-sm font-medium">
              {notification.title}
            </Label>
            <p className="text-xs text-muted-foreground">{notification.description}</p>
          </div>
          <Switch
            id={`notification-${notification.id}`}
            checked={enabled[notification.id]}
            onCheckedChange={() => toggle(notification.id)}
          />
        </li>
      ))}
    </ul>
  );
}
