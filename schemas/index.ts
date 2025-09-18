import event from "./documents/event";
import event_media from "./types/event_media";
import image_assets from "./documents/image_assets";
import member from "./documents/member";
import membership from "./types/membership";
import page_om_oss from "./documents/page_om_oss";
import review from "./documents/review";
import role from "./documents/role";
import screening from "./documents/screening";
import screening_movie from "./types/screening_movie";
import semester from "./documents/semester";
import settings from "./documents/settings";
import verv from "./types/verv";

export const schemaTypes = [
  member,
  review,
  screening,
  semester,
  page_om_oss,
  image_assets,
  role,
  verv,
  membership,
  settings,
  screening_movie,
  event,
  event_media,
];
