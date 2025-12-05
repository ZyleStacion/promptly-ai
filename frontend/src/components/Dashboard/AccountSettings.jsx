import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi, USE_MOCK_API } from "../../api/mockApi";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Profile image data
  const [profileImage, setProfileImage] = useState(""); // URL from DB
  const [profileFile, setProfileFile] = useState(null); // selected image file
  const [previewImage, setPreviewImage] = useState(""); // preview URL

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD USER ON PAGE LOAD
  // --------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        let data;

        if (USE_MOCK_API) {
          data = await mockApi.getUserProfile();
        } else {
          const res = await fetch("http://localhost:3000/user/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          data = await res.json();
        }

        const u = data.user;
        setUser(u);
        setUsername(u.username);
        setEmail(u.email);

        // existing db image
        const fullImg = u.profileImage
          ? USE_MOCK_API
            ? u.profileImage
            : `http://localhost:3000${u.profileImage}`
          : "";

        setProfileImage(fullImg);
        setPreviewImage(fullImg);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
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
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      let data;

      if (USE_MOCK_API) {
        data = await mockApi.updateUserProfile(formData);
      } else {
        const res = await fetch("http://localhost:3000/user/update-info", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        data = await res.json();
      }

      setMessage(data.message);

      if (data.user) {
        const img = data.user.profileImage
          ? USE_MOCK_API
            ? data.user.profileImage
            : `http://localhost:3000${data.user.profileImage}`
          : "";

        setUser(data.user);
        setPreviewImage(img); // update live image

        // Save to localStorage so navbar updates
        localStorage.setItem("user", JSON.stringify(data.user));

        // Notify Navbar to refresh
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------
  const handleChangePassword = async () => {
    try {
      let data;

      if (USE_MOCK_API) {
        data = await mockApi.changePassword({ currentPassword, newPassword });
      } else {
        const res = await fetch("http://localhost:3000/user/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        data = await res.json();
      }

      setMessage(data.message);

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Error changing password");
    }
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;

    try {
      if (USE_MOCK_API) {
        await mockApi.deleteAccount();
      } else {
        await fetch("http://localhost:3000/user/delete", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Error deleting account");
    }
  };

  if (!user) return <p className="text-white">Loading...</p>;

  // --------------------------------------------------
  // FRONTEND UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-20">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {message && (
        <p className="mb-4 bg-green-600/20 text-green-400 px-4 py-2 rounded">
          {message}
        </p>
      )}

      {/* Profile Image */}
      <div className="mb-6 items-center justify-center w-full">
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
