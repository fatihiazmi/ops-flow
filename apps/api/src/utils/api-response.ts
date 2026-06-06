export function success<T>(data: T) {
  return { data };
}

export function listSuccess<T>(
  data: T[],
  meta: { page: number; pageSize: number; total: number; totalPages: number }
) {
  return { data, meta };
}

export function errorResponse(
  code: string,
  message: string,
  details: Record<string, unknown> = {}
) {
  return { error: { code, message, details } };
}
