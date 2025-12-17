import { useState } from "react";
import { toast } from "sonner";
import { reservationApi } from "../api/reservationApi";
import type { ReservationRequest } from "../types";

export function useReservation() {
  const [isLoading, setIsLoading] = useState(false);

  const createReservation = async (request: ReservationRequest) => {
    setIsLoading(true);

    try {
      const response = await reservationApi.createReservation(request);

      if (response.success) {
        toast.success(response.message, {
          description: `예약 ID: ${response.reservationId}`,
        });
        return { success: true, reservationId: response.reservationId };
      } else {
        // 분기점
        handleErrorMessage(response.message);
        return { success: false };
      }
    } catch (error) {
      console.error("Reservation error:", error); // 정발시 제거
      toast.error("예약 신청 중 오류가 발생했습니다.", {
        description: "잠시 후 다시 시도해주세요.",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorMessage = (message: string) => {
    switch (message) {
      case "존재하지 않는 이벤트입니다.": // 이거 나중에 dto 확정나면message가 아니라 다른걸로 -> 에러 메세지같은(EVENT_NOT_FOUND)
        toast.error("이벤트를 찾을 수 없습니다", {
          description: "페이지를 새로고침 해주세요.",
        });
        break;
      case "예약 신청 기간이 아닙니다.":
        toast.warning("아직 예약 신청 기간이 아닙니다", {
          description: "신청 기간을 확인해주세요.",
        });
        break;
      case "예약 신청 기간이 종료되었습니다.":
        toast.warning("예약 신청 기간이 종료되었습니다", {
          description: "다음 기회를 이용해주세요.",
        });
        break;
      case "예약이 마감되었습니다.":
        toast.error("예약이 마감되었습니다", {
          description: "선착순 마감되었습니다.",
        });
        break;
      default:
        toast.error(message);
    }
  };

  return {
    createReservation,
    isLoading,
  };
}
