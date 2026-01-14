import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

/** UTC 문자열을 KST(Asia/Seoul)로 변환 */
export const toKST = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return dayjs.utc(dateStr).tz("Asia/Seoul");
};

export default dayjs;
