import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import HeaderButton from "./HeaderButton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_WORKSPACE_COVER_URL } from "~/utils/supabase-storage";

type HeaderProps = {
  name: string;
  imgUrl: string | null;
  purpose?: "workspace" | "project";
};

const Header: React.FC<HeaderProps> = ({
  name,
  imgUrl,
  purpose = "workspace",
}) => {
  const router = useRouter();
  const id = router.query && router.query.id ? router.query.id.toString() : "";

  return (
    <div className="flex w-full flex-wrap justify-between border-b bg-white px-5 py-2 sm:py-5">
      <Link
        href={`/${purpose}/${id}`}
        className="flex max-w-[70%] items-center gap-x-3"
      >
        {imgUrl !== null ? (
          <div className="relative h-12 w-12">
            <Image
              src={`${BASE_WORKSPACE_COVER_URL}/${imgUrl}`}
              fill
              style={{ objectFit: "contain" }}
              alt=""
            />
          </div>
        ) : (
          <div className="h-12 w-12">
            <AvatarPlaceholder name={name || "SS"} shape="square" />
          </div>
        )}
        <h1 className="truncate text-2xl font-bold sm:text-4xl">{name}</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        {/* if purpose is project */}
        {purpose === "project" && (
          <HeaderButton purpose={purpose} type={"phases"} />
        )}
        <HeaderButton purpose={purpose} type={"members"} />
        <HeaderButton purpose={purpose} type={"settings"} />
      </div>
    </div>
  );
};

export default Header;
