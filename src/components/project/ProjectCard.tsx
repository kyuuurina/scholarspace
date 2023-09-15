import Link from "next/link";

const ProjectCard: React.FC = () => {
  return (
    <Link
      href="/project"
      className="flex w-full flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow hover:bg-gray-100 md:max-w-xl"
    >
      <div className="w-full">
        <h5 className="mb-2 line-clamp-2 text-2xl font-bold dark:text-white">
          Assessing the Virtual Early Intervention for Children with Learning
          Disabilities
        </h5>
        <p className="line-clamp-3 text-gray-700 ">
          Assessing the Virtual Early Intervention for Children with Learning
          Disabilities is a research study aimed at evaluating the effectiveness
          and impact of virtual early intervention programs on children with
          learning disabilities. Through rigorous assessment and analysis, this
          study aims to provide valuable insights into the benefits and
          limitations of virtual interventions, informing the development of
          more inclusive and accessible educational approaches for children with
          learning disabilities.
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
