import { FC } from "react";

export interface Event {
  eventName: string;
  startDate: string;
  endDate: string;
  organizer: string;
  description: string;
  eventTypes: ("Conference" | "Hackathon" | "Meetup" | "Party" | "Coworking" | "Happy Hour" | "Other")[];
  venue: string;
  venueAddress: string;
  venueLink?: string;
  eventLink: string;
  logo: { url: string; filename: string }[] | null;
  dailySchedule: {
    startTime: string | null;
    endTime: string | null;
  }[];
}

export interface ProcessedEvent extends Omit<Event, "startDate" | "endDate"> {
  startDate: Date;
  endDate: Date;
  dayIndex: number;
  totalDays: number;
  currentDate: string;
  startTime: string;
  endTime: string;
  column?: number;
}

interface ScheduleProps {
  events: Event[];
}

const START_DATE = new Date("2025-06-08");
const END_DATE = new Date("2025-06-22");
const MINUTES_PER_CHUNK = 15;
const CHUNK_HEIGHT = 10; // height in pixels for each 15-min chunk
const MINUTES_PER_DAY = 24 * 60;
const CHUNKS_PER_DAY = MINUTES_PER_DAY / MINUTES_PER_CHUNK;
const TOTAL_DAYS = Math.ceil((END_DATE.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1;
const TIMELINE_HEIGHT = TOTAL_DAYS * CHUNKS_PER_DAY * CHUNK_HEIGHT;
const EVENT_WIDTH = 150; // pixels
const EVENT_GAP = 8; // pixels between overlapping events

// Function to generate a unique color for each event
const getEventColor = (eventName: string) => {
  const colors = [
    "bg-blue-500/30",
    "bg-green-500/30",
    "bg-purple-500/30",
    "bg-yellow-500/30",
    "bg-pink-500/30",
    "bg-indigo-500/30",
    "bg-red-500/30",
    "bg-orange-500/30",
    "bg-teal-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < eventName.length; i++) {
    hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Schedule: FC<ScheduleProps> = ({ events }) => {
  // Split multi-day events into separate day events
  const splitEvents = events.flatMap((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: days }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + index);

      // Get the start and end times for this day from dailySchedule
      const daySchedule = event.dailySchedule[index];

      return {
        ...event,
        dayIndex: index + 1,
        totalDays: days,
        currentDate: currentDate.toISOString(),
        startTime: daySchedule?.startTime || "09:00", // Default to 9 AM if not specified
        endTime: daySchedule?.endTime || "17:00", // Default to 5 PM if not specified
      };
    });
  });

  // Function to check if two events overlap
  const eventsOverlap = (a: ProcessedEvent, b: ProcessedEvent) => {
    if (a.currentDate !== b.currentDate) return false;

    const aStart = new Date(`${a.currentDate.split("T")[0]}T${a.startTime}`);
    const aEnd = new Date(`${a.currentDate.split("T")[0]}T${a.endTime}`);
    const bStart = new Date(`${b.currentDate.split("T")[0]}T${b.startTime}`);
    const bEnd = new Date(`${b.currentDate.split("T")[0]}T${b.endTime}`);

    return aStart < bEnd && aEnd > bStart;
  };

  // Convert to ProcessedEvent
  const processedEvents: ProcessedEvent[] = splitEvents.map((event) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
  })) as ProcessedEvent[];

  // Sort events by start time
  processedEvents.sort((a, b) => {
    const dateCompare = new Date(a.currentDate).getTime() - new Date(b.currentDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Assign columns to events
  processedEvents.forEach((event) => {
    const overlappingEvents = processedEvents.filter((e) => eventsOverlap(e, event));
    const usedColumns = overlappingEvents.filter((e) => e.column !== undefined).map((e) => e.column);

    // Find the first available column
    let column = 0;
    while (usedColumns.includes(column)) {
      column++;
    }
    event.column = column;
  });

  const getTimeChunks = () => {
    const chunks = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += MINUTES_PER_CHUNK) {
        chunks.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      }
    }
    return chunks;
  };

  const timeChunks = getTimeChunks();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <div className="flex min-w-[800px]">
          {/* Date and time labels */}
          <div className="w-12 flex-shrink-0 pr-4 bg-black">
            {Array.from({ length: TOTAL_DAYS }).map((_, dayIndex) => {
              return (
                <div key={dayIndex} style={{ height: `${CHUNKS_PER_DAY * CHUNK_HEIGHT}px` }} className="relative" />
              );
            })}
          </div>

          {/* Timeline */}
          <div className="flex-grow relative border-l border-gray-800" style={{ height: `${TIMELINE_HEIGHT}px` }}>
            {/* Time chunk dividers */}
            {Array.from({ length: TOTAL_DAYS * CHUNKS_PER_DAY }).map((_, index) => (
              <div
                key={index}
                className="absolute w-full border-b border-gray-500"
                style={{
                  top: `${index * CHUNK_HEIGHT}px`,
                  borderBottomStyle: index % 4 === 0 ? "solid" : "dotted",
                  opacity: index % 4 === 0 ? 0.3 : 0.2,
                }}
              />
            ))}

            {/* Left Hour labels */}
            <div className="absolute -left-12 top-0 bottom-0">
              {Array.from({ length: TOTAL_DAYS }).map((_, dayIndex) =>
                Array.from({ length: 24 }).map((_, hour) => {
                  const date = new Date(START_DATE);
                  date.setDate(date.getDate() + dayIndex);

                  // Skip rendering 23:00 and 01:00
                  if (hour === 23 || hour === 1) return null;

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="absolute text-xs text-gray-500"
                      style={{
                        top: `${(dayIndex * CHUNKS_PER_DAY + hour * 4) * CHUNK_HEIGHT}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      {hour === 0 ? (
                        <span className="flex flex-col items-end text-right">
                          <span className="text-gray-400 text-sm">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="font-bold text-white text-xl -mt-1">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </span>
                      ) : (
                        `${hour.toString().padStart(2, "0")}:00`
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Hour labels */}
            <div className="absolute -right-12 top-0 bottom-0">
              {Array.from({ length: TOTAL_DAYS }).map((_, dayIndex) =>
                Array.from({ length: 24 }).map((_, hour) => {
                  const date = new Date(START_DATE);
                  date.setDate(date.getDate() + dayIndex);

                  // Skip rendering 23:00 and 01:00
                  if (hour === 23 || hour === 1) return null;

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="absolute text-xs text-gray-500"
                      style={{
                        top: `${(dayIndex * CHUNKS_PER_DAY + hour * 4) * CHUNK_HEIGHT}px`,
                        transform: "translateY(-50%)",
                      }}
                    >
                      {hour === 0 ? (
                        <span className="flex flex-col items-start text-left">
                          <span className="text-gray-400 text-sm">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="font-bold text-white text-xl -mt-1">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </span>
                      ) : (
                        `${hour.toString().padStart(2, "0")}:00`
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Events */}
            {processedEvents.map((event, index) => {
              const eventDate = new Date(event.currentDate);
              const daysSinceStart = Math.floor((eventDate.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
              const topPosition = daysSinceStart * CHUNKS_PER_DAY * CHUNK_HEIGHT;

              // Calculate position based on time
              const [hours, minutes] = event.startTime.split(":").map(Number);
              const [endHours, endMinutes] = event.endTime.split(":").map(Number);

              const minutesSinceMidnight = hours * 60 + minutes;
              const endMinutesSinceMidnight = endHours * 60 + endMinutes;
              const durationInMinutes = endMinutesSinceMidnight - minutesSinceMidnight;

              const chunkOffset = Math.floor(minutesSinceMidnight / MINUTES_PER_CHUNK) * CHUNK_HEIGHT;
              const eventHeight = Math.floor(durationInMinutes / MINUTES_PER_CHUNK) * CHUNK_HEIGHT;

              return (
                <div
                  key={`${event.eventName}-${index}`}
                  className={`absolute p-2 rounded ${getEventColor(
                    event.eventName
                  )} border border-gray-700 flex items-center justify-center`}
                  style={{
                    top: `${topPosition + chunkOffset}px`,
                    left: `${8 + (event.column || 0) * (EVENT_WIDTH + EVENT_GAP)}px`,
                    width: `${EVENT_WIDTH}px`,
                    height: `${eventHeight}px`,
                  }}
                >
                  <div className="transform -rotate-90 whitespace-nowrap flex items-center gap-2">
                    {event.logo?.[0]?.url && (
                      <img src={event.logo[0].url} alt="" className="w-[40px] h-[40px] object-contain rounded" />
                    )}
                    <span className="text-sm font-medium">
                      <b className="text-base">{event.eventName}</b>
                      {event.totalDays > 1 && ` - (Day ${event.dayIndex}/${event.totalDays}) -`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
