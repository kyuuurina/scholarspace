import React from "react";
import { type UseFormSetValue } from "react-hook-form";
import type { FormData } from "~/types/profile";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";

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
        <label className=" h-60 w-60 flex-col items-center justify-center rounded-full bg-gray-50 ">
          <p className="mb-5">Upload your avatar here</p>
          <div className="h-fit w-fit cursor-pointer rounded-full border border-gray-300 hover:bg-gray-100">
            {imagePlaceholder ? (
              <Image
                src={imagePlaceholder}
                alt="avatar"
                className="rounded-full"
                width={160}
                height={160}
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: 100,
                  height: 100,
                }}
              />
            ) : (
              <FaRegUserCircle size={100} className="text-gray-300" />
            )}
            <label>
              <input
                onChange={(e) => {
                  handleOnChange(e);
                }}
                type="file"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </label>
        {imagePlaceholder ? (
          <button
            className="flex items-center justify-start space-x-2 rounded-md p-1 text-red-700 hover:bg-red-100"
            onClick={() => setImagePlaceholder(null)}
          >
            <FiXCircle /> <span>Remove</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AvatarForm;
