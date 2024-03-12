import Upload from "../models/Upload.js";
import { initializeApp } from "firebase/app"; // Import from 'firebase/compat/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsPS-92Jj2WO1MaY2kFbs_au4OUc_8xwo",
  authDomain: "stackoverflow-clone-6f731.firebaseapp.com",
  projectId: "stackoverflow-clone-6f731",
  storageBucket: "stackoverflow-clone-6f731.appspot.com",
  messagingSenderId: "647857228555",
  appId: "1:647857228555:web:5a6b9e5188fa513224f00e",
  measurementId: "G-9QZQNM1F5Q",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage();

export const uploadFile = async (req, res) => {
  try {
    const { text, userPosted, userId } = req.body;

    let fileUrl = "";

    if (req.file) {
      const file = req.file;

      const metadata = {
        contentType: req.file.mimetype,
      };

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, file.originalname);

      // Upload file to Firebase Storage
      const uploadTask = uploadBytes(storageRef, file.buffer, metadata);

      // Wait for the upload to complete
      const snapshot = await uploadTask;

      fileUrl = await getDownloadURL(storageRef);
    }

    const newUpload = new Upload({ text, file: fileUrl, userPosted, userId });
    await newUpload.save();

    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUploads = async (req, res) => {
  try {
    const cards = await Upload.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
