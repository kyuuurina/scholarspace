//Display owner profile information in a card

import React from "react";
import useState from "react";
import useForm from "react-hook-form";
import { useRouter } from "next/router";
import { type ZodType, z, set} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";

//types
import type { ProfileFormData } from "~/types/profile";

// local components
import FormErrorMessage from "../FormErrorMessage";
import PrimaryButton from "../button/PrimaryButton";


