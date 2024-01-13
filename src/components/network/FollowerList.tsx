// FollowerList.tsx

import React from "react";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import { useFetchFollowers } from "~/utils/follow";
import ScrollableModal from "./ScrollableModal";
import { useState } from "react";

interface FollowerListProps {
  profiles: {
    profile_id: string;
    user_id: string;
    name: string;
    avatar_url: string | null;
  }[];
}

const FollowerList: React.FC<FollowerListProps> = ({ profiles }) => {

    const [isModalOpen, setModalOpen] = useState(false);
    console.log("pengikutku", profiles);

    const openModal = () => {
    setModalOpen(true);
    };

    const closeModal = () => {
    setModalOpen(false);
    };

  // Use profiles instead of fetching data using useFetchFollowers

  return (
    <ScrollableModal show={isModalOpen}  onClose={closeModal} title="Followers">
      {profiles.length === 0 ? (
        <p>No Followers.</p>
      ) : (
        <ul>
          {profiles.map((follower) => (
            <li key={follower.profile_id} className="flex items-center space-x-2 p-4">
              <div className="aspect:square h-10 w-10 cursor-pointer">
                <AvatarPlaceholder
                  name={follower.name || "Unknown"}
                  shape="circle"
                />
              </div>
              <div className="ml-2">
                <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {follower.name || "Unknown"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ScrollableModal>
  );
};

export default FollowerList;



// import React, { useState } from "react";
// import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
// import { useFetchFollowers } from "~/utils/follow";
// import ScrollableModal from "./ScrollableModal";

// const FollowersList: React.FC = () => {
//   const { followers, isLoading, error } = useFetchFollowers();
//   const [isModalOpen, setModalOpen] = useState(false);

//   console.log("pengikut", followers);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading followers</div>;
//   }

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   return (
//     <div>
//       <button
//         onClick={openModal}
//         className="rounded-full px-4 py-2 bg-purple-800 text-white hover:bg-purple-600 transition-colors duration-300"
//       >
//         Followers
//       </button>
//       <ScrollableModal
//         show={isModalOpen}
//         onClose={closeModal}
//         title="Followers"
//       >
//         {followers.length === 0 ? (
//           <p>No Followers.</p>
//         ) : (
//           <ul>
//             {followers.map((follower) => (
//               <li key={follower.id} className="flex items-center space-x-2 p-4">
//                 <div className="aspect:square h-10 w-10 cursor-pointer">
//                   <AvatarPlaceholder
//                     name={follower.name || "Unknown"}
//                     shape="circle"
//                   />
//                 </div>
//                 <div className="ml-2">
//                   <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
//                     {follower.name || "Unknown"}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </ScrollableModal>
//     </div>
//   );
// };

// export default FollowersList;

