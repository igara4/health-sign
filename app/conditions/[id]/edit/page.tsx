import EditLogPageClient from "./EditLogPageClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

const EditPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return <EditLogPageClient logId={id} />;
};

export default EditPage;
