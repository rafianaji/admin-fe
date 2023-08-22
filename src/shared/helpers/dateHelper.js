export function dateConvertToDMY(date) {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  const dateConvert = new Date(date);
  const mm = dateConvert.getMonth();
  const dd = dateConvert.getDate();
  const yyyy = dateConvert.getFullYear();

  return `${dd} ${months[mm]} ${yyyy}`;
}
