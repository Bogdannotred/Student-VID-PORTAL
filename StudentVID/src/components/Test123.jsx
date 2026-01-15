import { useState } from "react";
import { toast }  from 'react-toastify'
import { supabase } from "../lib/supabaseClient";

export default function Test123() {

    const [test , setTest] = useState("");

        const handle = async ()  => {

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('Documents')
            .createSignedUrl("profile_photos/b232622d-7ad3-444a-ac50-be996edbbe3b/avatar.jpg", 3600);
            console.log(signedUrlData)
        }

    return(
        <button onClick={handle}>
            
        </button>
    );
}
