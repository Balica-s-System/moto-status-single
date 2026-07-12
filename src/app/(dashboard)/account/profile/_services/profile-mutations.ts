"use server";

import { auth } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { headers } from "next/headers";
import cloudinary from "@/lib/cloudinary";

const updateProfile = async (name: string, image?: string) => {
  const h = await headers();
  await executeAction({
    actionFn: () =>
      auth.api.updateUser({
        body: { name, image },
        headers: h,
      }),
  });
};

const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const h = await headers();
  await executeAction({
    actionFn: () =>
      auth.api.changePassword({
        body: { currentPassword, newPassword, revokeOtherSessions: true },
        headers: h,
      }),
  });
};

const deleteProfileImage = async () => {
  const h = await headers();
  await executeAction({
    actionFn: () =>
      auth.api.updateUser({
        body: { image: "" },
        headers: h,
      }),
  });
};

const deleteCloudinaryImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export { updateProfile, changePassword, deleteProfileImage, deleteCloudinaryImage };
