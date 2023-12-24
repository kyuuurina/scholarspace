import React from "react";
import { type UseFormSetValue } from "react-hook-form";
import type { FormData } from "~/types/profile";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";

type AvatarFormProps = {
  setValue: UseFormSetValue<FormData>;
  setImageValue: (value: File | null | undefined) => void;
};

const AvatarForm: React.FC<AvatarFormProps> = ({ setValue, setImageValue }) => {
  const [imagePlaceholder, setImagePlaceholder] = useState<string | null>(null);

  const user = useUser();

  // handler for onChange input for image upload
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const reader = new FileReader();

      // Read the image as a data URL
      if (file) {
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const displayImg = reader.result as string;
          setImagePlaceholder(displayImg);
        };

        setImageValue(file);
        if (user) {
          setValue("avatar_url", user.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-6">
      <div className="space-y-4">
        <label>
          <p className="mb-2">Upload your avatar here</p>
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
            {imagePlaceholder ? (
              <Image
                src={imagePlaceholder}
                alt="avatar"
                className="rounded-full"
                width={160}
                height={160}
              />
            ) : (
              <FaRegUserCircle size={100} className="text-gray-300" />
            )}
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                void handleOnChange(e);
              }}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default AvatarForm;
