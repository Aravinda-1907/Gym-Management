import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { memberService } from "../services/memberService";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRenewModal, setShowRenewModal] = useState(false);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      const response = await memberService.getMemberById(id);
      setMember(response.data);
    } catch (error) {
      alert("Error loading member details");
      navigate("/members");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getDaysRemaining = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.inactive;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!member) return null;

  const daysRemaining = getDaysRemaining(member.expiryDate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/members" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Members
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{member.fullName}</h1>
        </div>
        <Link
          to={`/members/edit/${member._id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ✏️ Edit Member
        </Link>
      </div>

      {/* Status Alert */}
      {daysRemaining < 7 && daysRemaining > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ Membership expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {daysRemaining <= 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ Membership has expired</p>
        </div>
      )}

      {/* Member Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900">{member.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{member.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{member.address}</p>
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Membership Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Package Type</p>
              <p className="font-medium text-gray-900 capitalize">{member.packageType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                  member.membershipStatus
                )}`}
              >
                {member.membershipStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="font-medium text-gray-900">{formatDate(member.joinDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium text-gray-900">{formatDate(member.expiryDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days Remaining</p>
              <p className={`font-medium ${daysRemaining > 0 ? "text-green-600" : "text-red-600"}`}>
                {daysRemaining > 0 ? daysRemaining : 0} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {member.paymentHistory && member.paymentHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {member.paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{payment.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {payment.transactionId || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowRenewModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            🔄 Renew Membership
          </button>
          <Link
            to={`/members/edit/${member._id}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Edit Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;