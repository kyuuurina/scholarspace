import Image from "next/image";

const ManageTasks: React.FC = () => {
  return (
    <div className="relative h-screen">
      <div className="px-8 text-gray-900">
        <p className="my-6 text-4xl font-semibold">
          Collaborate on research projects
          <span className="whitespace-nowrap py-2 text-purple-accent-1">
            {" "}
            with ease
          </span>
          .
        </p>
        <p className="font-medium">
          Take control of your research endeavors with ScholarSpace.
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 max-w-[80%]">
        <Image
          src="/manage-tasks-page.png"
          alt="scholarspace page"
          layout="responsive"
          width={800}
          height={600}
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export default ManageTasks;
