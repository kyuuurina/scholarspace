type CommentActionsProps = {
  onDeleteClick?: () => void;
  onEditClick?: () => void;
};

const CommentActions: React.FC<CommentActionsProps> = ({
  onDeleteClick,
  onEditClick,
}) => {
  return (
    // dropdown menu with edit and delete
    <div
      id="dropdownComment1"
      className="z-10 w-36 divide-y divide-gray-100 rounded bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
    >
      <ul
        className="py-1 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownMenuIconHorizontalButton"
      >
        <li className="block cursor-pointer px-4 py-2 hover:bg-gray-100">
          Edit
        </li>
        <li className="block cursor-pointer px-4 py-2 hover:bg-gray-100">
          Remove
        </li>
      </ul>
    </div>
  );
};

export default CommentActions;
