export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  gender: string;
  maritalStatus?: string;
  religion?: string;
  highestDegree?: string;
  languages?: string | string[];
  technicalSkills?: string | string[];
  softSkills?: string | string[];
  companyName: string;
  companyaddress: string;
  companydescription: string;
  institutionName: string;
  graduationYear: number;
  fieldOfStudy: string;
  bio: string;
  role: string;
  startDate:Date | string;
  endDate?: Date | string;
  isCurrent: boolean;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
};
export type MemberFormData = {
  firstName: string;
  lastName: string;
  about: string,
  role: string;
  memberRole:[string],
  facebook?: string;
  linkedin?: string;
};

export type footerFormData = {
  id:any,
  email:string,
  phone:string | number,
  address:string,
  footerPara:string
}