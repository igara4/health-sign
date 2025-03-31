import EditLogPageClient from "./EditLogPageClient"

const EditPage = ({params}:{params:{id:string}}) => {
  return <EditLogPageClient logId={params.id}/>
}

export default EditPage