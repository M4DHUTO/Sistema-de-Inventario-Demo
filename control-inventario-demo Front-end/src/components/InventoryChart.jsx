import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

export function InventoryChart({ products }) {
  // Aggregate inventory by category
  const data = useMemo(() => {
    if (!products || !products.length) return [];

    const categoryMap = {};
    products.forEach(p => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = { name: p.category, value: 0, totalStock: 0 };
      }
      categoryMap[p.category].value += p.price * p.stock;
      categoryMap[p.category].totalStock += p.stock;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  }, [products]);

  // Single accent palette variation (Blue scale + neutral zinc)
  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#A1A1AA'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-[#E5E7EB] rounded-md p-2.5 shadow-sm text-xs space-y-1">
          <p className="font-medium text-primary">{item.name}</p>
          <div className="text-secondary flex items-center gap-2">
            <span>Valor total:</span>
            <span className="font-medium text-primary tabular-nums">
              {formatCurrency(item.value)}
            </span>
          </div>
          <div className="text-secondary flex items-center gap-2">
            <span>Unidades:</span>
            <span className="font-medium text-primary tabular-nums">
              {item.totalStock} uds
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-md p-4 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-primary">
          Distribución del valor por categoría
        </h3>
        <span className="text-[12px] text-secondary tabular-nums">
          {data.length} categorías
        </span>
      </div>

      <div className="w-full h-[220px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-secondary">
            No hay datos de categoría disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[12px] text-secondary font-medium mr-2">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
