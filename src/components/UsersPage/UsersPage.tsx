import UserLayout from "./List/UserLayout";

const UsersPage = () => {
  return (
    <>
      <div className="md:h-96">
        <div className="flex flex-col md:flex-row h-full md:h-[94vh] lg:h-screen">
          <div className="bg-gray-300 lg:block">
            <UserLayout></UserLayout>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
