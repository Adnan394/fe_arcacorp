import React, { useState, useEffect } from 'react';
import { fetchGet, fetchPost } from '@/pages/service/api';
import Navbar from '@/pages/components/Navbar';

export default function Pengajuan() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    category_id: '',
    file: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchPengajuan = async () => {
    try {
      if(role === 'Employee') {
        const res = await fetchGet('/pengajuan');
        if (res && res.data) {
          setData(res.data); 
        } else {
          setData([]);
        }
      } else {
        const res = await fetchGet('/pengajuan/get_all');
        if (res && res.data) {
          setData(res.data); 
        } else {
          setData([]);
        }
      }
    } catch (error) {
      alert('Error fetching pengajuan data: ' + error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await fetchGet('/category');
      if (res && res.data) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      alert('Error fetching category data: ' + error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setRole(localStorage.getItem('role') || '');
    if (!token) {
      window.location.href = '/';
    } else {
      fetchPengajuan();
      fetchCategory();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('amount', form.amount);
    formData.append('category_id', form.category_id);
    formData.append('file', form.file);

    try {
      let response = await fetchPost('/pengajuan', formData);
      if(response.success) {
        alert('Pengajuan submitted successfully');
      } else {
        alert('Failed to submit pengajuan');
      }
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        amount: '',
        category_id: '',
        file: null,
      });
      fetchPengajuan();
    } catch (err) {
      alert('Submit error: ' + err);
    }
  };

  const handleDelete = async (id) => {
    if(confirm('Are you sure you want to delete this pengajuan?')) {
      try {
        let response = await fetchGet(`/pengajuan/destroy/${id}`);
        if(response.success) {
          alert('Pengajuan deleted successfully');
        } else {
          alert('Failed to delete pengajuan');
        }
        fetchPengajuan();
      } catch (err) {
        alert('Delete error: ' + err);
      }
    }
  };

  const handleApprove = async (id) => {
    if(confirm('Are you sure you want to approve this pengajuan?')) {
      try {
        let response = await fetchPost(`/pengajuan/approve/${id}`);
        if(response.success) {
          alert('Pengajuan approved successfully');
        } else {
          alert('Failed to approve pengajuan');
        }

        fetchPengajuan();
      } catch (err) {
        alert('Approve error: ' + err);
      }
    }
  };

  const handleReject = async (id) => {
    if(confirm('Are you sure you want to reject this pengajuan?')) {
      try {
        let repsonse = await fetchPost(`/pengajuan/reject/${id}`);
        if(repsonse.success) {
          alert('Pengajuan rejected successfully');
        } else {
          alert('Failed to reject pengajuan');
        }
        fetchPengajuan();
      } catch (err) {
        alert('Reject error: ' + err);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-5 md:flex md:flex-row md:justify-center p-3">
        <div className="md:w-1/2 md:mx-4 md:mb-0 mb-5">
          <div className="text-3xl font-bold text-center mb-8 text-gray-700">Pengajuan</div>
          {role === 'Employee' && (
            <button
              onClick={() => {
                setShowModal(true);
                setIsEdit(false);
                setForm({ title: '', description: '', amount: '', category_id: '', file: null });
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
            >
              Add Pengajuan
            </button>
          )}
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">File</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading or No Data
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.amount}</td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">
                      <a
                        href={process.env.NEXT_PUBLIC_URL + '/' + item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        Download
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {role === "Employee" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Delete
                        </button>
                      )}

                      {role !== "Employee" && (
                        <>
                          {item.status == "approved" ? (
                            <button
                              onClick={() => handleReject(item.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                              Reject
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                              Approve
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {isEdit ? 'Edit Pengajuan' : 'Add Pengajuan'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                placeholder="Description"
                required
              />
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                placeholder="Amount"
                required
              />
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEdit ? 'Update' : 'Save'}
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

