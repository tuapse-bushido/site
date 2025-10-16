import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(): Promise<Response> {
  revalidateTag('productCard');
  revalidatePath('/');
  return Response.json({ revalidated: true });
}
