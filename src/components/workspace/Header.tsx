import AvatarPlaceholder from "../AvatarPlaceholder";
import HeaderButton from "./HeaderButton";
import Image from "next/image";
import Link from "next/link";
import { useRouterId } from "~/utils/routerId";
import { useRouter } from "next/router";

type HeaderProps = {
  name: string;
  imgUrl: string;
};

const Header: React.FC<HeaderProps> = ({ name, imgUrl }) => {
  const router = useRouter();
  const workspaceId =
    router.query && router.query.id ? router.query.id.toString() : "";
  return (
    <div className="flex w-full flex-wrap justify-between border-b bg-white px-5 py-2 sm:py-5">
      <Link
        href={`/workspace/${workspaceId}`}
        className="flex max-w-[70%] items-center gap-x-3"
      >
        {imgUrl !== "" ? (
          <div className="relative h-12 w-12">
            <Image src={imgUrl} fill style={{ objectFit: "contain" }} alt="" />
          </div>
        ) : (
          <div className="h-12 w-12">
            <AvatarPlaceholder name={name || "SS"} shape="square" />
          </div>
        )}
        <h1 className="max-w-[80%] truncate text-2xl font-bold sm:text-4xl">
          {name}
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <HeaderButton type={"members"} />
        <HeaderButton type={"settings"} />
      </div>
    </div>
  );
};

export default Header;
