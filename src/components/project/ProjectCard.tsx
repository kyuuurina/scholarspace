import Link from "next/link";
import Image from "next/image";

import AvatarPlaceholder from "~/components/AvatarPlaceholder";

type ProjectCardProps = {
  // an object of an array of projects
  project: {
    project_id: string;
    name: string;
    description: string;
    cover_img: string | null;
    c_score: number;
    p_score: number; // Make it nullable to handle potential null values
  };
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      href={`/project/${project.project_id}`}
      className="flex w-full items-center space-x-5 rounded-lg border border-gray-200 bg-white p-4 shadow hover:bg-gray-100"
    >
      <div className="aspect:square">
        {project.cover_img ? (
          <Image
            src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/project-covers/${project.cover_img}`}
            alt="Project cover image"
            width={100}
            height={100}
          />
        ) : (
          <div className="aspect:square h-20 w-20">
            <AvatarPlaceholder name={project.name} shape="square" />
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <h5 className="mb-2 line-clamp-2 text-2xl font-bold dark:text-white">
          {project.name}
        </h5>
        <p className="line-clamp-3 overflow-hidden text-ellipsis text-gray-700">
          {project.description || "No description"}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
