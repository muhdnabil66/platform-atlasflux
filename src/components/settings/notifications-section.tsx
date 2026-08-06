"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NOTIFICATIONS = [
  {
    id: "low-balance",
    title: "Low balance",
    description: "Notify me when my balance drops below RM5.",
    default: true,
  },
  {
    id: "payment-successful",
    title: "Payment successful",
    description: "Confirm top-ups and successful payments.",
    default: true,
  },
  {
    id: "api-key-created",
    title: "API key created",
    description: "Alert me whenever a new API key is created.",
    default: false,
  },
  {
    id: "spend-limit",
    title: "Spend limit reached",
    description: "Notify me when monthly spend crosses the limit.",
    default: true,
  },
];

export function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.default])),
  );

  const toggle = (id: string) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(
        next[id] ? "Notification enabled (mock)" : "Notification disabled (mock)",
      );
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
