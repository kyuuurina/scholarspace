import React, { useState } from "react";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import { useFetchFollowing } from "~/utils/follow";
import ScrollableModal from "./ScrollableModal";

const FollowingList: React.FC = () => {
  const { following, isLoading, error } = useFetchFollowing();
  const [isModalOpen, setModalOpen] = useState(false);

  console.log("mengikut", following);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading followers</div>;
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded-full px-4 py-2 bg-purple-800 text-white hover:bg-purple-600 transition-colors duration-300"
      >
        Following
      </button>
      <ScrollableModal
        show={isModalOpen}
        onClose={closeModal}
        title="Following"
      >
        {following.length === 0 ? (
          <p>No following account</p>
        ) : (
          <ul>
            {following.map((following) => (
              <li
                key={following.id}
                className="flex items-center space-x-2 p-4"
              >
                <div className="aspect:square h-10 w-10 cursor-pointer">
                  <AvatarPlaceholder
                    name={following.name || "Unknown"}
                    shape="circle"
                  />
                </div>
                <div className="ml-2">
                  <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {following.name || "Unknown"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollableModal>
    </div>
  );
};

export default FollowingList;

//   return (
//     <div>
//       <button
//         onClick={openModal}
//         className="rounded-full px-4 py-2 bg-purple-800 text-white hover:bg-purple-600 transition-colors duration-300"
//       >
//         Following
//       </button>
//       <ScrollableModal
//         show={isModalOpen}
//         onClose={closeModal}
//         title="Following"
//       >
//         {following.length === 0 ? (
//           <p>No following account</p>
//         ) : (
//           <ul>
//             {following.map((following) => (
//               <li
//                 key={following.id}
//                 className="flex items-center space-x-2 p-4"
//               >
//                 <Link href={`/manage-profile/${following.profile_id}`}>
//                   <div className="aspect:square h-10 w-10 cursor-pointer">
//                     <AvatarPlaceholder
//                       name={following.name || "Unknown"}
//                       shape="circle"
//                     />
//                   </div>
//                 </Link>
//                 <div className="ml-2">
//                   <Link href={`/manage-profile/${following.profile_id}`}>
//                     <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
//                       {following.name || "Unknown"}
//                     </span>
//                   </Link>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </ScrollableModal>
//     </div>
//   );
// };

// export default FollowingList;
