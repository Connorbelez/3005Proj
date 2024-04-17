import { LoginForm } from '../components/register';
import { LoginForm as RegisterForm} from '../components/login';


// import  { DataTable }  from './components/DataTable';
//
// import { member as Member} from "@/db/types";
// import { memberColumns } from './components/membersColumns';
// import { getAllMembers } from '../api/members/route';
// // Simulating an API call
// const fetchMembers = async (): Promise<Member[]> => {
//   const mems:Member[] = await getAllMembers();
//   return mems;
// };
//
export default async function Page() {
  return (
    <div className="flex flex-col space-y-8 w-full mt-10 justify-center align-middle h-full ">
      <RegisterForm/>
      <LoginForm/>
    </div>

  )

};

