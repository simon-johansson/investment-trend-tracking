import React, { useEffect, useState } from "react";
import Client, { BaseURL, Environment, fund, Local } from "./encore-client";

function App() {
  const [fundListResponse, setFundListResponse] =
    useState<fund.ListResponse | null>(null);

  useEffect(() => {
    const fn = async () => {
      const fetch = window.fetch.bind(window);
      const target: BaseURL =
        window.location.hostname === "localhost"
          ? Local
          : Environment("staging");
      const client = new Client(target, { fetcher: fetch });
      const response = await client.fund.GetTrendTrackingData();
      setFundListResponse(response);
    };
    fn();
  }, []);

  const getFormattedFloat = (num: number) => {
    const pow = Math.pow(10, 1);
    return Math.round(num * pow) / pow;
  };

  const getCellWithTrendIndicator = (data: number) => {
    const className = data > 0 ? "trending-up" : "trending-down";
    return (
      <td className={`table-cell ${className}`}>{getFormattedFloat(data)}</td>
    );
  };

  return (
    <div className="block m-6 shadow-lg">
      <table className="relative top-0 w-full border-spacing-0 border-separate table-auto">
        <thead className="p-1.5 uppercase text-xs font-bold">
          <tr>
            <th className="table-cell border-b">NAMN</th>
            <th className="table-cell border-b">AVGIFT</th>
            <th className="table-cell border-b">KVARTAL</th>
            <th className="table-cell border-b">HALVÅR</th>
            <th className="table-cell border-b">ÅR</th>
            <th className="table-cell border-b">SNITT</th>
            <th className="table-cell border-b">RANK</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {fundListResponse &&
            fundListResponse.funds.map((fund, index) => {
              return (
                <tr
                  className="odd:bg-[#f7f7f7] hover:bg-[#f2fcf8]"
                  key={fund.id}
                >
                  <td className="table-cell">
                    <a
                      className="no-underline text-[#206bc4ff] hover:text-[#154782]"
                      href={fund.link}
                      target="_blank"
                    >
                      {fund.data.name}
                    </a>
                  </td>
                  <td className="table-cell">{fund.data.productFee}</td>
                  {getCellWithTrendIndicator(fund.data.developmentThreeMonths)}
                  {getCellWithTrendIndicator(fund.data.developmentSixMonths)}
                  {getCellWithTrendIndicator(fund.data.developmentOneYear)}
                  {getCellWithTrendIndicator(fund.compositePriceTrend)}
                  <td className="table-cell">{index + 1}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
