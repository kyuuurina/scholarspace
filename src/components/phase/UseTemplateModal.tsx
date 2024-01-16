import { api } from "~/utils/api";
import Modal from "~/components/modal/Modal";
import { type phase_template } from "@prisma/client";
import { type ReactElement, useState, useEffect } from "react";
import PrimaryButton from "../button/PrimaryButton";
import { useRouterId } from "~/utils/routerId";
import { useRouter } from "next/router";

type TemplateModalProps = {
  show: boolean;
  onClose: () => void;
};

const TemplateModal: React.FC<TemplateModalProps> = ({ show, onClose }) => {
  const id = useRouterId();
  const router = useRouter();
  const { data: templates } = api.template.list.useQuery();
  const [selectedTemplate, setSelectedTemplate] =
    useState<phase_template | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setSelectedTemplate(templates?.[0] ?? null);
  }, [templates]);

  const createPhase = api.phase.createWithTemplate.useMutation();

  const handleCreatePhase = async () => {
    if (adding) return;
    setAdding(true);
    if (!selectedTemplate) return;

    const phase = await createPhase.mutateAsync({
      project_id: id,
      template: selectedTemplate,
    });

    if (phase) {
      onClose();
      router.reload();
    }
    setAdding(false);
  };

  return (
    <Modal title="Select Templates" show={show} onClose={onClose}>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <ul className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
            {templates?.map((template: phase_template) => (
              <li
                className="block cursor-pointer items-center p-3 hover:bg-gray-100 sm:flex"
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                }}
              >
                <p className="font-medium text-gray-900">{template.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 ">
          {selectedTemplate && (
            <div>
              <div className="flex justify-between py-2">
                <h1 className="text-2xl font-semibold text-gray-700">
                  {selectedTemplate.name}
                </h1>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr className="whitespace-nowrap border border-gray-300 px-6 py-4">
                      {selectedTemplate.phase_template_properties.map(
                        (property) => (
                          <th
                            className="border border-gray-300 px-6 py-4"
                            key={property}
                          >
                            {property}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-gray-300 px-6 py-4">
                      {selectedTemplate.phase_template_properties.map(
                        (property) => (
                          <td
                            className="border border-gray-300 px-6 py-4"
                            key={property}
                          >
                            <span> </span>
                          </td>
                        )
                      )}
                    </tr>
                    <tr className="border border-gray-300 px-6 py-4">
                      {selectedTemplate.phase_template_properties.map(
                        (property) => (
                          <td
                            className="border border-gray-300 px-6 py-4"
                            key={property}
                          >
                            <span> </span>
                          </td>
                        )
                      )}
                    </tr>
                    <tr className="border border-gray-300 px-6 py-4">
                      {selectedTemplate.phase_template_properties.map(
                        (property) => (
                          <td
                            className="border border-gray-300 px-6 py-4"
                            key={property}
                          >
                            <span> </span>
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-end space-x-5">
        <button
          onClick={() => onClose()}
          className="rounded-lg border border-purple-accent-1 bg-white px-3 py-2 text-center text-sm font-medium text-purple-accent-1 hover:border-none hover:bg-purple-accent-2 hover:text-white focus:outline-none"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await handleCreatePhase();
          }}
          className="rounded-lg border border-purple-accent-1 bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none"
        >
          Create Phase
        </button>
      </div>
    </Modal>
  );
};

export default TemplateModal;
