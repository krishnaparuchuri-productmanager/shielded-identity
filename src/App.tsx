import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/pages/SplashScreen";
import ScanPage from "@/pages/ScanPage";
import ResultPage from "@/pages/ResultPage";
import KycPage from "@/pages/KycPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <div className="mx-auto max-w-sm min-h-dvh relative bg-background">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ScanPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
