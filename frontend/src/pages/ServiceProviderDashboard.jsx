import { useState, useEffect, useContext } from "react";
import DashboardHeader from "../components/spdashboard/DashboardHeader";
import SummaryCards from "../components/spdashboard/SummaryCards";
import QuickActions from "../components/spdashboard/QuickActions";
import RecentActivity from "../components/spdashboard/RecentActivity";
import { ServiceProviderDataContext } from "../context/ServiceProviderContext";

const Dashboard = () => {
  const { provider } = useContext(ServiceProviderDataContext);
  const sample = { firstName: "", lastName: "" };
  const first = (provider && (provider.firstName || provider.firstname)) || sample.firstName;
  const last = (provider && (provider.lastName || provider.lastname)) || sample.lastName;
  const providerName = `${first} ${last}`.trim();

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* ===================== HEADER ===================== */}
      <DashboardHeader providerName={providerName} />

      {/* ===================== SUMMARY ===================== */}
      <SummaryCards />

      {/* ===================== QUICK ACTIONS ===================== */}
      <QuickActions />

      {/* ===================== RECENT ACTIVITY ===================== */}
      <RecentActivity />
    </div>
  );
}
export default Dashboard;
