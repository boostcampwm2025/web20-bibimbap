import { useMemo, useState } from "react";
import { PageHeader } from "./PageHeader";
import { ReservationLayout } from "./ReservationLayout";
import { SessionInfoCard } from "./SessionInfoCard";
import { SlotSection, SlotList } from "./SlotSection";
import { SlotCard } from "./SlotCard";
import { ReservationFooter } from "./ReservationFooter";

type SlotItem = {
  id: number;
  dateLabel: string;
  timeLabel: string;
  reviewer: string;
  rightLabel: string;
  status: "available" | "disabled" | "confirmed";
};

export default function ReservationPage() {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [reservedSlotId, setReservedSlotId] = useState<number | null>(null);

  const slots: SlotItem[] = useMemo(
    () => [
      {
        id: 1,
        dateLabel: "2024-12-20",
        timeLabel: "14:00 - 15:00",
        reviewer: "김멘토",
        rightLabel: "0/1",
        status: "available",
      },
      {
        id: 2,
        dateLabel: "2024-12-20",
        timeLabel: "15:00 - 16:00",
        reviewer: "이멘토",
        rightLabel: "마감",
        status: "disabled",
      },
      {
        id: 3,
        dateLabel: "2024-12-21",
        timeLabel: "14:00 - 15:00",
        reviewer: "박멘토",
        rightLabel: "0/1",
        status: "available",
      },
      {
        id: 4,
        dateLabel: "2024-12-21",
        timeLabel: "15:00 - 16:00",
        reviewer: "최멘토",
        rightLabel: "0/1",
        status: "available",
      },
      {
        id: 5,
        dateLabel: "2024-12-22",
        timeLabel: "14:00 - 15:00",
        reviewer: "강멘토",
        rightLabel: "0/1",
        status: "available",
      },
    ],
    []
  );

  const handleSlotClick = (slot: SlotItem) => {
    const isReserved = slot.id === reservedSlotId;
    if (slot.status === "disabled" || slot.status === "confirmed" || isReserved)
      return;
    setSelectedSlotId(slot.id);
  };

  const handleSubmit = () => {
    if (!selectedSlotId) return;
    setReservedSlotId(selectedSlotId);
    setSelectedSlotId(null);
  };

  return (
    <ReservationLayout>
      <PageHeader
        brandLabel="bookstcamp 10기 멤버십"
        actionLabel="로그인"
        onActionClick={() => {}}
      />

      <main className="mt-8 w-full max-w-5xl space-y-6">
        <SessionInfoCard
          title="시니어 리뷰어 피드백 1:1 세션"
          description="시니어 개발자에게 코드 리뷰 및 피드백을 받을 수 있는 시간입니다."
          metas={[
            { label: "예약 기간", value: "~" },
            { label: "예약 단위", value: "개인" },
          ]}
        />
        <SlotSection title="예약 선택지">
          <SlotList>
            {slots.map((slot) => {
              const isReserved = slot.id === reservedSlotId;
              const effectiveStatus = isReserved ? "confirmed" : slot.status;

              const variant =
                effectiveStatus === "disabled"
                  ? "disabled"
                  : effectiveStatus === "confirmed"
                  ? "confirmed"
                  : slot.id === selectedSlotId
                  ? "selected"
                  : "available";

              const handleClick =
                effectiveStatus === "disabled" ||
                effectiveStatus === "confirmed"
                  ? undefined
                  : () => handleSlotClick(slot);

              return (
                <SlotCard
                  key={slot.id}
                  {...slot}
                  variant={variant}
                  onClick={handleClick}
                />
              );
            })}
          </SlotList>
        </SlotSection>
        <ReservationFooter
          primaryLabel="예약 수정"
          primaryDisabled={!selectedSlotId}
          onPrimaryClick={handleSubmit}
        />
      </main>
    </ReservationLayout>
  );
}
