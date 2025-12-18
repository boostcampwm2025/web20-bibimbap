import { useEffect, useState } from 'react';
import { EventBasicInfo } from './EventBasicInfo';
import { OptionManagement } from './OptionManagement';
import { fetchEventTypesExpanded } from '../api';
import type { EventType, EventTemplate } from '../types';

export const CreateEventPage = () => {
  const [eventTypes, setEventTypes] = useState<
    (EventType & { template?: EventTemplate })[]
  >([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadEventTypes = async () => {
      try {
        const types = await fetchEventTypesExpanded();
        setEventTypes(types);
        if (types.length > 0) {
          // Default to first option or let user choose
        }
      } catch (error) {
        console.error('Failed to load event types:', error);
      }
    };
    loadEventTypes();
  }, []);

  const selectedType = eventTypes.find((t) => t.id === selectedEventTypeId);
  const currentTemplate = selectedType?.template;

  return (
    <div className="w-full mx-auto px-6 py-10 min-h-screen bg-secondary font-sans text-gray-900">
      <EventBasicInfo
        eventTypes={eventTypes}
        selectedEventTypeId={selectedEventTypeId}
        onEventTypeChange={setSelectedEventTypeId}
      />

      {currentTemplate && (
        <OptionManagement
          template={currentTemplate}
          eventTypeName={selectedType?.key}
        />
      )}

      <div className="flex justify-end mt-8">
        <button className="px-6 py-3 bg-primary text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          이벤트 생성
        </button>
      </div>
    </div>
  );
};
