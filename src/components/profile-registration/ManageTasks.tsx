import Image from "next/image";

const ManageTasks: React.FC = () => {
  return (
    <>
      <div className="px-8 py-16 text-gray-900">
        <p className="my-6 text-6xl font-semibold">
          Collaborate on research projects
          <span className="whitespace-nowrap py-2 text-purple-accent-1">
            {" "}
            with ease
          </span>
          .
        </p>
        <p className="font-medium">
          Take control of your research endeavors with ScholarSpace&apos;s
          &quot;Manage Research Projects,&quot; enabling you to break down
          tasks, set reminders, and collaborate seamlessly for unparalleled
          efficiency in your academic pursuits.
        </p>
      </div>
      <div>
        <Image
          src="/manage-tasks-page.png"
          alt="scholarspace page"
          width={790}
          height={740}
          className="justify-self-center"
        />
      </div>
    </>
  );
};

export default ManageTasks;
