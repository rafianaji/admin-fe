export function dateConvertToDMY(date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const dateConvert = new Date(date);
  const mm = dateConvert.getMonth();
  const dd = dateConvert.getDate();
  const yyyy = dateConvert.getFullYear();

  return `${dd} ${months[mm]} ${yyyy}`;
}

export function dateConvertToYMD(date) {
  const dateConvert = new Date(date);
  const mm = dateConvert.getMonth() + 1;
  const dd = dateConvert.getDate();
  const yyyy = dateConvert.getFullYear();

  return `${yyyy}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
}
