import * as moment from "moment";

export const toDatabaseDate = (date: Date | moment.Moment | number) => {
  return moment.utc(date).format("YYYY-MM-DD HH:mm:ss");
};
