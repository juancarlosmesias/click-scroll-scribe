import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { development } from "@/environments/development";

const HeatmapViewData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${development.api_url}/heatmap/list`);
        if (!res.ok) throw new Error("Error fetching data");
        const json = await res.json();
        setData(json.data.heatmaps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadJSON = (record: any) => {
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `record-${record.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-gray-500">Error...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registers</h1>
      <ul className="space-y-4">
        {data.map((record: any) => (
          <li
            key={record.id}
            className="max-w-[600px] p-4 border rounded-xl shadow-sm bg-white flex flex-col"
          >
            <pre className="bg-gray-200 p-4 rounded overflow-auto max-h-96 text-sm mb-4">
              {JSON.stringify(data, null, 2)}
            </pre>

            <button
              onClick={() => downloadJSON(record)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Download JSON
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeatmapViewData;
