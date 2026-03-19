"use client";

// import Main from "@/app/components/location-lookup/location-master/main";
import { useParams } from "next/navigation";

const BCrumb = [
  {
    to: "/",
    title: "Location Lookup",
  },
  {
    title: "List",
  },
];

const ListPage = () => {
  const params = useParams();
  const id = params.id;

  const objModule: ModuleDetailsString = {
    moduleId: 1,
    keyWord: "location_master",
    subkeyWord: "location_lookup",
    serviceId: getStringFromParam(id),
    endPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    subDirectoryEndPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    tableEndPoint: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/location-lookup/location-master`,
    isNew: false,
    isListView: true,
  };

  return (
    <PageContainer
      title={`Manage ${objModule.subkeyWord}`}
      description={`Manage ${objModule.subkeyWord}`}
    >
      <Breadcrumb title={`Manage ${objModule.subkeyWord}`} items={BCrumb} />

      <Main module={objModule} />
    </PageContainer>
  );
};

export default ListPage;
