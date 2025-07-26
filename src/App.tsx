/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import Login from "./presentation/pages/Auth/Login";
import Template from "@components/layouts/Template";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@application/store/store";
import { useEffect, useState } from "react";
import { login } from "@application/slices/authSlice";
import Calendar from "@presentation/pages/Calendar";
import { Toaster } from "@components/ui/sonner";
import Animals from "@presentation/pages/Animals";
import Races from "@presentation/pages/Races";
import Sales from "@presentation/pages/Sales";
import Transfers from "@presentation/pages/Transfers";
import BulkUpload from "@presentation/pages/BulkUpload";
import MilkProduction from "@presentation/pages/MilkProduction";
import Weighing from "@presentation/pages/Weighing";
import Genetics from "@presentation/pages/Genetics";
import Cel from "@presentation/pages/Cel";
import Births from "@presentation/pages/Births";
import Vaccines from "@presentation/pages/Vaccines";
import Reports from "@presentation/pages/Reports";
import Users from "@presentation/pages/Users";
import ConfigAccount from "@presentation/pages/ConfigAccount";
import Farm from "@presentation/pages/Farm";
import Dashboard from "@presentation/pages/Dashboard";
import CurrentFarm from "@presentation/pages/CurrentFarm";
import { Loader2Icon } from "lucide-react";
import { setFarms } from "@application/slices/farmSlice";
import { useRequest } from "ahooks";
import FarmController from "@infrastructure/controllers/FarmController";
import Services from "@presentation/pages/Services";
import Palpations from "@presentation/pages/Palpations";
import Pregnancies from "@presentation/pages/Pregnancies";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const farms = useSelector((state: RootState) => state.farm);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { runAsync: runGetFarms } = useRequest(() => FarmController.search(), {
    manual: true,
    onSuccess: (response) => {
      dispatch(
        setFarms(
          response.map((farm: any, index: number) => ({
            id: farm.id,
            name: farm.name,
            current: index === 0,
            serviceSymbol: farm.serviceSymbol,
            volumeUnitSymbol: farm.volumeUnitSymbol,
            weightUnitSymbol: farm.weightUnitSymbol,
            currencyUnitSymbol: farm.currencyUnitSymbol,
          }))
        )
      );
    },
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userInfo");
    const token = sessionStorage.getItem("accessToken");

    if (storedUser) {
      dispatch(
        login({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          token: token,
        })
      );
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (user && !farms.length) {
      console.log("Fetching farms for the first time...");

      runGetFarms();
    }
  }, [dispatch, user, farms.length, runGetFarms]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <>
      <Toaster />
      <Template>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/production" element={<MilkProduction />} />
            <Route path="/weighing" element={<Weighing />} />
            <Route path="/genetics" element={<Genetics />} />
            <Route path="/cel" element={<Cel />} />
            <Route path="/services" element={<Services />} />
            <Route path="/palpations" element={<Palpations />} />
            <Route path="/pregnancies" element={<Pregnancies />} />
            <Route path="/births" element={<Births />} />
            <Route path="/vaccines" element={<Vaccines />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/races" element={<Races />} />
            <Route path="/users" element={<Users />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/config-account" element={<ConfigAccount />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/current-farm" element={<CurrentFarm />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Template>
    </>
  );
}

export default App;
