// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { memberService } from "../services/memberService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, membersData] = await Promise.all([
        memberService.getMemberStats(),
        memberService.getMembers({ limit: 5, page: 1 })
      ]);

      setStats(statsData.data);
      setRecentMembers(membersData.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.total || 0,
      icon: "👥",
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Active Members",
      value: stats?.byStatus?.find(s => s._id === "active")?.count || 0,
      icon: "✅",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Expiring Soon",
      value: stats?.expiringSoon || 0,
      icon: "⚠️",
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      title: "Inactive",
      value: stats?.byStatus?.find(s => s._id === "inactive")?.count || 0,
      icon: "❌",
      color: "bg-red-500",
      textColor: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link
          to="/members/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Member</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} text-white text-3xl p-4 rounded-full`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Package Distribution
          </h2>
          <div className="space-y-3">
            {stats?.byPackage?.map((pkg) => (
              <div key={pkg._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="capitalize font-medium">{pkg._id}</span>
                </div>
                <span className="text-gray-700 font-semibold">{pkg.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Members */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Members</h2>
            <Link to="/members" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{member.fullName}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.membershipStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.membershipStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;