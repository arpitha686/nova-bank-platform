
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon, change }: StatsCardProps) => {
  return (
    <Card className="stats-card">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <p className={`text-xs mt-1 ${change.positive ? 'text-banking-green' : 'text-banking-red'}`}>
                {change.positive ? '↑' : '↓'} {change.value}
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
