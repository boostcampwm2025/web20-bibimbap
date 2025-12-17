import type { EventType } from '../types';

interface EventBasicInfoProps {
  eventTypes: EventType[];
  selectedEventTypeId: number | null;
  onEventTypeChange: (id: number) => void;
}

export const EventBasicInfo = ({ eventTypes, selectedEventTypeId, onEventTypeChange }: EventBasicInfoProps) => {
  return (
    <section className="bg-white rounded-xl p-8 mb-6 shadow-sm">
      <h2 className="text-lg font-bold mb-6 text-gray-900">이벤트 기본 정보</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">이벤트 제목</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
          placeholder="이벤트 제목을 입력하세요" 
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">이벤트 설명</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-[120px] resize-y" 
          placeholder="이벤트 설명을 입력하세요"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">트랙</label>
        <div className="relative">
          <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none bg-white">
            <option value="">웹</option>
            <option value="android">안드로이드</option>
            <option value="ios">iOS</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">이벤트 종류</label>
        <div className="relative">
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none bg-white"
            value={selectedEventTypeId || ''}
            onChange={(e) => onEventTypeChange(Number(e.target.value))}
          >
            <option value="" disabled>이벤트 종류를 선택하세요</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.displayName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        <div className="flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">예약 시작 일시</label>
            <div className="relative">
                <input 
                type="datetime-local" 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">예약 종료 일시</label>
             <div className="relative">
                <input 
                type="datetime-local" 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                />
             </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">예약 단위</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="radio" name="unit" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
            <span className="text-gray-700">개인</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="radio" name="unit" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <span className="text-gray-700">팀</span>
          </label>
        </div>
      </div>
    </section>
  );
};
