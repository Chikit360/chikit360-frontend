import React, { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../features/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiryStatusAPI } from '../../features/inquiry/inquiryApiThunk';
import LoadingOverlay from '../../components/loader/LoadingOverlay';

const InquiryList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { inquiries, loading, error } = useSelector((state: RootState) => state.inquiry);

    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchInquiries());
    }, [dispatch]);

    const handleResolve = (id: string) => {
        dispatch(updateInquiryStatusAPI({ id, status: 'resolved' }));
    };

    const toggleExpand = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    if(loading) return <LoadingOverlay/>
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Inquiries</h1>

            {loading ? (
                <p>Loading inquiries...</p>
            ) : error ? (
                <p className="text-red-600">Error: {error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Contact</th>
                                <th className="p-3 border-b">Message</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inq) => (
                                <React.Fragment key={inq._id}>
                                    <tr
                                        onClick={() => toggleExpand(inq._id)}
                                        className="text-sm border-t hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <td className="p-3">{inq.name}</td>
                                        <td className="p-3">{inq.email}</td>
                                        <td className="p-3">{inq.contactNumber}</td>
                                        <td className="p-3 max-w-xs truncate flex items-center gap-1">
                                            <span className="truncate">{inq.message}</span>
                                            <span className="text-gray-500 text-xs">
                                                {expandedId === inq._id ? '▲' : '▼'}
                                            </span>
                                        </td>
                                        <td className="p-3 capitalize">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${inq.status === 'resolved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                disabled={inq.status === 'resolved'}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent row expand
                                                    handleResolve(inq._id);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md disabled:opacity-80"
                                            >
                                                Mark Resolved
                                            </button>
                                        </td>
                                    </tr>

                                    {expandedId === inq._id && (
                                        <tr>
                                            <td colSpan={6} className="p-4 bg-gray-50 border-t text-sm text-gray-700">
                                                <strong>Full Message:</strong> <br />
                                                {inq.message}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {inquiries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">
                                        No inquiries available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InquiryList;
