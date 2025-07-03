import { useState, useEffect } from 'react';
import { fetchGet, fetchPost, fetchPut } from '@/pages/service/api';
import Head from 'next/head';
import Navbar from '@/pages/components/Navbar';

export default function Category() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', limit_per_month: '' });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchCategory = async () => {
    try {
      const res = await fetchGet('/category');
      if (res && res.data) {
        setData(res.data);
      } else {
        alert('Error fetching category data:', error);
      }
    } catch (error) {
      alert('Error fetching category data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    } else {
      fetchCategory();
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
        let response = await fetchPut(`/category/${form.id}`, form);
        if(response.success) {
        alert('Category updated successfully');
        }else {
          alert('Failed to update category');
        }
      } else {
        await fetchPost('/category', form);
      }
      setShowModal(false);
      setIsEdit(false);
      setForm({ id: null, name: '', limit_per_month: '' });
      await fetchCategory();
    } catch (error) {
      alert('Failed to save category', error);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setForm({ id: item.id, name: item.name, limit_per_month: item.limit_per_month });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        let response = await fetchGet(`/category/destroy/${id}`);
        if(response.success) {
        alert('Category deleted successfully');
        await fetchCategory();
      }else {
        alert('Failed to delete category');
      }
      } catch (error) {
        alert('Failed to delete category', error);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      let response = await fetchGet(`/category/restore/${id}`);
      if(response.success) {
        alert('Category restored successfully');
        await fetchCategory();
      }else {
        alert('Failed to restore category');
      }
    } catch (error) {
      alert('Failed to restore category', error);
    }
  };

  return (
    <>
      <Head>
        <title>Category</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-white pt-5 md:flex md:flex-row md:justify-center p-3">
        <div className="w-full md:w-1/2 md:px-3">
          <div className="text-3xl font-bold text-center mb-8 text-gray-700">Category</div>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEdit(false);
              setForm({ id: null, name: '', limit_per_month: '' });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
          >
            Add Data
          </button>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Limit per Month</th>
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
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.limit_per_month}</td>
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
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {isEdit ? 'Edit' : 'Add'} Category
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                placeholder="Name"
              />
              <input
                type="number"
                name="limit_per_month"
                value={form.limit_per_month}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 border border-gray-500 rounded placeholder-gray-700 text-gray-900 caret-black"
                placeholder="Limit per Month"
              />
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

