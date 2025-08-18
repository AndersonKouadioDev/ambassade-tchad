import { z } from 'zod';

export function validateData<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    const errors: { [key: string]: string } = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return {
      success: false,
      errors,
    };
  }
}
