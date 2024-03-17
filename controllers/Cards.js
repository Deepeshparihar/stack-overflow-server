import Upload from "../models/Upload.js";
import { initializeApp } from "firebase/app"; // Import from 'firebase/compat/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { google } from "googleapis";

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

const API_KEY = "AIzaSyD0Z32Zgc1O83K_ya4fY_8MpgoIQPsF6VY";
// Discovery URL for Perspective API
const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

export const uploadFile = async (req, res) => {
  try {
    const { text, userPosted, userId } = req.body;

    const client = await google.discoverAPI(DISCOVERY_URL);

    // console.log(client);

    // Analyze text for toxicity using Perspective API
    const analyzeRequest = {
      comment: {
        text: text,
      },
      requestedAttributes: {
        TOXICITY: {},
      },
    };

    // console.log(analyzeRequest);

    const response = await client.comments.analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    // console.log(response);

    // Check if the content is toxic
    const toxicityScore =
      response.data.attributeScores.TOXICITY.summaryScore.value;

    if (toxicityScore > 0.1) {
      return res
        .status(400)
        .json({ message: "Content is too toxic and cannot be uploaded." });
    }
    // console.log(res);

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
