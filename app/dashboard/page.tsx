"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutDashboard,User, Book, X, Check,Loader2  } from "lucide-react";
 import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis, 
  // CartesianGrid,
  LabelList,
} from "recharts";
 
type Duty = {
  bookingId: string;
  date: string;
  service_type?: string;
  jobStatusName?: string;
  agent?: string;
  client?: string;
  pickupLocation?: string;
  dropLocation?: string;
  vehicleType?: string;
  vehicleId?: string;
  driverId?: string;
  driverPhone?: string;
  registrationNumber?: string;
  driverName: string | null;
  guideName?: string | null;
  guide_ids?: string | null;
  guide_phone?: string | null;
};

type LocationItem = {
  name: string;
  value: number;
};

type VehicleItem = {
  vehicle: string;
  trips: number;
};

type TopVehicle = {
  vehicleId: string;
  vehicle: string;
  type?: string;
  jobs: number;
};

type TopDriver = {
  driverId: string;
  name: string;
  phone?: string;
  jobs: number;
};

type TopGuide = {
  guideId: string;
  name: string;
  phone?: string;
  jobs: number;
};

export default function DashboardPage() {
  // const [filters, setFilters] = useState({ from: "", to: "" });
  const [data, setData] = useState<Duty[]>([]); // full dataset
  const [filteredData, setFilteredData] = useState<Duty[]>([]); // filtered dataset
  const [loading, setLoading] = useState(false);
  // const [openModal, setOpenModal] = useState(false);

// const isRTL =
//   typeof document !== "undefined" &&
//   document.documentElement.dir === "rtl";


const [isRTL, setIsRTL] = useState(false);

useEffect(() => {
  const check = () => {
    setIsRTL(document.documentElement.dir === "rtl");
  };

  check();

  const observer = new MutationObserver(check);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dir"],
  });

  return () => observer.disconnect();
}, []);



  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/duties`);
        const result = await res.json();
        console.log("RAW API RESULT:", result); 
        const sorted = (result || []).sort(
          (a: Duty, b: Duty) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sorted);
        const lastMonthData = getLast30DaysData(sorted);
        setFilteredData(lastMonthData);  
      } catch (err) {
        console.error(err);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Handle search
const handleSearch = () => {
  setLoading(true);

  setTimeout(() => {
    if (!filters.from && !filters.to) {
      setFilteredData(getLast30DaysData(data));
      setLoading(false);
      return;
    }

    const fromDate = filters.from
      ? new Date(filters.from)
      : new Date("1970-01-01");

    const toDate = filters.to
      ? new Date(filters.to)
      : new Date();

    const filtered = data.filter((d) => {
      const dDate = new Date(d.date);
      return dDate >= fromDate && dDate <= toDate;
    });

    setFilteredData(filtered);
    setLoading(false);
  }, 300); // small delay to show loading effect
};

const getDefaultDates = () => {
  const today = new Date();
  const lastMonth = new Date();

  lastMonth.setDate(today.getDate() - 30);

  const format = (d: Date) => d.toISOString().split("T")[0];

  return {
    from: format(lastMonth),
    to: format(today),
  };
};


const [filters, setFilters] = useState(getDefaultDates());


const total = filteredData.length || 1;

const driverRequired =
  filteredData.filter(d => !d.driverName || d.driverName?.toUpperCase() === "NA").length;

const guideRequired =
  filteredData.filter(d => !d.guideName || d.guideName?.toUpperCase() === "NA").length;

const cancelled =
  filteredData.filter(d => d.jobStatusName?.toLowerCase() === "cancelled").length;

const completed =
  filteredData.filter(d => d.jobStatusName?.toLowerCase() === "completed").length;

const summaryCards = [
  {
    title: "Driver Required",
    count: driverRequired,
    percent: (driverRequired / total) * 100,
    color: "bg-blue-500",
    icon: User,
  },
  {
    title: "Guide Required",
    count: guideRequired,
    percent: (guideRequired / total) * 100,
    color: "bg-orange-500",
    icon: Book,
  },
  {
    title: "Cancelled",
    count: cancelled,
    percent: (cancelled / total) * 100,
    color: "bg-red-500",
    icon: X,
  },
  {
    title: "Completed",
    count: completed,
    percent: (completed / total) * 100,
    color: "bg-green-500",
    icon: Check,
  },
];

const COLORS = [
  "#6096ec", // blue
  "#5befbe", // green
  "#f7bc58", // yellow
  "#ee5252", // red
  "#8154ec", // purple
  "#50d5ec", // cyan
  "#f39451", // orange
  "#b9f75b", // lime
];

const locationData: LocationItem[] = Object.values(
  filteredData.reduce((acc: Record<string, LocationItem>, curr) => {
    const key = curr.pickupLocation || "Unknown";

    if (!acc[key]) {
      acc[key] = { name: key, value: 0 };
    }

    acc[key].value += 1;
    return acc;
  }, {})
);

const locationTotal = locationData.reduce(
  (sum: number, item: LocationItem) => sum + item.value,
  0
);




const vehicleData: VehicleItem[] = Object.values(
  filteredData.reduce((acc: Record<string, VehicleItem>, curr) => {
    const reg = curr.registrationNumber;
    if (!reg) return acc;

    if (!acc[reg]) {
      acc[reg] = { vehicle: reg, trips: 0 };
    }

    acc[reg].trips += 1;

    return acc;
  }, {})
)
// .sort((a, b) => b.trips - a.trips)
  .slice(0, 5); // show only top 10;

const totalTrips = vehicleData.reduce((sum, v) => sum + v.trips, 0);

const vehicleDataWithPercent = vehicleData.map((v) => ({
  ...v,
  percent: totalTrips ? Math.round((v.trips / totalTrips) * 100) : 0,
}));

const recentData = [...filteredData]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

const getLast30DaysData = (data: Duty[]) => {
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(now.getDate() - 30);

  return data.filter((d) => {
    const dDate = new Date(d.date);
    return dDate >= lastMonth && dDate <= now;
  });
};

const getBarColor = (percent: number) => {
  if (percent >= 80) return "#16a34a"; // green (high usage)
  if (percent >= 60) return "#22c55e";
  if (percent >= 40) return "#eab308"; // yellow
  if (percent >= 20) return "#f97316"; // orange
  return "#ef4444"; // red (low usage)
};

const cardColors = {
  drivers: "#da1709",
  vehicles: "#22998f",
  guides: "#186144",
};

const topVehicles: TopVehicle[] = Object.values(
  filteredData.reduce<Record<string, TopVehicle>>((acc, curr) => {
    const id = curr.vehicleId;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        vehicleId: id,
        vehicle: curr.registrationNumber ?? "-",
        type: curr.vehicleType,
        jobs: 0,
      };
    }

    acc[id].jobs += 1;
    return acc;
  }, {})
)
.sort((a, b) => b.jobs - a.jobs)
.slice(0, 4);

const topDrivers: TopDriver[] = Object.values(
  filteredData.reduce<Record<string, TopDriver>>((acc, curr) => {
    const id = curr.driverId;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        driverId: id,
        name: curr.driverName ?? "-",
        phone: curr.driverPhone ?? "-",
        jobs: 0,
      };
    }

    acc[id].jobs += 1;
    return acc;
  }, {})
)
.sort((a, b) => b.jobs - a.jobs)
.slice(0, 4);


const topGuides: TopGuide[] = Object.values(
  filteredData.reduce<Record<string, TopGuide>>((acc, curr) => {
    if (!curr.guide_ids) return acc;

const ids = (curr.guide_ids ?? "").split(",").filter(Boolean);
const names = (curr.guideName ?? "").split(",");
const phones = (curr.guide_phone ?? "").split(",");

    ids.forEach((id, index) => {
      const key = id.trim();
      if (!key) return;

      if (!acc[key]) {
        acc[key] = {
          guideId: key,
          name: names[index]?.trim() || "-",
          phone: phones[index]?.trim() || "-",
          jobs: 0,
        };
      }

      acc[key].jobs += 1;
    });

    return acc;
  }, {})
)
.sort((a, b) => b.jobs - a.jobs)
.slice(0, 4);

const chartData = isRTL
  ? [...vehicleDataWithPercent].reverse()
  : vehicleDataWithPercent;

const displayData = isRTL ? [...chartData].reverse() : chartData;


  return (
    <div className="p-6 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center gap-3 mt-8 mb-8">
        <LayoutDashboard size={24} />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label>From</label>
              <Input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="w-60"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>To</label>
              <Input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="w-60"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="h-10 flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Loading..." : "Search"}
            </Button>
            <Button className="h-10"
              onClick={() => {
                const defaults = getDefaultDates();
                setFilters(defaults);
                setFilteredData(getLast30DaysData(data));
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ------------------- SUMMARY BOXES ------------------- */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[100px] rounded-xl bg-gray-200 dark:bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            const radius = 28;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - card.percent / 100);

return (
  <div
    key={i}
    dir={isRTL ? "rtl" : "ltr"}
    className={`
      relative flex items-center gap-4 p-5 rounded-xl shadow-md text-white ${card.color}
    `}
  >
    {/* Circle */}
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 rotate-[-90deg]">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {Math.round(card.percent)}%
      </div>
    </div>

    {/* Text */}
    <div className="flex flex-col">
      <p className="text-sm opacity-90">{card.title}</p>
      <p className="text-2xl font-bold">{card.count}</p>
    </div>

    {/* Icon */}
    <div className="absolute top-3 end-3 opacity-80">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);
          })}
        </div>
      )}
      
      {/* Pie Chart Card */}
      <Card className="w-full mb-5">
        <CardHeader>
          <CardTitle>Pickup Location Chart</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="w-full h-[350px] flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            ) : (
              <div dir={isRTL ? "rtl" : "ltr"} className="w-full h-full">

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                   <Pie
                  data={locationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  startAngle={isRTL ? 90 : -270}
                  endAngle={isRTL ? -270 : 90}
                  labelLine={true}
                  label={({
                  cx = 0,
                  cy = 0,
                  midAngle = 0,
                  outerRadius = 0,
                  percent = 0,
                }) => {
                  if (percent < 0.05) return null;

                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;

                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#555"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {(percent * 100).toFixed(0)}%
                    </text>
                  );
                }}
                >
                      {locationData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        direction: isRTL ? "rtl" : "ltr",
                        textAlign: isRTL ? "right" : "left",
                      }}
                      formatter={(value: any, name: any) => {
                        const percent =
                          locationTotal > 0
                            ? ((value / locationTotal) * 100).toFixed(0)
                            : "0";

                        return [`${name} ${percent}% (${value})`];
                      }}
                    />

                    <Legend
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        direction: "ltr",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>

              </div>
            )}
          </div>
        </CardContent>
        
      </Card>

      {/* 10 recent activities and vehicle utilization*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ---------------- RECENT ACTIVITIES ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Recent Activities</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-auto max-h-[350px]">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-zinc-800 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Sr No</th>
                    <th className="p-2 text-left">Activity</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4].map((j) => (
                          <td key={j} className="p-2">
                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentData.length > 0 ? (
                    recentData.map((row, index) => {
                      const isAllocated = row.driverName || row.guideName;

                      return (
                        <tr
                          key={`${row.bookingId}-${index}`}
                          className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                          <td className="p-2">{index + 1}</td>

                          <td className="p-2">
                            {`${row.service_type || "-"} from ${
                              row.pickupLocation || "-"
                            } to ${row.dropLocation || "-"}`}
                          </td>

                          <td className="p-2">
                            {!isAllocated ? (
                              <span className="text-red-500 text-sm font-medium">
                                Not Allocated
                              </span>
                            ) : (
                              <span className="text-green-500 text-sm font-medium">
                                Allocated
                              </span>
                            )}
                          </td>

                          <td className="p-2">
                            <Link href={`/dashboard/Management/duty-chart/allocate/${row.bookingId}`}>
                              <button className="border px-2 py-1 rounded text-sm">
                                {!isAllocated ? "Allocate" : "Modify"}
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-gray-500">
                        No recent activities
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- >Inhouse Vehicle Utilization ---------------- */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className={isRTL ? "text-right" : "text-left"}>
              Inhouse Vehicle Utilization
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[350px] w-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              ) : (
                <div dir={isRTL ? "rtl" : "ltr"} className="w-full h-full">

                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData}>

                  <XAxis
                    dataKey="vehicle"
                    angle={-30}
                    interval={0}
                    height={70}
                    reversed={isRTL}
                    tickMargin={isRTL ? 50 : 8}
                    tick={(props: any) => {
                      const { x, y, payload } = props;

                      const shift = isRTL ? 65 : 10;

                      const xPos = Number(x);
                      const yPos = Number(y);

                      return (
                        <text
                          x={xPos - shift}
                          y={yPos}
                          dy={16}
                          textAnchor="end"
                          fill="#666"
                          transform={`rotate(-30 ${xPos - shift} ${yPos})`}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tickFormatter={(t) => `${t}%`}
                    orientation={isRTL ? "right" : "left"}
                    tickMargin={isRTL ? 37 : 10}
                  />

                      <Tooltip
                        contentStyle={{
                          textAlign: isRTL ? "right" : "left",
                          direction: isRTL ? "rtl" : "ltr",
                        }}
                        formatter={(value, _name, props) => [
                          `${value}% (${props.payload.trips})`,
                          "Usage",
                        ]}
                      />

                      <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={getBarColor(Number(entry.percent))}
                          />
                        ))}

                        <LabelList
                          dataKey="percent"
                          position="inside"
                          fill="#fff"
                          formatter={(v) => `${v}%`}
                        />
                      </Bar>

                    </BarChart>
                  </ResponsiveContainer>

                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ------------------- TOP 5 UTILIZATION CARDS ------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
        {/* ------------------- TOP 5 DRIVERS ------------------- */}
        <Card    style={{ backgroundColor: cardColors.drivers }} className="text-white shadow-lg h-[400px] ">
        <CardHeader className="pb-3 border-b border-muted/20">
          <CardTitle className="text-base font-semibold">
            Top Utilized Drivers
          </CardTitle>
        </CardHeader>
            <CardContent className="p-0">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="text-start font-semibold p-3">NAME</th>
                  <th className="text-start font-semibold p-3">PHONE NO</th>
                  <th className="text-end font-semibold p-3">TARGET JOBS</th>
                </tr>
              </thead>
              <tbody>
                {topDrivers.map((d) => (
                  <tr
                    key={d.driverId}
                    className="hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    <td className="text-start p-3">{d.name}</td>
                    <td className="text-start p-3">{d.phone}</td>
                        <td className="p-3 text-end">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-medium">
                              {d.jobs}
                            </span>
                          </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ------------------- TOP 5 VEHICLES ------------------- */}
        <Card  style={{ backgroundColor: cardColors.vehicles }} className="text-white shadow-lg h-[400px]">
        <CardHeader className="pb-3 border-b border-muted/20">
          <CardTitle className="text-base font-semibold">
            Top Utilized Vehicles
          </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="text-start font-semibold p-3">VEHICLE NO</th>
                  <th className="text-start font-semibold p-3">VEHICLE TYPE</th>
                  <th className="text-end font-semibold p-3">TARGET JOBS</th>
                </tr>
              </thead>
              <tbody>
                {topVehicles.map((v) => (
                  <tr
                    key={v.vehicleId}
                    className="hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    <td className="text-start p-3">{v.vehicle}</td>
                    <td className="text-start p-3">{v.type || "-"}</td>
                    {/* <td className="p-3 text-end font-medium">{v.jobs}</td> */}
                    <td className="p-3 text-end">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-medium">
                              {v.jobs}
                            </span>
                          </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ------------------- TOP 5 GUIDES ------------------- */}
        <Card style={{ backgroundColor: cardColors.guides }} className="text-white shadow-lg h-[400px]">
        <CardHeader className="pb-3 border-b border-muted/20">
          <CardTitle className="text-base font-semibold">
              Top Utilized Guides</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="text-start font-semibold p-3">NAME</th>
                  <th className="text-start font-semibold p-3">MOBILE NO</th>
                  <th className="text-end font-semibold p-3">TARGET JOBS</th>
                </tr>
              </thead>
              <tbody>
                {topGuides.map((g) => (
                  <tr
                    key={g.guideId}
                    className="hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    <td className="p-3">{g.name}</td>
                    <td className="p-3">{g.phone}</td>
                    {/* <td className="p-3 text-end font-medium">{g.jobs}</td> */}
                    <td className="p-3 text-end">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-medium">
                              {g.jobs}
                            </span>
                          </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}