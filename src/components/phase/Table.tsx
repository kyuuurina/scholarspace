import Row from "./Row";
import TableHeader from "./TableHeader";

import { useState } from "react";
import { useRouterId } from "~/utils/routerId";
import { api } from "~/utils/api";
import { useFetchTasks } from "~/utils/task";

type TableProps = {
  phase_id: string;
};

const Table: React.FC<TableProps> = ({ phase_id }) => {
  const tasks = useFetchTasks(phase_id);
  return (
    <table className="w-full border border-gray-200 text-left text-sm text-gray-700">
      <TableHeader />
      <tbody>
        {tasks.map((task) => (
          <Row key={task.id} task={task} phase_id={phase_id}/>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
