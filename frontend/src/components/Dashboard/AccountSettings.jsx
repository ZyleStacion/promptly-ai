import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Profile image data
  const [profileImage, setProfileImage] = useState("");   // URL from DB
  const [profileFile, setProfileFile] = useState(null);   // selected image file
  const [previewImage, setPreviewImage] = useState("");   // preview URL

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD USER ON PAGE LOAD
  // --------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:3000/user/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const u = data.user;

        setUser(u);
        setUsername(u.username);
        setEmail(u.email);

        // existing db image
        const fullImg = u.profileImage
          ? `http://localhost:3000${u.profileImage}`
          : "";

        setProfileImage(fullImg);
        setPreviewImage(fullImg);
      });
  }, []);

  // --------------------------------------------------
  // HANDLE IMAGE SELECTION
  // --------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // show live preview
    }
  };

  // --------------------------------------------------
  // SAVE PROFILE CHANGES
  // --------------------------------------------------
  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    if (profileFile) {
      formData.append("profileImage", profileFile);
    }

    const res = await fetch("http://localhost:3000/user/update-info", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);

    if (data.user) {
      const img = data.user.profileImage
        ? `http://localhost:3000${data.user.profileImage}`
        : "";

      setUser(data.user);
      setPreviewImage(img); // update live image

      // Save to localStorage so navbar updates
      localStorage.setItem("user", JSON.stringify(data.user));

      // Notify Navbar to refresh
      window.dispatchEvent(new Event("storage"));
    }
  };

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------
  const handleChangePassword = async () => {
    const res = await fetch("http://localhost:3000/user/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;

    await fetch("http://localhost:3000/user/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signup");
  };

  if (!user) return <p className="text-white">Loading...</p>;

  // --------------------------------------------------
  // FRONTEND UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {message && (
        <p className="mb-4 bg-green-600/20 text-green-400 px-4 py-2 rounded">
          {message}
        </p>
      )}

      {/* Profile Image */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-300">Profile Image</label>

        <img
          src={previewImage || "https://via.placeholder.com/120"}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full mb-3 object-cover border border-gray-600"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-gray-300"
        />
      </div>

      {/* Username */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-300">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 p-3 rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 p-3 rounded"
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 py-3 rounded-lg text-white font-semibold mb-10"
      >
        Save Changes
      </button>

      {/* Change Password */}
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 p-3 rounded mb-4"
      />

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 p-3 rounded mb-4"
      />

      <button
        onClick={handleChangePassword}
        className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold mb-10"
      >
        Update Password
      </button>

      {/* Delete Account */}
      <button
        onClick={handleDeleteAccount}
        className="w-full bg-red-600 py-3 rounded-lg text-white font-semibold"
      >
        Delete Account
      </button>
    </div>
  );
};

export default AccountSettings;
