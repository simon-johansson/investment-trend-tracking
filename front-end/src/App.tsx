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
    return <td className={className}>{getFormattedFloat(data)}</td>;
  };

  return (
    <div className="tableWrapper">
      <table>
        <thead>
          <tr>
            <th>NAMN</th>
            <th>AVGIFT</th>
            <th>KVARTAL</th>
            <th>HALVÅR</th>
            <th>ÅR</th>
            <th>SNITT</th>
            <th>RANK</th>
          </tr>
        </thead>
        <tbody>
          {fundListResponse &&
            fundListResponse.funds.map((fund, index) => {
              return (
                <tr key={fund.id}>
                  <td>
                    <a href={fund.link} target="_blank">
                      {fund.data.name}
                    </a>
                  </td>
                  <td>{fund.data.productFee}</td>
                  {getCellWithTrendIndicator(fund.data.developmentThreeMonths)}
                  {getCellWithTrendIndicator(fund.data.developmentSixMonths)}
                  {getCellWithTrendIndicator(fund.data.developmentOneYear)}
                  {getCellWithTrendIndicator(fund.compositePriceTrend)}
                  <td>{index + 1}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
