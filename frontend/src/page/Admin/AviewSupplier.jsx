import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    return (
      supplier.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.Branch_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Suppliers</h1>
      <br />
      <div style={{ width: '800px', margin: 'auto' }}>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by supplier or branch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <table className="table table-bordered" style={{ border: '2px solid black' }}>
          <thead className="thead-dark">
            <tr>
              <th>Supplier ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Branch Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.Supplier_ID}>
                <td>{supplier.Supplier_ID}</td>
                <td>{supplier.Name}</td>
                <td>{supplier.Contact_Number}</td>
                <td>{`${supplier.Address1}, ${supplier.Address2}`}</td>
                <td>{supplier.Branch_Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;
