import type { ActionFunction } from "@remix-run/node";

import { prisma } from "~/utils/prisma.server";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { uploadAvatar } from "~/utils/s3.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const imageUrl = await uploadAvatar(request);

  await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          profilePicture: imageUrl,
        },
      },
    },
  });

  return json({ imageUrl });
};
