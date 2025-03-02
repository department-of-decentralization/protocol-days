import { FC } from "react";
import { Event } from "./Schedule";
import EventCard from "@/components/EventCard";

interface EventListProps {
  events: Event[];
}

const EventList: FC<EventListProps> = ({ events }) => {
  // Format events with date information without sorting
  console.log("All events:", events);
  const formattedEvents = events.map((event) => {
    const startDate = new Date(event.startDate);

    return {
      ...event,
      currentDate: startDate.toISOString(),
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid gap-6 mx-4 sm:mx-0">
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
