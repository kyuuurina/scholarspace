const TableHeader: React.FC= () => {
  return (
    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
      <tr>
        <th scope="col" className="px-6 py-3">
          Task Name
        </th>
        <th scope="col" className="px-6 py-3">
          Start At
        </th>
        <th scope="col" className="px-6 py-3">
          Status
        </th>
        <th scope="col" className="px-6 py-3">
          Assignee
        </th>
        <th scope="col" className="cursor-pointer px-6 py-3">
          +
        </th>
        {/* render dynamic columns */}
      </tr>
    </thead>
  );
};

export default TableHeader;
