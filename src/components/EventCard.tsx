import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { Event } from "./Schedule";
import { EVENT_TYPE_COLORS } from "@/constants/eventTypes";

interface EventCardProps {
  event: Event & {
    dayIndex?: number;
    totalDays?: number;
    startTime: string;
    endTime: string;
    currentDate: string;
  };
}

const getBadgeColor = (eventType: Event["eventTypes"][number]) => {
  const colors = EVENT_TYPE_COLORS[eventType];
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

const generateGoogleCalendarLink = (event: EventCardProps["event"]) => {
  const dateStr = event.currentDate.split("T")[0];
  const startDateTime = `${dateStr}T${event.startTime}:00`;
  const endDateTime = `${dateStr}T${event.endTime}:00`;

  const details = [
    event.description,
    event.venue ? `Venue: ${event.venue}` : "",
    event.venueAddress ? `Address: ${event.venueAddress}` : "",
    event.venueLink ? `Venue Link: ${event.venueLink}` : "",
    `Event Type: ${event.eventTypes.join(", ")}`,
    event.organizer ? `Organizer: ${event.organizer}` : "",
  ]
    .filter(Boolean)
    .join("\\n\\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text:
      event.eventName + (event.totalDays && event.totalDays > 1 ? ` (Day ${event.dayIndex}/${event.totalDays})` : ""),
    details,
    location: event.venueAddress || event.venue || "",
    dates: `${startDateTime}/${endDateTime}`.replace(/[-:]/g, ""),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Logo Section */}
        {event.logo?.[0]?.url && (
          <div className="flex justify-center sm:justify-start">
            <img src={event.logo[0].url} alt="" className="w-16 h-16 object-contain rounded" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div>
              <h3 className="text-xl font-bold text-white group">
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  {event.eventName}
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                {event.totalDays && event.totalDays > 1 && (
                  <div className="text-sm text-gray-400">
                    Day {event.dayIndex}/{event.totalDays}
                  </div>
                )}
              </h3>
            </div>
            <div className="flex flex-col items-start sm:items-end shrink-0">
              <div className="text-lg text-gray-400">
                {event.startTime} - {event.endTime}
              </div>
              <div className="mt-1 flex flex-wrap gap-1 sm:justify-end">
                {event.eventTypes.map((type) => (
                  <span
                    key={type}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(
                      type
                    )}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-2 text-gray-400 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{event.description}</ReactMarkdown>
          </div>
          <div className="mt-4">
            {event.venue && (
              <div className="flex items-center text-gray-500">
                <svg
                  className="w-4 h-4 mr-1 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.venueLink ? (
                  <a
                    href={event.venueLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors truncate"
                  >
                    {event.venue}
                  </a>
                ) : (
                  <span className="truncate">{event.venue}</span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <a
              href={event.eventLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Event Website
            </a>
            <div className="flex flex-col items-center">
              <a
                href={generateGoogleCalendarLink(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Add to Calendar
              </a>
              {event.totalDays && event.totalDays > 1 && (
                <div className="text-[0.6rem] text-gray-500 text-center sm:text-right">
                  You need to add each day separately
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
