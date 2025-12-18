import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "./PageHeader";
import { ReservationLayout } from "./ReservationLayout";
import { SessionInfoCard } from "./SessionInfoCard";
import { SlotSection, SlotList } from "./SlotSection";
import { SlotCard } from "./SlotCard";
import { ReservationFooter } from "./ReservationFooter";
import { useSSE } from "../../../hooks/useSSE";
import { reservationApi } from "../api/reservationApi";
import type { CapacityUpdateEvent, SlotInfo } from "../types";
import { getClientId } from "../../../utils/clientId";
import { useReservation } from "../model/useReservation";

type SlotItem = {
  id: number;
  dateLabel: string;
  timeLabel: string;
  reviewer: string;
  rightLabel: string;
  status: "available" | "disabled" | "confirmed";
};

export default function ReservationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const resolvedEventId = eventId ?? "event-1";
  const { createReservation, isLoading } = useReservation();
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [reservedSlotId, setReservedSlotId] = useState<number | null>(null);
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const [slotBaseInfo, setSlotBaseInfo] = useState<Omit<SlotItem, "rightLabel" | "status">[]>([]);
  const [clientId] = useState(() => getClientId());

  // 슬롯별 정원 정보를 실시간으로 관리
  const [slotCapacities, setSlotCapacities] = useState<
    Map<number, { currentCount: number; maxCapacity: number }>
  >(new Map());

  const handleSSEMessage = useCallback((event: CapacityUpdateEvent) => {
    // eslint-disable-next-line no-console
    console.log("[SSE] Received capacity snapshot", event);
    setSlotCapacities(() => {
      const snapshotMap = new Map<
        number,
        { currentCount: number; maxCapacity: number }
      >();

      event.snapshot.forEach((slot) => {
        snapshotMap.set(slot.slotId, {
          currentCount: slot.currentCount,
          maxCapacity: slot.maxCapacity,
        });
      });

      return snapshotMap;
    });
    setHasSnapshot(true);
  }, []);

  // SSE 연결 및 실시간 정원 업데이트 수신
  useSSE<CapacityUpdateEvent>({
    url: "/api/reservations/capacity-updates",
    onMessage: handleSSEMessage,
    onError: (error) => {
      console.error("SSE connection error:", error);
    },
  });

  // 초기 슬롯 정보 및 정원 상태를 서버에서 가져오기
  useEffect(() => {
    const loadSlots = async () => {
      try {
        const slots = await reservationApi.getSlots();
        const baseInfo: Omit<SlotItem, "rightLabel" | "status">[] = slots.map(
          ({ id, dateLabel, timeLabel, reviewer }) => ({
            id,
            dateLabel,
            timeLabel,
            reviewer,
          })
        );
        setSlotBaseInfo(baseInfo);

        const initialMap = new Map<
          number,
          { currentCount: number; maxCapacity: number }
        >();
        slots.forEach((slot: SlotInfo) => {
          initialMap.set(slot.id, {
            currentCount: slot.currentCount,
            maxCapacity: slot.maxCapacity,
          });
        });
        setSlotCapacities(initialMap);
        setHasSnapshot(true);
      } catch (error) {
        console.error("슬롯 정보를 불러오지 못했습니다.", error);
        toast.error("슬롯 정보를 불러오지 못했습니다.");
      }
    };

    void loadSlots();
  }, []);

  // 정원 정보를 포함한 슬롯 목록 생성
  const slots: SlotItem[] = useMemo(() => {
    return slotBaseInfo.map((base) => {
      const capacity = slotCapacities.get(base.id);
      const hasCapacity = Boolean(capacity);

      if (!hasSnapshot || !hasCapacity || !capacity) {
        return {
          ...base,
          rightLabel: "정원 확인 중",
          status: "disabled",
        };
      }

      const currentCount = capacity.currentCount;
      const maxCapacity = capacity.maxCapacity;
      const isFull = currentCount >= maxCapacity;

      return {
        ...base,
        rightLabel: isFull ? "마감" : `${currentCount}/${maxCapacity}`,
        status: isFull ? "disabled" : "available",
      };
    });
  }, [hasSnapshot, slotBaseInfo, slotCapacities]);

  const handleSlotClick = (slot: SlotItem) => {
    const isReserved = slot.id === reservedSlotId;
    if (slot.status === "disabled" || slot.status === "confirmed" || isReserved)
      return;
    setSelectedSlotId(slot.id);
  };

  const handleSubmit = async () => {
    if (!selectedSlotId) return;

    const result = await createReservation({
      eventId: resolvedEventId,
      userId: clientId,
      slotId: selectedSlotId,
    });

    if (result.success) {
      setReservedSlotId(selectedSlotId);
      setSelectedSlotId(null);
    }
  };

  const handleCancel = () => {
    toast.info("예약 취소 기능은 아직 준비 중입니다.");
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
          primaryLabel={isLoading ? "예약 중..." : "예약하기"}
          primaryDisabled={!selectedSlotId || isLoading}
          onPrimaryClick={handleSubmit}
          secondaryLabel="예약 취소"
          secondaryDisabled={!reservedSlotId || isLoading}
          onSecondaryClick={handleCancel}
        />
      </main>
    </ReservationLayout>
  );
}
