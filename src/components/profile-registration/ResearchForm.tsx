// i want this file
import { SearchBar } from "../search/SearchBar";

type ResearchData = {
  researchInterest: string[];
};

type ResearchFormProps = ResearchData & {
  updateFields: (fields: Partial<ResearchData>) => void;
};

export function ResearchForm({ updateFields }: ResearchFormProps) {
  return (
    <>
      <div className="my-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="researchInterests"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Research Interests
            </label>
            <SearchBar
              onChange={(options) =>
                updateFields({ researchInterest: options })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
