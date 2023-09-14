import Link from "next/link";

const ProjectCard: React.FC = () => {
  return (
    <Link
      href="/project"
      className="flex h-52 min-w-full flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl md:flex-row"
    >
      <div>
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold dark:text-white">
            Assessing the Virtual Early Intervention for Children with Learning
            Disabilities
          </h5>
          <p className="mb-3 line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
            Assessing the Virtual Early Intervention for Children with Learning
            Disabilities is a research study aimed at evaluating the
            effectiveness and impact of virtual early intervention programs on
            children with learning disabilities. Through rigorous assessment and
            analysis, this study aims to provide valuable insights into the
            benefits and limitations of virtual interventions, informing the
            development of more inclusive and accessible educational approaches
            for children with learning disabilities.
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
