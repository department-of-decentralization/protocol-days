import { FC } from "react";
import { EventType } from "./Schedule";
import Event from "@/components/Event";

interface EventsViewProps {
  events: EventType[];
}

const EventsView: FC<EventsViewProps> = ({ events }) => {
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
      <div className="grid gap-6  ">
        {formattedEvents.map((event, index) => (
          <div key={`${event.eventName}-${index}`} className="relative">
            <Event event={event} listView={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsView;
