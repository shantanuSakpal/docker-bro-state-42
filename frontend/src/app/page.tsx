import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "DockerWeb",
  description:
    "This is Next.js Tables page for DockerWeb - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Home" />

      <div className="flex flex-col gap-10">
        <TableOne />

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
