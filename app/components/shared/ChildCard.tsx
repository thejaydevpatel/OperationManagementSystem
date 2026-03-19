"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChildCardProps {
  title?: string;
  children: React.ReactNode;
}

const ChildCard = ({ title, children }: ChildCardProps) => {
  return (
    <Card className="shadow-md rounded-xl">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};

export default ChildCard;