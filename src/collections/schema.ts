import * as yup from 'yup'


type Hero = {
  header: string;
  title: string;
  subtitle: string;
  logo: string; // web app logo
  apptitle: string;
};

interface Services {
  icon: string; //url to the logo or image : we can use manual for now
  title: string;
  text: string;
  key: string; // for mmatching logos until we can upload ours dynamic
}

export interface Project {
    id: string;
    title: string;
    client: string;
    category: string;
    description: string;
    link: string;
    Image: string;
}

interface Reviews {
  userName: string;
  rating: number; //out of 5
  comment: string;
  profileImage: string; // same logic as above
}

interface Team {
  profileImage: string; // same logic as above
  fullName: string;
  role: string;
  responsibility: string;
  socials: Socials[];
}

type Socials = {
  type: "Facebook" | "Twitter" | "Github" | "Linkdin" | "Insatgram";
  url: string;
};

interface ContactDetails {
  location: string;
  phoneNo: string;
  email: string;
}

import { Timestamp } from "firebase/firestore";

// export interface Admin {
//   id?: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: any;
//   role: "superadmin" | "admin" | "editor";
//   isActive: boolean;
//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
// }

export let userSchema = yup.object({
  name: yup.string().required('Name is required').max(25).matches(/^[A-Za-z]+$/, "numbers are not allowed"),
  email: yup.string().email('email is required'),
  age: yup.number().max(100),

})
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "libs"; // Your firebase config

export interface Admin {
  adminId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive?: boolean;
  createdAt?: any;
  createdBy?: string | null;
  lastLogin?: any;
}

import { useEffect, useState } from "react";


export interface Admin {
    adminId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    isActive?: boolean;
    createdAt?: any;
    createdBy?: string | null;
    lastLogin?: any;
}

export const useAdmins = () => {
    const [data, setData] = useState<Admin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setIsLoading(true);
                const adminsRef = collection(db, "admins");
                const snapshot = await getDocs(adminsRef);
                
                const admins: Admin[] = [];
                snapshot.forEach((doc) => {
                    admins.push({
                        adminId: doc.id,
                        ...doc.data(),
                    } as Admin);
                });
                
                setData(admins);
                setError(null);
            } catch (err) {
                setError(err as Error);
                console.error("Error fetching admins:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return { data, isLoading, error };
};