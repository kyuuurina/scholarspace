import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { v4 as uuidv4 } from "uuid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { FileObject } from "@supabase/storage-js";

// utils
import { api } from "~/utils/api";
import { useFetchProjectId } from "~/utils/phase";

// components
import FormErrorMessage from "~/components/FormErrorMessage";
import AttachmentListing from "./AttachmentListing";

type AttachmentUploadProps = {
  id: string | undefined;
  phaseId: string | undefined;
  attachments: string[] | undefined | null;
  refetch: () => void;
};

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  id,
  phaseId,
  attachments,
  refetch,
}) => {
  const [newAttachments, setNewAttachments] = useState<File[] | null>(null);
  const [newAttachmentIds, setNewAttachmentIds] = useState<string[]>([]);
  const [oldAttachments, setOldAttachments] = useState<string[] | null>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const project_id = useFetchProjectId(phaseId ?? "");
  const supabase = useSupabaseClient();
  const uploadAttachments = api.task.uploadAttachment.useMutation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) => file);
      setNewAttachments(fileArray);
    }
  };

  const handleOnSubmit = async () => {
    const newIds: string[] = [];
    if (newAttachments && id && phaseId && project_id) {
      for (const file of newAttachments) {
        attachments?.push(file.name);
        console.log(attachments);
        const fileUrl = `/${project_id}/${phaseId}/${id}/${file.name}`;

        try {
          const { data, error } = await supabase.storage
            .from("task-attachments")
            .upload(fileUrl, file);
          console.log(data, error);
        } catch (error) {
          console.log(error);
        }
      }

      if (attachments) {
        await uploadAttachments.mutateAsync({
          id,
          attachments,
        });
      }
      setNewAttachments(null);
      setNewAttachmentIds([]);
      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      refetch && refetch();
    }
  };

  useEffect(() => {
    setOldAttachments(attachments);
  }, [attachments]);

  const fileLink = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/task-attachments/${
    project_id ?? ""
  }/${phaseId ?? ""}/${id ?? ""}/`;

  return (
    <div className="flex flex-col">
      <div className="max-w-40 max-h-[40rem] space-y-4 overflow-auto truncate">
        {/* iterate newAttachments */}
        {oldAttachments &&
          oldAttachments.map((file) => {
            // const sizeStr = file.size.toString();

            return (
              <AttachmentListing
                key={file}
                name={file}
                fileLink={fileLink + file}
              />
            );
          })}
      </div>
      <label className="my-2 block text-sm font-medium text-gray-900">
        Attachments
      </label>
      <div className="flex flex-col">
        <input
          ref={fileInputRef}
          className="flex-1 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
          type="file"
          multiple
          onChange={handleOnChange}
        ></input>
        {newAttachments && newAttachments.length > 0 && (
          <button
            className="btn btn-primary ml-auto p-4 text-purple-accent-1"
            onClick={handleOnSubmit}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default AttachmentUpload;
