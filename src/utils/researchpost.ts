//Step 2

// import { api } from "./api";
// import { useRouterId } from "./routerId";
// import { postRouter } from "~/server/api/routers/researchpost";

// type ResearchPost = {
//   category: "Article" | "Conference_Paper" | "Presentation" | "Preprint" | "Research_Proposal" | "Thesis" | "Others";
//   title: string;
//   author: string;
//   description: string | null;
//   document: string | null;
// }

// export const useFetchResearchPost= () => {
//   const id: string = useRouterId();

//   const post = api.post.get.useQuery(
//   {
//     post_id: id,
//   },
//   {
//     enabled: !!id,
//   }
// );

// // Destructure with type annotation
// const {
//   category,
//   title,
//   description,
//   document,
//   author,
// }: ResearchPost = post.data || {};

//   let imgUrl = "";
//   if (document) {
//     imgUrl = document
//   ? `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`
//   : '';

//   }

//   const { isLoading, error }: { isLoading: boolean; error: any } = post;


//   return {
//     category,
//     title,
//     description,
//     document,
//     imgUrl,
//     isLoading,
//     error,
//   };
// };






// import { api } from "./api";
// import { useRouterId } from "./routerId";
// import { postRouter } from "~/server/api/routers/researchpost";

// type ResearchPost = {
//   category: string;
//   title: string;
//   author: string;
//   description: string | null;
//   document: string | null;
// };

// export const useCreateResearchPost = () => {
//   const id: string = useRouterId();

//   const researchpost = api.researchpost.get.useQuery(
//     {
//       post_id: id,
//     },
//     {
//       enabled: !!id,
//     }
//   );

//   const {  category, title, author, description, document } =
//     researchpost.data || {};

//   const { isLoading, error } = researchpost;

//   let imgUrl = "";
//   if (document) {
//     imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`;
//   }

//   return {
//     category,
//     title,
//     author,
//     description,
//     document,
//     isLoading,
//     error,
//     imgUrl,
//   };

//   return {
//     error,
//     isLoading,
//   };
// };
  
// };





