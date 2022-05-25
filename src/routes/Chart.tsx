import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from 'react-apexcharts'

interface ChartProps {
    coinId: string|undefined;
}

interface IHistoryData {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

function Chart({coinId}:ChartProps) {
    const {isLoading, data} = useQuery<IHistoryData[]>(['history', coinId], () => fetchCoinHistory(coinId));
    return (
       <div>
           {isLoading ? "loading chart..." : (
               <ApexChart
                type="line"
                options={{
                    chart: {
                        width: 500,
                        height: 500,
                        toolbar: {
                            show: false
                        }
                    },
                    grid: {
                        show: false
                    },
                    xaxis: {
                        type: "datetime",
                        labels: {
                            show: false,
                        },
                        categories: data?.map(d => d.time_close)
                    },
                    yaxis: {
                        show: false
                    },
                    stroke: {
                        curve: "smooth"
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            gradientToColors: ["#55efc4"],
                            stops: [0, 100],
                        },
                    },
                    colors: ["#74b9ff"],
                    tooltip: {
                        y: {
                            formatter: (x) => x.toFixed(2)
                        }
                    }
                }}
                series={[
                    {
                        name: "Price",
                        data: data?.map(d => d.close) ?? []
                    }
                ]}
               />
           )}
       </div>
    )
}

export default Chart;