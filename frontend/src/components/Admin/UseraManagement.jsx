import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

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

      <div className="bg-neutral-800 border border-gray-700 rounded-xl overflow-hidden">
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
                    <span className="text-blue-400 font-semibold">Admin</span>
                  ) : (
                    <span className="text-gray-400">User</span>
                  )}
                </td>

                <td className="p-3 space-x-3">
                  <button
                    onClick={() => toggleAdmin(u._id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {u.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => deleteUser(u._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Delete
                  </button>
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
