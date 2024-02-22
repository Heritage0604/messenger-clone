import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { FullConversationType } from '@/app/types'
export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const conversations:any = await getConversations();
  const users = await getUsers();

  return (
    
    <Sidebar>
      <div className="h-full">
        <ConversationList 
          users={users} 
          // title="Messages" 
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}