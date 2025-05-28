"use client";

import { useState } from "react";
import DailyLogCard from "./DailyLogCard";
import Pagination from "./Pagination";

interface UserDailyLog {
  id: string;
  datetime: string;
  signs: string[];
  score: number;
  note: string;
}

interface Props {
  logs: UserDailyLog[];
}

export default function LogSection({ logs }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {paginatedLogs.length === 0 ? (
        <p>体調記録がありません</p>
      ) : (
        paginatedLogs.map((log) => (
          <DailyLogCard
            key={log.id}
            id={log.id}
            datetime={log.datetime}
            signs={log.signs}
            score={log.score}
            note={log.note}
          />
        ))
      )}
      <Pagination
        posts={logs.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
