import { FC } from "react";
import { EventType } from "./Schedule";
import EventCard from "@/components/EventCard";
import { BerlinDate } from "@/utils/BerlinDate";

interface EventsViewProps {
  events: EventType[];
}

const EventsView: FC<EventsViewProps> = ({ events }) => {
  // Format events with date information without sorting
  // console.log("All events:", events);
  const formattedEvents = events.map((event) => {
    const startDate = new BerlinDate(event.startDate);

    return {
      ...event,
      currentDate: startDate.toISOString(),
    };
  });

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {formattedEvents.map((event, index) => (
          <div key={`${event.eventName}-${index}`} className="h-full">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsView;
