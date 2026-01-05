import ManageFooterContactContainer from "../Update/ContactForm";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { footerFormData } from "types";
import { db } from "libs";
import { PageHeader } from "components";

const ManageFooter = () => {
  const [data, setData] = useState<footerFormData | null>(null);
  const [docId, setDocId] = useState<string>("");

  useEffect(() => {
    const fetchFooter = async () => {
      const snapshot = await getDocs(collection(db, "contact"));
      const docSnap = snapshot.docs[0];
      setDocId(docSnap.id);
      setData(docSnap.data() as footerFormData);
    };
    fetchFooter();
  }, []);

  if (!data) return null;

  return (
    <>
    <PageHeader title="Contact"/>
      <ManageFooterContactContainer
        id={docId}
        initialData={data}
      />
    </>
  );
};

export default ManageFooter;
