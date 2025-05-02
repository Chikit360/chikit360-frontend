import { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';


import { Link, useSearchParams } from 'react-router';

import { toast } from 'react-toastify';
import { IHospital } from '../../../helpers/hospitalInterface';
import { RootState } from '../../../features/store';
import LoadingOverlay from '../../../components/loader/LoadingOverlay';
import Button from '../../../components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { PencilIcon, TrashBinIcon } from '../../../icons';


export default function HospitalList() {
  const { hospitals, loading, error, message } = useSelector((state: RootState) => state.hospitals);  // Renamed clinics to hospitals
  const [searchParams] = useSearchParams();
 
  const [filteredData, setFilteredData] = useState<IHospital[]>([]);  // Changed Clinic to Hospital

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) {
      setFilteredData(hospitals);  // Renamed clinics to hospitals
    } else {
      setFilteredData(hospitals.filter(item => item.name.toLowerCase().includes(q?.toLowerCase() || '')));
    }
  }, [searchParams, hospitals]);

  useEffect(() => {
    if (error) {
      toast.error(message);
    }
    return () => {
     // dispatch(clearHospitalMessage());  // Adjusted dispatch for hospital
    };
  }, [error, message]);

  console.log(hospitals)
  if (loading && hospitals.length === 0) return <LoadingOverlay />;
  if (error) return <p>Error: {error}</p>;
  if (hospitals.length === 0) {  // Changed clinics to hospitals
    return (
      <div className='flex justify-center items-center flex-col'>
        <div className="p-8 text-center text-gray-500 text-lg">No hospital available.</div>
        <Button>
          <Link to={"/admin/pharmacy/items/add"}>Add Pharmacy</Link>  {/* Changed URL for adding hospital */}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-900">
      <div className='w-full p-4 flex justify-between items-center'>
        <div className='text-3xl font-medium'>Pharmacy List</div>  {/* Changed title to Hospital List */}
        <Button>
          <Link to={"/admin/pharmacy/items/add"}>Add Pharmacy</Link>  {/* Changed URL for adding hospital */}
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader className='bg-gray-100 dark:bg-gray-800'>
            <TableRow>
              {[ 'Name', 'Address', 'Contact'].map((header) => (  // Changed headers to Hospital-related
                <th key={header} className="px-5 py-3 font-medium text-gray-500">{header}</th>
              ))}
              <th className='px-5 py-3 font-medium text-gray-500'>Action</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((hospital: IHospital) => (  // Changed Clinic to Hospital
              <TableRow className='border-gray-200 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800' key={hospital._id}>
                {/* <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">{hospital._id}</TableCell> */}
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <p title={hospital.name} className='text-blue-500 '><Link to={`/admin/pharmacy/items/${hospital._id}`} > {hospital.name}</Link></p>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <p title={hospital.address.state} className='whitespace-nowrap max-w-[100px] text-ellipsis overflow-hidden'>{hospital.address.state===""? "NA":hospital.address.state}</p>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-gray-700 dark:text-gray-300">
                  <p title={hospital.contact.whatsapp} className='whitespace-nowrap max-w-[100px] text-ellipsis overflow-hidden'>{hospital.contact.whatsapp===""? "NA":hospital.contact.whatsapp}</p>
                </TableCell>
                <TableCell className=''>
                  <div className='w-full h-full flex gap-2 justify-around items-center'>
                    <Link to={`/admin/pharmacy/items/${hospital._id}/edit`}>  {/* Changed URL for editing hospital */}
                      <PencilIcon className='dark:text-white' />
                    </Link>
                    <Link to="#"
                      onClick={() => {/* You can add delete functionality here */}}
                    >
                      <TrashBinIcon className='dark:text-white' />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
