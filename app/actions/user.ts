'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function dismissGuidance(
  type: 'gigCreation' | 'application'
): Promise<{ error?: string }> {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Validate type parameter
  if (type !== 'gigCreation' && type !== 'application') {
    return { error: 'Invalid guidance type. Please contact support if you see this error.' };
  }

  try {
    // Update the corresponding field based on type
    const updateData =
      type === 'gigCreation'
        ? { gigCreationGuidanceDismissed: true }
        : { applicationGuidanceDismissed: true };

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return {};
  } catch (error) {
    console.error('Error dismissing guidance:', error);
    return { error: 'Failed to dismiss guidance. Please try again. If the problem persists, contact support.' };
  }
}
