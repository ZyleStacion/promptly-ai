import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const loadUsers = () => {
    fetch("http://localhost:3000/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleAdmin = (id) => {
    fetch(`http://localhost:3000/admin/toggle-role/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => loadUsers());
  };

  const deleteUser = (id) => {
    fetch(`http://localhost:3000/admin/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => loadUsers());
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-neutral-800 border border-gray-700 rounded-xl overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-neutral-900">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-700">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  {u.isAdmin ? (
                    <span className=" bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text font-bold">
                      Admin
                    </span>
                  ) : (
                    <span className="text-blue-300">User</span>
                  )}
                </td>

                <td className="p-3 relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === u._id ? null : u._id)
                    }
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ⋮
                  </button>

                  <AnimatePresence>
                    {openMenuId === u._id && (
                      <motion.div
                        ref={(el) => (menuRefs.current[u._id] = el)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 bg-neutral-700 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[150px]"
                      >
                        <button
                          onClick={() => {
                            toggleAdmin(u._id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-600 rounded-t-lg"
                        >
                          {u.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>

                        <button
                          onClick={() => {
                            deleteUser(u._id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-600 rounded-b-lg text-red-400"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
