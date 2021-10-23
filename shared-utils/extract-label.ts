export function extractLabel(title: string): {
  title: string;
  scope?: string;
} {
  const res = title.split('::');

  return res.length === 2
    ? { title: res[1], scope: res[0] }
    : { title: res[0] };
}
