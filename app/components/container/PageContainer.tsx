"use client";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="p-6 space-y-6">{children}</div>;
};

export default PageContainer;