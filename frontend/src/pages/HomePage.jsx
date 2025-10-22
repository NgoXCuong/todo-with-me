import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [completeTasksCount, setCompleteTasksCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    fetchTasks();
  }, [dateQuery, filter]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTasksCount(res.data.activeCount);
      setCompleteTasksCount(res.data.completeCount);
      console.log(res.data);
    } catch (error) {
      console.log("Loi truy van", error);
      toast.error("Lỗi truy vấn tasks");
    }
  };

  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete"; // ✅ sửa lại cho khớp
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePre = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  useEffect(() => {
    if (visibleTasks.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [visibleTasks, page]);

  return (
    <div className="min-h-screen w-full bg-[#fafafa] relative text-gray-900">
      {/* Diagonal Grid with Light */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
          repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
        `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 mx-auto  relative z-10">
        <div className="w-full max-w-2xl  pt-6 mx-auto space-y-6">
          <Header />
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTasksCount}
            completedTasksCount={completeTasksCount}
          />
          <TaskList
            filteredTasks={visibleTasks} // ✅ chỉ truyền danh sách đang hiển thị
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          <div className="flex flex-col  items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePre={handlePre}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />

            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          <Footer
            activeTasksCount={activeTasksCount}
            completedTasksCount={completeTasksCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
