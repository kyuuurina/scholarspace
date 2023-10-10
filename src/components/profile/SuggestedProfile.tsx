import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface SuggestedProfileProps {
    size: string;
    url: string;
    editable: boolean;
    onChange: (url: string) => void;
}
