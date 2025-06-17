'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Toaster, toast } from 'react-hot-toast';
import { ColorRing } from 'react-loader-spinner';

interface Contact {
  CON_ID: number;
  CON_TYPE: string;
  CON_NAME: string;
  CON_MOBILE_NO: string;
  CON_ATTACHMENT: string | null;
  CON_MORE_DETAIL: string;
  CON_RATING: number;
  CON_ACTIVE_YN: string;
  CON_CREATED_DT?: string;
  CON_UPDATED_BY?: string;
  CON_UPDATED_DT?: string;
}

const ContactTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('https://node2-plum.vercel.app/api/user/contactus');
        const data = await res.json();
        if (data.success) {
          setContacts(data.data);
        } else {
          toast.error(data.message || 'Failed to load contacts');
        }
      } catch (err) {
        toast.error('Error fetching contacts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.CON_NAME.toLowerCase().includes(search.toLowerCase()) ||
      c.CON_MOBILE_NO.includes(search)
  );

  const columns = [
    {
      name: 'Name',
      selector: (row: Contact) => row.CON_NAME,
      sortable: true,
    },
    {
      name: 'Type',
      selector: (row: Contact) => row.CON_TYPE,
      sortable: true,
    },
    {
      name: 'Mobile No',
      selector: (row: Contact) => row.CON_MOBILE_NO,
      sortable: true,
    },
    {
      name: 'Rating',
      selector: (row: Contact) => row.CON_RATING,
      sortable: true,
    },
    {
      name: 'Active',
      selector: (row: Contact) => row.CON_ACTIVE_YN === 'Y' ? 'Yes' : 'No',
    },
    {
      name: 'Details',
      selector: (row: Contact) => row.CON_MORE_DETAIL,
      wrap: true,
    },
    {
      name: 'Attachment',
      cell: (row: Contact) =>
        row.CON_ATTACHMENT ? (
          <a
            href={row.CON_ATTACHMENT}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View
          </a>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <>
      <Toaster />
      <div className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Contact Submissions</h2>
          <input
            type="text"
            placeholder="Search by name or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full sm:w-64"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredContacts}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          persistTableHead
          progressComponent={
            <div className="flex justify-center items-center h-24">
              <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="color-ring-loading"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />
            </div>
          }
        />
      </div>
    </>
  );
};

export default ContactTable;
