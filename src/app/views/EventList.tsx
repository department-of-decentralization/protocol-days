import { FC } from "react";
import { Event } from "./Schedule";
import EventCard from "@/components/EventCard";

interface EventListProps {
  events: Event[];
}

const EventList: FC<EventListProps> = ({ events }) => {
  // Format events with date information without sorting
  console.log("All events:", events);
  console.log(
    "Events:",
    events.map((event) => ({ name: event.eventName, submissionTime: event.submissionTime }))
  );
  const formattedEvents = events.map((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Format date range
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    // Calculate if it's a multi-day event
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const isMultiDay = days > 1;

    // Get the first day's schedule for display
    const firstDaySchedule = event.dailySchedule[0];

    return {
      ...event,
      currentDate: startDate.toISOString(),
      startTime: firstDaySchedule?.startTime || "09:00",
      endTime: firstDaySchedule?.endTime || "17:00",
      // For multi-day events, we'll show a date range
      dateDisplay: isMultiDay ? `${formatDate(startDate)} - ${formatDate(endDate)}` : formatDate(startDate),
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid gap-6">
        {formattedEvents.map((event, index) => (
          <div key={`${event.eventName}-${index}`} className="relative">
            <EventCard event={event} listView={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
