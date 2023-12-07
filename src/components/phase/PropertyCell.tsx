import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

type PropertyCellProps = {
  property: {
    id: string;
    name: string;
    type: string;
    phase_id: string;
  };
  index: number;
};

import CellActions from "./CellActions";

const PropertyCell: React.FC<PropertyCellProps> = ({ property, index }) => {
  const [isCellActionOpen, setIsCellActionOpen] = useState(false);
  const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setIsCellActionOpen(!isCellActionOpen);
    console.log(isCellActionOpen);
  };
  const ref = useClickAway(() => {
    setIsCellActionOpen(false);
  });
  return (
    <th
      ref={ref as React.MutableRefObject<HTMLTableCellElement>}
      key={index}
      onContextMenu={handleContextMenu}
      className="relative border border-gray-300 px-6 py-3 hover:bg-gray-100"
    >
      {property.name}
      {isCellActionOpen && (
        <CellActions
          property_id={property.id}
          setIsCellActionOpen={setIsCellActionOpen}
        />
      )}
    </th>
  );
};

export default PropertyCell;
