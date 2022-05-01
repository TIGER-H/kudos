import type { Department } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FormField } from "~/components/form-field";
import { Modal } from "~/components/modal";
import { SelectBox } from "~/components/select-box";
import { getUser, requireUserId } from "~/utils/auth.server";
import { updateUser } from "~/utils/users.server";
import { departments } from "~/utils/constants";
import { validateName } from "~/utils/validators.server";
import { ImageUploader } from "~/components/image-upload";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const department = form.get("department");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof department !== "string"
  ) {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }

  const errors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    department: validateName(department),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      { errors, fields: { department, firstName, lastName } },
      { status: 400 }
    );
  }

  await updateUser(userId, {
    firstName,
    lastName,
    department: department as Department,
  });

  return redirect("/home");
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({ user });
};

export default function ProfileSettings() {
  const { user } = useLoaderData();

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    department: user?.profile?.department || "IT",
    profilePicture: user?.profile?.profilePicture || "",
  });

  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData();
    inputFormData.append("profile-pic", file);

    const response = await fetch("/avatar", {
      method: "post",
      body: inputFormData,
    });

    const { imageUrl } = await response.json();

    setFormData({
      ...formData,
      profilePicture: imageUrl,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Modal isOpen={true} className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          <div className="flex">
            <div className="w-1/3">
              <ImageUploader
                onChange={handleFileUpload}
                imageUrl={formData.profilePicture || ""}
              />
            </div>
            <div className="flex-1">
              <form method="post">
                <FormField
                  htmlFor="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange(e, "firstName")}
                />
                <FormField
                  htmlFor="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange(e, "lastName")}
                />
                <SelectBox
                  className="w-full rounded-xl px-3 py-2 text-gray-400"
                  id="department"
                  label="Department"
                  name="department"
                  options={departments}
                  value={formData.department}
                  onChange={(e) => handleInputChange(e, "department")}
                />
                <div className="w-full text-right mt-4">
                  <button className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </h2>
      </div>
    </Modal>
  );
}
