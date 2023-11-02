import Link from "next/link";
import AvatarPlaceholder from "../AvatarPlaceholder";

//Research Post Card wraps Avatar, Title, Details, Likes, Comments and Reposts
export function ResearchPostCard() {
  return (
    <Link
      href="/research-post"
      className="flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-100 shadow-md hover:bg-gray-200"
    >
      <div>
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold dark:text-white">
            Research Post Title
          </h5>
        </div>
      </div>
    </Link>
  );
}
