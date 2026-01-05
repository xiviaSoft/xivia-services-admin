import ManageGalleryTextContainer from "../Contact/ManageGalleryTextContainer";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PageHeader } from "components";
import { db } from "libs";
import { GalleryFormData } from "types";

const Gallery = () => {
  const [data, setData] = useState<GalleryFormData | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(db, "gallery-text");
        const snapshot = await getDocs(ref);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setDocId(doc.id);
          setData(doc.data() as GalleryFormData);
        }
      } catch (error) {
        console.error("Failed to fetch gallery text:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!docId || !data) {
    return <div>No gallery data found</div>;
  }

  return (
    <div>
      <PageHeader title="Gallery & About Us" />
      <ManageGalleryTextContainer id={docId} initialData={data} />
    </div>
  );
};

export default Gallery;
