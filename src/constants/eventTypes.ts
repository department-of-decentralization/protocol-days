export const EVENT_TYPES = ["Conference", "Hackathon", "Meetup", "Party", "Coworking", "Happy Hour", "Other"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string; border: string }> = {
  Conference: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  Hackathon: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  Meetup: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    border: "border-green-500/30",
  },
  Party: {
    bg: "bg-pink-500/20",
    text: "text-pink-300",
    border: "border-pink-500/30",
  },
  Coworking: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    border: "border-yellow-500/30",
  },
  "Happy Hour": {
    bg: "bg-orange-500/20",
    text: "text-orange-300",
    border: "border-orange-500/30",
  },
  Other: {
    bg: "bg-gray-500/20",
    text: "text-gray-300",
    border: "border-gray-500/30",
  },
};
