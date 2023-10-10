import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

//components
import Layout from "~/components/layout/Layout";
import { Head } from "~/components/layout/Head";