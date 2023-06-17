import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Select from "react-select";
import { api } from "~/utils/api";

import { useForm } from "react-hook-form";
import EditableDropDown from "~/components/EditableDropDown";

import { useRouter } from "next/router";

import React from 'react';

//submit form - submitselectedUser
const Home = () => {
    const [selectedUser, setSelectedUser] = useState<{
        label: string;
        value: string;
      } | null>(null);
    
      const users = api.account.getAllUsers.useQuery();
      const userArray: { label: string; value: string }[] = [];
    
      if (users.data) {
        users.data.forEach((user) => {
          const firstEmailAddress = user.emailAddresses[0]?.emailAddress || "";
          const userId = user.id;
          userArray.push({ label: firstEmailAddress, value: userId });
        });
      }
    
  return (
    <div className="mx-auto max-w-md">
      <div className="relative mt-4">
      <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedUser}
              isSearchable={true}
              options={userArray}
              onChange={(choice) => setSelectedUser(choice)}
              isClearable={true}
            />
        <button
          type="submit"
          className="absolute right-0 top-1 mt-5 mr-4"
        >
         
        </button>
      </div>
    </div>
  );
};

export default Home;
