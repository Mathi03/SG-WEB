/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@components/ui/card";
import { AgCharts } from "ag-charts-react";

const Dashboard = () => {
  const options1: any = {
    title: {
      text: "Vacas vs. Toros vs. Ventas",
    },
    data: [
      {
        quarter: "Q1'18",
        vacas: 140,
        toros: 16,
        ventas: 14,
      },
      {
        quarter: "Q2'18",
        vacas: 124,
        toros: 20,
        ventas: 14,
      },
      {
        quarter: "Q3'18",
        vacas: 112,
        toros: 20,
        ventas: 18,
      },
      {
        quarter: "Q4'18",
        vacas: 118,
        toros: 24,
        ventas: 14,
      },
    ],
    series: [
      {
        type: "bar",
        xKey: "quarter",
        yKey: "vacas",
        yName: "Vacas",
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "toros",
        yName: "Toros",
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "ventas",
        yName: "Ventas",
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "ventas",
        yName: "Ventas",
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "ventas",
        yName: "Ventas",
      },
    ],
  };

  const options2: any = {
    data: [
      { asset: "Stocks", amount: 60000 },
      { asset: "Bonds", amount: 40000 },
      { asset: "Cash", amount: 7000 },
      { asset: "Real Estate", amount: 5000 },
      { asset: "Commodities", amount: 3000 },
    ],
    title: {
      text: "Portfolio Composition",
    },
    series: [
      {
        type: "pie",
        angleKey: "amount",
        legendItemKey: "asset",
      },
    ],
  };

  const options3: any = {
    data: [
      { asset: "Stocks", amount: 60000 },
      { asset: "Bonds", amount: 40000 },
      { asset: "Cash", amount: 7000 },
      { asset: "Real Estate", amount: 5000 },
      { asset: "Commodities", amount: 3000 },
    ],
    title: {
      text: "Portfolio Composition",
    },
    series: [
      {
        type: "donut",
        calloutLabelKey: "asset",
        angleKey: "amount",
      },
    ],
  };

  const options4: any = {
    title: {
      text: "Annual Fuel Expenditure",
    },
    data: [
      {
        quarter: "Q1",
        petrol: 200,
        diesel: 100,
      },
      {
        quarter: "Q2",
        petrol: 300,
        diesel: 130,
      },
      {
        quarter: "Q3",
        petrol: 350,
        diesel: 160,
      },
      {
        quarter: "Q4",
        petrol: 400,
        diesel: 200,
      },
    ],
    series: [
      {
        type: "line",
        xKey: "quarter",
        yKey: "petrol",
        yName: "Petrol",
      },
      {
        type: "line",
        xKey: "quarter",
        yKey: "diesel",
        yName: "Diesel",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-[14px]">
      <div className="flex gap-4 w-full">
        <Card className="flex-1 items-center justify-center !m-0 !p-0 !rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div>Nro. Vacas</div>
            <div className="font-bold">100</div>
          </div>
        </Card>
        <Card className="flex-1 items-center justify-center !m-0 !p-0 !rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div>Nro. Toros</div>
            <div className="font-bold">200</div>
          </div>
        </Card>
        <Card className="flex-1 items-center justify-center !m-0 !p-0 !rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div>Nro. Ventas</div>
            <div className="font-bold">300</div>
          </div>
        </Card>
      </div>
      <div className="flex gap-4 w-full">
        <Card className="flex-1 items-center justify-center !m-0 !p-0 !rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div>% Vacas Preñadas</div>
            <div className="font-bold">30%</div>
          </div>
        </Card>
        <Card className="flex-2 items-center justify-center !m-0 !p-0 !rounded-sm">
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <table className="w-1/2">
              <thead>
                <tr>
                  <th className="text-left">Raza</th>
                  <th className="text-right">Nro. Vacas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Holando</td>
                  <td className="text-right">50</td>
                </tr>
                <tr>
                  <td>Jersey</td>
                  <td className="text-right">30</td>
                </tr>
                <tr>
                  <td>Angus</td>
                  <td className="text-right">20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="flex gap-4 w-full">
        <AgCharts className="flex-2" options={options1} />
      </div>
      <div className="flex gap-4 w-full">
        <AgCharts className="flex-1" options={options2} />
        <AgCharts className="flex-1" options={options3} />
      </div>
      <div className="flex gap-4 w-full">
        <AgCharts className="flex-2" options={options4} />
      </div>
    </div>
  );
};

export default Dashboard;
