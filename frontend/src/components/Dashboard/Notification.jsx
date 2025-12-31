import React, { useEffect, useState } from "react";
import { API_URL } from '../../api/api';

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
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-gray-400">No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          className="mb-4 p-4 bg-neutral-800 border border-gray-700 rounded-lg"
        >
          <p className="text-xs text-gray-400 mb-1">
            {new Date(n.repliedAt).toLocaleString()}
          </p>

          <p className="mb-2 text-sm">
            You reported:
            <span className="block text-gray-300 mt-1">
              {n.description}
            </span>
          </p>

          <div className="bg-neutral-700 p-3 rounded">
            <p className="text-sm font-semibold mb-1">Admin reply</p>
            <p className="text-sm">{n.adminReply}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
