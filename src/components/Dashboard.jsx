import React, { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

// Import Lucide icons
import { Home, Clock, MessageSquare, Users } from "lucide-react";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalProperties: 0,
    pendingApprovals: 0,
    activeRequests: 0,
    communities: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboardData");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();

        const result = data.result;
        setStatsData({
          totalProperties: result.total_properties,
          pendingApprovals: result.pending_properties,
          activeRequests: result.total_requests,
          communities: result.total_communities,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-container flex space-x-4">
        <StatsCard IconComponent={Home} title="Total Properties" value={statsData.totalProperties} />
        <StatsCard IconComponent={Clock} title="Pending Approvals" value={statsData.pendingApprovals} />
        <StatsCard IconComponent={MessageSquare} title="Active Requests" value={statsData.activeRequests} />
        <StatsCard IconComponent={Users} title="Communities" value={statsData.communities} />
      </div>
      <div className="charts-container">
        <div className="line-chart">
          <LineChart />
        </div>
        <div className="pie-chart">
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
