import "./App.css";
import TopNav from "./components/layout/top-nav";
import RevenueDashboardPage from "./pages/revenue-dashboard";

function App() {
  return (
    <div className="min-h-screen bg-[#ffffff] p-[16px]">
      <TopNav />
      <div className="mt-24"></div>
      <RevenueDashboardPage />
    </div>
  );
}

export default App;
