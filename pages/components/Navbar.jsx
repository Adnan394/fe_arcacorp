import { useRouter } from 'next/router';
import React, {useState, useEffect} from 'react';
const Navbar = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    setRole(storedRole);
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    router.push('/');
  };

  return (
    <nav className="bg-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          MyApp
        </div>
        <ul className="flex space-x-4">
          {role === 'Employee' && (
            <li>
              <a href="/pengajuan" className="text-white hover:text-gray-300">
                Pengajuan Reimbursement
              </a>
            </li>
          )}
          {role === 'Manager' && (
            <li>
              <a href="/pegajuan" className="text-white hover:text-gray-300">
                Data Pengajuan
              </a>
            </li>
          )}
          {role === 'Admin' && (
            <>
              <li>
                <a href="/data_pengajuan" className="text-white hover:text-gray-300">
                  Data Pengajuan
                </a>
              </li>
              <li>
                <a href="/admin/role" className="text-white hover:text-gray-300">
                  Role
                </a>
              </li>
              <li>
                <a href="/admin/category" className="text-white hover:text-gray-300">
                  Category
                </a>
              </li>
              <li>
                <a href="/admin/user" className="text-white hover:text-gray-300">
                  User
                </a>
              </li>
            </>
          )}
          <li>
            <div className="relative">
              <a href="#" className="text-white hover:text-gray-300" onClick={() => setShowDropdown(!showDropdown)}>
                Halo, {username}
              </a>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-md">
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </a>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

