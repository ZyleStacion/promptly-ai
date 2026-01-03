import React, { useEffect, useState } from "react";
import { API_URL } from "../../api/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/feedback/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
      })
      .catch((err) => {
        console.error("Failed to load notifications", err);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white dark:text-gray-900">
        Notifications
      </h2>

      {notifications.length === 0 && (
        <p className="text-gray-400 dark:text-gray-600">No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          className="mb-4 p-4 bg-neutral-800 dark:bg-white border border-gray-700 dark:border-gray-200 rounded-lg"
        >
          <p className="text-xs text-gray-400 dark:text-gray-600 mb-1">
            {new Date(n.repliedAt).toLocaleString()}
          </p>

          <p className="mb-2 text-sm text-white dark:text-gray-900">
            You reported:
            <span className="block text-gray-300 dark:text-gray-700 mt-1">
              {n.description}
            </span>
          </p>

          <div className="bg-neutral-700 dark:bg-gray-50 p-3 rounded">
            <p className="text-sm font-semibold mb-1 text-white dark:text-gray-900">
              Admin reply
            </p>
            <p className="text-sm text-white dark:text-gray-900">
              {n.adminReply}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
