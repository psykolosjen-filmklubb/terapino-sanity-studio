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
import movieOfTheWeek from "./documents/movieOfTheWeek";
import screening_movie_single from "./types/screening_movie_single";

export const schemaTypes = [
  member,
  review,
  screening,
  movieOfTheWeek,
  semester,
  page_om_oss,
  image_assets,
  role,
  verv,
  membership,
  settings,
  screening_movie,
  screening_movie_single,
  event,
  event_media,
];
