import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);

  return (
    <pre>
      {
        JSON.stringify({}, undefined, 2)
      }
    </pre>
  );
}
