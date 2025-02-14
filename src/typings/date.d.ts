declare type HeaderDateUnit =
  | '4years'
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour';

declare type DateUnit = HeaderDateUnit | 'minute' | 'millisecond' | 'second';

declare type LikeDate = Date | number | string;
