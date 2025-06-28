import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import instance from "../../axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2563EB", "#F87171"]; // Blue (Recyclable), Red (Non-Recyclable)
const CO2_COLOR = "#4F46E5"; // Indigo
const BOX_COLOR = "#22C55E"; // Green
const LABEL_COLOR = "#FBBF24"; // Yellow

const Summary = () => {
  const [recyclableData, setRecyclableData] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const [boxUsage, setBoxUsage] = useState([]);
  const [labelUsage, setLabelUsage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, labelsRes] = await Promise.all([
          instance.get("/orders"),
          instance.get("/labels"),
        ]);

        const orders = ordersRes.data;
        const labels = labelsRes.data;

        // Create map of labelId -> label
        const labelIdMap = {};
        labels.forEach((label) => {
          labelIdMap[label._id] = label;
        });

        // Recyclable Pie Chart
        const avgRecyclable =
          orders.reduce((sum, o) => sum + o.recyclablePercentage, 0) / orders.length;
        const avgNonRecyclable =
          orders.reduce((sum, o) => sum + o.nonRecyclablePercentage, 0) / orders.length;
        setRecyclableData([
          { name: "Recyclable", value: avgRecyclable },
          { name: "Non-Recyclable", value: avgNonRecyclable },
        ]);

        // CO2
        setCo2Data(
          orders.map((o, idx) => ({
            name: `Order ${idx + 1}`,
            co2: o.estimatedCO2Emitted,
          }))
        );

        // Box Usage
        const boxCount = {};
        orders.forEach((o) => {
          boxCount[o.boxId] = (boxCount[o.boxId] || 0) + 1;
        });
        setBoxUsage(
          Object.entries(boxCount).map(([id, count]) => ({
            name: `Box ${id}`,
            count,
          }))
        );

        // Label Usage
        const labelCount = {};
        orders.forEach((o) => {
          o.labelsApplied.forEach((labelId) => {
            const label = labelIdMap[labelId];
            if (!label) return;

            const iconURL = `${import.meta.env.VITE_ASSET_URL}${label.icon}`;
            if (!labelCount[iconURL]) {
              labelCount[iconURL] = {
                icon: iconURL,
                name: label.name,
                count: 1,
              };
            } else {
              labelCount[iconURL].count += 1;
            }
          });
        });

        setLabelUsage(Object.values(labelCount));
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // 🏷️ Custom Icon + Name Tick
  const IconTick = ({ x, y, payload }) => {
    const label = labelUsage.find((l) => l.icon === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <image
          href={payload.value}
          x={-12}
          y={5}
          height={24}
          width={24}
          preserveAspectRatio="xMidYMid slice"
        />
        <text x={0} y={34} textAnchor="middle" fontSize={10} fill="#4B5563">
          {label?.name || ""}
        </text>
      </g>
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📦 Order Summary & Sustainability Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ♻️ Recyclability Ratio */}
          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              ♻️ Recyclability Ratio
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recyclableData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                >
                  {recyclableData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🌍 CO2 Emissions */}
          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              🌍 CO₂ Emissions per Order
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={co2Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="co2" fill={CO2_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 📦 Box Usage */}
          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              📦 Box Usage Frequency
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={boxUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={BOX_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🏷️ Label Usage */}
          <div className="bg-white shadow-md rounded-xl p-6 border">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              🏷️ Label Application Frequency
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={labelUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="icon"
                  tick={<IconTick />}
                  interval={0}
                  height={60}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value}`, "Usage Count"]}
                  labelFormatter={(label) => {
                    const found = labelUsage.find((l) => l.icon === label);
                    return found?.name || "Unknown Label";
                  }}
                />
                <Bar dataKey="count" fill={LABEL_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
