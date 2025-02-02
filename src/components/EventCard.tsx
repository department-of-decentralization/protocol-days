import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { Event } from "./Schedule";
import { EVENT_TYPE_COLORS } from "@/constants/eventTypes";
import { FaDiscord, FaTelegram, FaLink, FaMapMarkerAlt } from "react-icons/fa";
import { SiMatrix, SiSignal } from "react-icons/si";
import { BsChatDots } from "react-icons/bs";
import { LuCalendarPlus } from "react-icons/lu";

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
  const getChatIcon = () => {
    switch (event.chatPlatform) {
      case "Discord":
        return <FaDiscord className="w-4 h-4" />;
      case "Telegram":
        return <FaTelegram className="w-4 h-4" />;
      case "Matrix":
        return <SiMatrix className="w-4 h-4" />;
      case "Signal":
        return <SiSignal className="w-4 h-4" />;
      default:
        return <BsChatDots className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Logo Section */}
        {event.logo?.[0]?.url && (
          <div className="flex justify-center sm:justify-start">
            <img src={event.logo[0].url} alt="" className="w-24 h-24 sm:w-16 sm:h-16 object-contain rounded" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-xl font-bold text-white group">
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  {event.eventName}
                </a>
                {event.totalDays && event.totalDays > 1 && (
                  <span className="ml-2 text-sm text-gray-400">
                    Day {event.dayIndex}/{event.totalDays}
                  </span>
                )}
              </h3>
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
            <div className="flex flex-col items-start sm:items-end shrink-0">
              <div className="text-lg text-gray-400">
                {event.startTime} - {event.endTime}
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
                <FaMapMarkerAlt className="w-4 h-4 mr-1 shrink-0" />
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
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors"
              >
                <FaLink className="w-4 h-4" />
                Event Link
              </a>
            </div>
            <div className="flex flex-row items-start gap-2 -mb-3">
              {event.chatLink && (
                <a
                  href={event.chatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
                >
                  {getChatIcon()}
                  Join {event.chatPlatform || "Chat"}
                </a>
              )}
              <div className="flex flex-col items-center">
                <a
                  href={generateGoogleCalendarLink(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
                >
                  <LuCalendarPlus className="w-4 h-4" />
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
    </div>
  );
};

export default EventCard;
