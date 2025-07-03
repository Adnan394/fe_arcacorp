import { useState, useEffect } from 'react';
import { fetchGet, fetchPost, fetchPut } from '@/pages/service/api';
import Head from 'next/head';
import Navbar from '@/pages/components/Navbar';

export default function User() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ id: null, username: '', email: '', password: '', role_id: '' });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetchGet('/user');
      if (res && res.data) {
        setData(res.data);
      } else {
        alert('Data format invalid');
      }
    } catch (error) {
      alert('Error fetching user data:', error);
    }
  };
  const fetchRoles = async () => {
    try {
      const res = await fetchGet('/role');
      if (res && res.data) {
        setRoles(res.data);
      } else {
        alert('Data format invalid');
      }
    } catch (error) {
      alert('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    } else {
      fetchUser();
      fetchRoles();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && form.id) {
        let response = await fetchPut(`/user/${form.id}`, form);
        if (response.success) {
          alert('User updated successfully');
        } else {
          alert('Failed to update user');
        }
      } else {
        let response = await fetchPost('/user', form);
        if (response.success) {
          alert('User created successfully');
        } else {
          alert('Failed to create user');
        }
      }
      setShowModal(false);
      setIsEdit(false);
      setForm({ id: null, username: '', email: '', password: '', role_id: '' });
      await fetchUser();
    } catch (error) {
      alert('Failed to save user', error);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setForm({ id: item.id, username: item.username, email: item.email, password: item.password, role_id: item.role_id });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        let response = await fetchGet(`/user/destroy/${id}`);
        if (response.success) {
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }

        await fetchUser();
      } catch (error) {
        alert('Failed to delete user', error);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      let response = await fetchGet(`/user/restore/${id}`);
      if (response.success) {
        alert('User restored successfully');
      } else {
        alert('Failed to restore user');
      }
      
      await fetchUser();
    } catch (error) {
      alert('Failed to restore user', error);
    }
  };

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-white pt-5 md:flex md:flex-row md:justify-center p-3">
        <div className="md:w-1/2 md:mx-4 md:mb-0 mb-5">
          <div className="text-3xl font-bold text-center mb-8 text-gray-700">User</div>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
              setForm({ id: null, username: '', email: '', password: '', role_id: '' });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 md:mb-0"
          >
            Add User
          </button>

          <table className="w-full text-sm text-left text-gray-500 md:mt-5">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b ${item.deleted_at ? 'bg-gray-100 text-gray-400 line-through' : 'bg-white text-gray-700'}`}
                >
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.username}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {!item.deleted_at && (
                      <>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-600 hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {item.deleted_at && (
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md md:w-1/2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {isEdit ? 'Edit' : 'Add'} User
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                  placeholder="Username"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                  placeholder="Email"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                  placeholder="Password"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role_id">
                  Role
                </label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} selected={isEdit && form.role_id === role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

